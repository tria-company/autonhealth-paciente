// @mui material components
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import { Card, LinearProgress, Stack, MenuItem, Select, FormControl, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiProgress from "components/VuiProgress";
import VuiButton from "components/VuiButton";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";
import linearGradient from "assets/theme/functions/linearGradient";

import typography from "assets/theme/base/typography";
import colors from "assets/theme/base/colors";

// Dashboard layout components
import WelcomeMark from "layouts/dashboard/components/WelcomeMark";
import Projects from "layouts/dashboard/components/Projects";
import OrderOverview from "layouts/dashboard/components/OrderOverview";
import IdadeBiologica from "layouts/dashboard/components/IdadeBiologica";
import ReferralTracking from "layouts/dashboard/components/ReferralTracking";

// React icons
import { IoIosRocket } from "react-icons/io";
import { IoGlobe, IoBuild, IoWallet, IoWater, IoMoon, IoFitness } from "react-icons/io5";
import { IoDocumentText } from "react-icons/io5";
import { FaShoppingCart } from "react-icons/fa";

// Data
import LineChart from "examples/Charts/LineCharts/LineChart";
import BarChart from "examples/Charts/BarCharts/BarChart";
import { lineChartOptionsDashboard } from "layouts/dashboard/data/lineChartOptions";
import EquilibrioGeralWidget from "layouts/dashboard/components/EquilibrioGeralWidget";
import { barChartDataDashboard } from "layouts/dashboard/data/barChartData";
import { barChartOptionsDashboard } from "layouts/dashboard/data/barChartOptions";

// Hooks e funções
import { usePaciente } from "hooks/usePaciente";
import { buscarMetricasPaciente, buscarHistoricoCheckins, processarDadosGrafico } from "lib/checkins";
import { buscarHabitosVidaPaciente } from "lib/alimentacao";

function Dashboard() {
  const { gradients } = colors;
  const { cardContent } = gradients;
  const { paciente, loading: loadingPaciente } = usePaciente();
  const location = useLocation();

  const [metricas, setMetricas] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [dadosGrafico, setDadosGrafico] = useState(null);
  const [habitosVida, setHabitosVida] = useState(null); // Meta água, exercício e sono (igual à alimentação)
  const [periodo, setPeriodo] = useState(7); // Período padrão: 7 dias
  const [loading, setLoading] = useState(true);

  // Resetar estado quando a rota mudar
  useEffect(() => {
    setMetricas(null);
    setHistorico([]);
    setDadosGrafico(null);
    setHabitosVida(null);
    setLoading(true);
  }, [location.pathname]);

  // Função para carregar dados
  const carregarDados = async () => {
    // Aguardar o paciente carregar
    if (loadingPaciente) {
      setLoading(true);
      return;
    }

    // Verificar se tem paciente
    if (!paciente || !paciente.id) {
      setLoading(false);
      return;
    }

    console.log('📊 Carregando dados do dashboard para paciente:', paciente.id);

    try {
      setLoading(true);
      
      // Timeout de segurança: 10 segundos
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout ao carregar dados')), 10000);
      });

      // Buscar métricas, histórico e hábitos (água, exercício, sono - mesma fonte da alimentação) em paralelo
      const dataPromise = Promise.all([
        buscarMetricasPaciente(paciente.id),
        buscarHistoricoCheckins(paciente.id, periodo),
        buscarHabitosVidaPaciente(paciente.id)
      ]);

      const [metricasData, historicoData, habitosData] = await Promise.race([
        dataPromise,
        timeoutPromise
      ]);

      setMetricas(metricasData);
      setHistorico(historicoData);
      setHabitosVida(habitosData || null);

      // Processar dados para o gráfico
      if (historicoData && historicoData.length > 0) {
        const dadosProcessados = processarDadosGrafico(historicoData);
        setDadosGrafico(dadosProcessados);
      } else {
        setDadosGrafico(null);
      }
      
      console.log('✅ Dados do dashboard carregados com sucesso');
    } catch (err) {
      console.error('❌ Erro ao carregar dados do dashboard:', err);
      
      // Se for timeout, mostrar mensagem específica
      if (err.message.includes('Timeout')) {
        console.error('⏱️ Timeout ao carregar dados do dashboard');
      }
      
      // Mesmo com erro, não deixar em loading infinito
      // Apenas manter os dados anteriores se houver
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados quando paciente estiver disponível
  useEffect(() => {
    let mounted = true;

    if (!loadingPaciente && paciente?.id && mounted) {
      carregarDados();
    }

    return () => {
      mounted = false;
    };
  }, [paciente?.id, loadingPaciente, periodo, location.pathname]);

  // Sistema de refresh automático removido para evitar loops
  // Os dados são carregados normalmente quando o componente monta ou quando as dependências mudam

  // Estado de carregamento
  if (loading || loadingPaciente) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <VuiBox pt={3} pb={6} display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
          <CircularProgress sx={{ color: "#2c3e50" }} />
        </VuiBox>
        <Footer />
      </DashboardLayout>
    );
  }

  // Sem dados de check-in
  if (!metricas) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <VuiBox pt={3} pb={6}>
          <WelcomeMark />
          <VuiBox mt={3}>
            <Card
              sx={{
                borderRadius: "20px",
                background: linearGradient(cardContent.main, cardContent.state, cardContent.deg),
                textAlign: "center",
                p: 6,
              }}
            >
              <VuiTypography variant="h5" color="white" fontWeight="bold" mb={2}>
                Nenhum Check-in Realizado
              </VuiTypography>
              <VuiTypography variant="body2" color="text" fontWeight="regular" mb={3}>
                Complete seu primeiro check-in diário para visualizar suas métricas e acompanhar seu progresso.
              </VuiTypography>
              <VuiButton
                component={Link}
                to="/checkin-diarios"
                color="info"
                size="medium"
                sx={{ mt: 1 }}
              >
                <Icon sx={{ mr: 0.5 }}>add_circle</Icon>
                Fazer Check-in
              </VuiButton>
            </Card>
          </VuiBox>
        </VuiBox>
        <Footer />
      </DashboardLayout>
    );
  }

  // Formatar valores para exibição
  const equilibrioGeral = metricas.equilibrio_geral?.toFixed(1) || "0.0";

  // Hidratação: média do período a partir do histórico de check-ins (respeita filtro de período)
  const metaAguaLitros = habitosVida?.metaAguaMl != null ? habitosVida.metaAguaMl / 1000 : null;
  const metaAguaNum = (metaAguaLitros != null && !Number.isNaN(metaAguaLitros)) ? metaAguaLitros : 2.4;
  const hidratacaoMediaPeriodo = historico?.length > 0
    ? historico.reduce((acc, c) => acc + (Number(c.alimentacao_agua_litros) || 0), 0) / historico.length
    : null;
  const hidratacaoAtualNum = hidratacaoMediaPeriodo != null ? hidratacaoMediaPeriodo : (metricas.hidratacao_atual_litros ?? 0);
  const hidratacaoAtual = hidratacaoAtualNum != null ? Number(hidratacaoAtualNum).toFixed(1) : "0.0";
  const hidratacaoMeta = metaAguaNum.toFixed(1);
  const hidratacaoPercentual = (metaAguaNum > 0 && hidratacaoAtualNum != null)
    ? Math.min(100, Math.round((hidratacaoAtualNum / metaAguaNum) * 100))
    : null;

  // Exercício: prescrição (pilar2, min/dia) vs realizado no check-in (média do período)
  const exercicioMetaMin = habitosVida?.exercicioDuracaoMin ?? null;
  const exercicioAtualMin = historico?.length > 0
    ? Math.round(
        (historico.reduce((acc, c) => acc + (Number(c.atividade_tempo_horas) || 0), 0) / historico.length) * 60
      )
    : 0;
  const exercicioMetaNum = exercicioMetaMin != null && exercicioMetaMin > 0 ? exercicioMetaMin : 60;
  const exercicioPercentual = exercicioMetaNum > 0
    ? Math.min(100, Math.round((exercicioAtualMin / exercicioMetaNum) * 100))
    : null;

  // Qualidade do sono: média do período a partir do histórico de check-ins (respeita filtro de período)
  const sonoMetaHoras = habitosVida?.sonoDuracaoHoras ?? null;
  const sonoMediaPeriodo = historico?.length > 0
    ? historico.reduce((acc, c) => acc + (Number(c.sono_tempo_horas) || 0), 0) / historico.length
    : null;
  const sonoAtualHoras = sonoMediaPeriodo != null ? sonoMediaPeriodo : (metricas.qualidade_sono_horas ?? 0);
  const sonoMetaNum = sonoMetaHoras != null && sonoMetaHoras > 0 ? sonoMetaHoras : 8;
  const sonoPercentual = sonoMetaNum > 0
    ? Math.min(100, Math.round((sonoAtualHoras / sonoMetaNum) * 100))
    : null;

  const sonoHoras = sonoAtualHoras || 0;
  const sonoHorasFormatado = `${Math.floor(sonoHoras)}h:${Math.round((sonoHoras % 1) * 60)}min`;
  const sonoVariacao = metricas.qualidade_sono_variacao_minutos != null
    ? (metricas.qualidade_sono_variacao_minutos >= 0 ? `+${metricas.qualidade_sono_variacao_minutos}min` : `${metricas.qualidade_sono_variacao_minutos}min`)
    : "+0min";

  // Debug: Ver valores brutos das métricas
  console.log("📊 Métricas brutas do banco:", {
    equilibrio_sono: metricas.equilibrio_sono,
    equilibrio_atividade_fisica: metricas.equilibrio_atividade_fisica,
    equilibrio_alimentacao: metricas.equilibrio_alimentacao,
  });

  // Dimensões do equilíbrio integrativo
  const dimensoes = [
    { nome: "Sono", valor: metricas.equilibrio_sono?.toFixed(1) || "0.0" },
    { nome: "Atividade Física", valor: metricas.equilibrio_atividade_fisica?.toFixed(1) || "0.0" },
    { nome: "Alimentação", valor: metricas.equilibrio_alimentacao?.toFixed(1) || "0.0" },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox pt={3} pb={6}>
        {/* Filtro de Período */}
        <VuiBox mb={3} display="flex" justifyContent="flex-end">
          <FormControl variant="standard" sx={{ minWidth: 120 }}>
            <VuiTypography variant="caption" color="text" mb={1}>
              Período:
            </VuiTypography>
            <Select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              sx={{
                color: "white",
                "& .MuiSelect-icon": { color: "white" },
                "&:before": { borderColor: "rgba(255, 255, 255, 0.3)" },
                "&:after": { borderColor: "#2c3e50" },
              }}
            >
              <MenuItem value={1}>Hoje</MenuItem>
              <MenuItem value={7}>Últimos 7 dias</MenuItem>
              <MenuItem value={15}>Últimos 15 dias</MenuItem>
              <MenuItem value={30}>Últimos 30 dias</MenuItem>
              <MenuItem value={90}>Últimos 90 dias</MenuItem>
            </Select>
          </FormControl>
        </VuiBox>

        <VuiBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4} sx={{ display: "flex" }}>
              <VuiBox sx={{ width: "100%", minHeight: 110 }}>
                <MiniStatisticsCard
                  title={{ text: "Qualidade do sono" }}
                  count={sonoMetaHoras != null ? `${sonoHorasFormatado} / ${sonoMetaHoras.toFixed(1)}h` : sonoHorasFormatado}
                  percentage={{ 
                    color: sonoPercentual != null ? (sonoPercentual >= 100 ? "success" : "error") : (metricas.qualidade_sono_variacao_minutos >= 0 ? "success" : "error"), 
                    text: sonoPercentual != null ? (sonoPercentual >= 100 ? `${sonoPercentual}%` : `↓ ${sonoPercentual}%`) : sonoVariacao 
                  }}
                  icon={{ color: "info", component: <IoMoon size="22px" color="white" /> }}
                />
              </VuiBox>
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: "flex" }}>
              <VuiBox sx={{ width: "100%", minHeight: 110 }}>
                <MiniStatisticsCard
                  title={{ text: "Exercício" }}
                  count={`${exercicioAtualMin} min / ${exercicioMetaNum} min`}
                  percentage={{ 
                    color: exercicioPercentual != null && exercicioPercentual >= 100 ? "success" : "error", 
                    text: exercicioPercentual != null ? (exercicioPercentual >= 100 ? `${exercicioPercentual}%` : `↓ ${exercicioPercentual}%`) : "" 
                  }}
                  icon={{ color: "info", component: <IoFitness size="22px" color="white" /> }}
                />
              </VuiBox>
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: "flex" }}>
              <VuiBox sx={{ width: "100%", minHeight: 110 }}>
                <MiniStatisticsCard
                  title={{ text: "Hidratação" }}
                  count={`${hidratacaoAtual} L / ${hidratacaoMeta} L`}
                  percentage={{ 
                    color: parseFloat(hidratacaoAtual) >= parseFloat(hidratacaoMeta) ? "success" : "error", 
                    text: hidratacaoPercentual != null ? (parseFloat(hidratacaoAtual) >= parseFloat(hidratacaoMeta) ? `${hidratacaoPercentual}%` : `↓ ${hidratacaoPercentual}%`) : "" 
                  }}
                  icon={{ color: "info", component: <IoWater size="22px" color="white" /> }}
                />
              </VuiBox>
            </Grid>
          </Grid>
        </VuiBox>
        <VuiBox mb={3}>
          <Grid container spacing="18px">
            <Grid item xs={12} lg={12} xl={5}>
              <WelcomeMark />
            </Grid>
            <Grid item xs={12} lg={6} xl={3}>
              <IdadeBiologica />
            </Grid>
            <Grid item xs={12} lg={6} xl={4}>
              <ReferralTracking periodo={periodo} />
            </Grid>
          </Grid>
        </VuiBox>
        <VuiBox mb={3}>
          <Card>
            <VuiBox p="24px">
              <VuiTypography variant="lg" color="white" fontWeight="bold" mb="4px" component="div" sx={{ display: 'block' }}>
                Equilíbrio Integrativo
              </VuiTypography>
              <VuiTypography variant="button" color="text" fontWeight="regular" mb="24px" component="div" sx={{ display: 'block' }}>
                Avaliação geral do paciente nos últimos 7 dias
              </VuiTypography>
              <Grid container spacing={3} alignItems="stretch">
                <Grid item xs={12} xl={5}>
                  <Grid container spacing={3}>
                    {dimensoes.map((dimensao, index) => (
                      <Grid key={index} item xs={12} sm={6}>
                        <Card sx={{
                          height: 90,
                          borderRadius: '20px',
                          background: linearGradient(
                            cardContent.main,
                            cardContent.state,
                            cardContent.deg
                          ),
                        }}>
                          <VuiBox p="14px" sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <VuiTypography color="text" variant="button" fontWeight="regular" mb="4px" sx={{ display: 'block' }}>
                              {dimensao.nome}
                            </VuiTypography>
                            <VuiTypography color="white" variant="lg" fontWeight="bold" sx={{ display: 'block' }}>
                              {dimensao.valor}
                            </VuiTypography>
                          </VuiBox>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
                <Grid item xs={12} xl={3}>
                  <EquilibrioGeralWidget value={parseFloat(equilibrioGeral)} />
                </Grid>
                <Grid item xs={12} xl={4}>
                  <Card sx={{ height: 340 }}>
                    <VuiBox sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                      <VuiBox sx={{ height: 300, width: '100%' }}>
                        {dadosGrafico && dadosGrafico.labels.length > 0 ? (
                          <LineChart
                            lineChartData={dadosGrafico.datasets}
                            lineChartOptions={lineChartOptionsDashboard}
                          />
                        ) : (
                          <VuiBox display="flex" justifyContent="center" alignItems="center" height="100%">
                            <VuiTypography variant="body2" color="text" textAlign="center">
                              Realize mais check-ins para visualizar o gráfico de evolução
                            </VuiTypography>
                          </VuiBox>
                        )}
                      </VuiBox>
                    </VuiBox>
                  </Card>
                </Grid>
              </Grid>
            </VuiBox>
          </Card>
        </VuiBox>
        {/* Removed Projects and Orders overview section as requested */}
      </VuiBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;

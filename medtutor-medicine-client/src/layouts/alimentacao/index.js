import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";

import { IoLeafOutline, IoTimeOutline, IoWaterOutline, IoNutritionOutline } from "react-icons/io5";

// Vision UI components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";

// Layout
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Theme helpers
import colors from "assets/theme/base/colors";
import linearGradient from "assets/theme/functions/linearGradient";

// Hooks e funções
import { usePaciente } from "hooks/usePaciente";
import { buscarAlimentacaoPaciente, processarDadosAlimentacao, buscarMetaAguaPaciente } from "lib/alimentacao";

const Alimentacao = () => {
  const { paciente, loading: loadingPaciente } = usePaciente();
  const location = useLocation();
  const [dadosAlimentacao, setDadosAlimentacao] = useState(null);
  const [metaAguaMl, setMetaAguaMl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const { gradients } = colors;
  const { cardContent, info, success } = gradients;

  // Resetar estado quando a rota mudar
  useEffect(() => {
    setDadosAlimentacao(null);
    setMetaAguaMl(null);
    setLoading(true);
    setErro(null);
  }, [location.pathname]);

  // Função para carregar dados
  const carregarDados = async () => {
    if (loadingPaciente) {
      setLoading(true);
      return;
    }

    if (!paciente || !paciente.id) {
      setLoading(false);
      setErro('Paciente não encontrado');
      return;
    }

    console.log('🍽️ Carregando dados de alimentação para paciente:', paciente.id);

    try {
      setLoading(true);
      const [alimentos, aguaMl] = await Promise.all([
        buscarAlimentacaoPaciente(paciente.id),
        buscarMetaAguaPaciente(paciente.id),
      ]);
      const dadosProcessados = processarDadosAlimentacao(alimentos);
      setDadosAlimentacao(dadosProcessados);
      setMetaAguaMl(aguaMl);
      setErro(null);
    } catch (error) {
      console.error('❌ Erro ao carregar alimentação:', error);
      setErro('Erro ao carregar dados de alimentação');
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados quando paciente estiver disponível
  useEffect(() => {
    if (!loadingPaciente && paciente?.id) {
      carregarDados();
    }
  }, [paciente?.id, loadingPaciente, location.pathname]);

  // Sistema de refresh automático removido para evitar loops

  // Estado de loading
  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <VuiBox pt={6} pb={6} display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <VuiBox textAlign="center">
            <CircularProgress size={60} sx={{ color: '#0075FF' }} />
            <VuiTypography variant="h6" color="white" mt={3}>
              Carregando plano alimentar...
            </VuiTypography>
          </VuiBox>
        </VuiBox>
      </DashboardLayout>
    );
  }

  // Estado de erro
  if (erro) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <VuiBox pt={6} pb={6} display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <VuiBox textAlign="center">
            <VuiTypography variant="h4" color="white" mb={2}>
              ⚠️ {erro}
            </VuiTypography>
            <VuiTypography variant="body2" color="text">
              Não foi possível carregar os dados de alimentação.
            </VuiTypography>
          </VuiBox>
        </VuiBox>
      </DashboardLayout>
    );
  }

  // Estado sem dados
  if (!dadosAlimentacao || dadosAlimentacao.refeicoes.length === 0) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <VuiBox pt={6} pb={6} display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <VuiBox textAlign="center">
            <VuiTypography variant="h4" color="white" mb={2}>
              📋 Nenhum plano alimentar cadastrado
            </VuiTypography>
            <VuiTypography variant="body2" color="text">
              Entre em contato com seu profissional para receber seu plano personalizado.
            </VuiTypography>
          </VuiBox>
        </VuiBox>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox pt={3} pb={6}>
        <VuiBox mb={4}>
          <VuiTypography variant="h3" color="white" fontWeight="bold" mb={1}>
            Plano Alimentar Personalizado
          </VuiTypography>
          <VuiTypography variant="body2" color="text" fontWeight="regular" sx={{ maxWidth: 720 }}>
            Plano alimentar baseado nos dados do seu profissional de saúde. 
            Siga as orientações de porções e horários para obter os melhores resultados.
          </VuiTypography>
        </VuiBox>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <Card
              sx={{
                borderRadius: "20px",
                background: linearGradient(cardContent.main, cardContent.state, cardContent.deg),
                height: "100%",
              }}
            >
              <VuiBox p={3} display="flex" flexDirection="column" gap={1.5}>
                <VuiBox display="flex" alignItems="center" gap={1.5}>
                  <IoNutritionOutline size={28} color="#00d4ff" />
                  <VuiTypography variant="h6" color="white" fontWeight="bold">
                    Calorias Totais
                  </VuiTypography>
                </VuiBox>
                <VuiTypography variant="h3" color="white" fontWeight="bold">
                  {dadosAlimentacao.totalCalorias} kcal
                </VuiTypography>
                <VuiTypography variant="caption" color="text">
                  Total de calorias do plano alimentar
                </VuiTypography>
              </VuiBox>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Card
              sx={{
                borderRadius: "20px",
                background: linearGradient(cardContent.main, success.state, success.deg),
                height: "100%",
              }}
            >
              <VuiBox p={3} display="flex" flexDirection="column" gap={1.5}>
                <VuiBox display="flex" alignItems="center" gap={1.5}>
                  <IoLeafOutline size={28} color="#01b574" />
                  <VuiTypography variant="h6" color="white" fontWeight="bold">
                    Total de Refeições
                  </VuiTypography>
                </VuiBox>
                <VuiTypography variant="h3" color="white" fontWeight="bold">
                  {dadosAlimentacao.refeicoes.length}
                </VuiTypography>
                <VuiTypography variant="caption" color="text">
                  Refeições distribuídas ao longo do dia
                </VuiTypography>
              </VuiBox>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Card
              sx={{
                borderRadius: "20px",
                background: linearGradient(cardContent.main, info.state, info.deg),
                height: "100%",
              }}
            >
              <VuiBox p={3} display="flex" flexDirection="column" gap={1.5}>
                <VuiBox display="flex" alignItems="center" gap={1.5}>
                  <IoWaterOutline size={28} color="#2E72AC" />
                  <VuiTypography variant="h6" color="white" fontWeight="bold">
                    Meta de Água
                  </VuiTypography>
                </VuiBox>
                <VuiTypography variant="h3" color="white" fontWeight="bold">
                  {metaAguaMl != null && !Number.isNaN(metaAguaMl) && metaAguaMl >= 0
                    ? `${(metaAguaMl / 1000).toFixed(1)} L`
                    : "—"}
                </VuiTypography>
                <VuiTypography variant="caption" color="text">
                  Quantidade de água a ingerir por dia
                </VuiTypography>
              </VuiBox>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Card
              sx={{
                borderRadius: "20px",
                background: linearGradient(cardContent.main, cardContent.state, "165deg"),
                height: "100%",
              }}
            >
              <VuiBox p={3} display="flex" flexDirection="column" gap={1.5}>
                <VuiBox display="flex" alignItems="center" gap={1.5}>
                  <IoTimeOutline size={28} color="#f9cf05" />
                  <VuiTypography variant="h6" color="white" fontWeight="bold">
                    Acompanhamento
                  </VuiTypography>
                </VuiBox>
                <VuiTypography variant="body2" color="text">
                  Siga as orientações do seu profissional de saúde
                </VuiTypography>
                <VuiTypography variant="caption" color="text">
                  Ajuste conforme necessário
                </VuiTypography>
              </VuiBox>
            </Card>
          </Grid>
        </Grid>

        <VuiBox mt={6}>
          <VuiTypography variant="h4" color="white" fontWeight="bold" mb={3}>
            Distribuição das Refeições
          </VuiTypography>
          <Grid container spacing={3}>
            {dadosAlimentacao.refeicoes.map((refeicao) => (
              <Grid item xs={12} md={6} key={refeicao.id}>
                <Card
                  sx={{
                    borderRadius: "20px",
                    background: linearGradient(cardContent.main, cardContent.state, cardContent.deg),
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <VuiBox p={3} sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                    <VuiBox display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
                      <VuiBox>
                        <VuiTypography variant="caption" color="text" fontWeight="medium">
                          {refeicao.kcal} kcal
                        </VuiTypography>
                        <VuiTypography variant="h5" color="white" fontWeight="bold">
                          {refeicao.nome}
                        </VuiTypography>
                      </VuiBox>
                      <Chip
                        label={`${refeicao.itens.length} ${refeicao.itens.length === 1 ? 'alimento' : 'alimentos'}`}
                        sx={{
                          backgroundColor: "rgba(255, 255, 255, 0.08)",
                          color: "#FFFFFF",
                          fontWeight: "bold",
                        }}
                      />
                    </VuiBox>

                    <VuiBox
                      sx={{
                        background: "rgba(255, 255, 255, 0.03)",
                        borderRadius: "14px",
                        overflow: "hidden",
                      }}
                    >
                      <VuiBox display="grid" gridTemplateColumns="1.2fr 0.8fr 0.5fr" px={3} py={1.5}>
                        <VuiTypography variant="caption" color="text" fontWeight="medium">
                          Alimento
                        </VuiTypography>
                        <VuiTypography variant="caption" color="text" fontWeight="medium">
                          Quantidade
                        </VuiTypography>
                        <VuiTypography variant="caption" color="text" fontWeight="medium" textAlign="right">
                          kcal
                        </VuiTypography>
                      </VuiBox>
                      <Divider sx={{ backgroundColor: "rgba(255, 255, 255, 0.08)" }} />
                      <VuiBox
                        sx={{
                          maxHeight: "320px",
                          overflowY: "auto",
                          "&::-webkit-scrollbar": {
                            width: "6px",
                          },
                          "&::-webkit-scrollbar-track": {
                            background: "rgba(255, 255, 255, 0.05)",
                            borderRadius: "10px",
                          },
                          "&::-webkit-scrollbar-thumb": {
                            background: "rgba(255, 255, 255, 0.2)",
                            borderRadius: "10px",
                            "&:hover": {
                              background: "rgba(255, 255, 255, 0.3)",
                            },
                          },
                        }}
                      >
                        {refeicao.itens.map((item, index) => (
                          <VuiBox
                            key={`${item.alimento}-${index}`}
                            display="grid"
                            gridTemplateColumns="1.2fr 0.8fr 0.5fr"
                            px={3}
                            py={1.25}
                            sx={{
                              backgroundColor:
                                index % 2 === 0 ? "rgba(255, 255, 255, 0.02)" : "rgba(255, 255, 255, 0.06)",
                            }}
                          >
                            <VuiTypography variant="body2" color="white" fontWeight="medium">
                              {item.alimento}
                            </VuiTypography>
                            <VuiTypography variant="body2" color="text">
                              {item.quantidade}
                            </VuiTypography>
                            <VuiTypography variant="body2" color="white" textAlign="right" fontWeight="bold">
                              {Math.round(item.kcal)}
                            </VuiTypography>
                          </VuiBox>
                        ))}
                      </VuiBox>
                    </VuiBox>

                    <VuiBox mt="auto">
                      <Divider sx={{ my: 3, backgroundColor: "rgba(255, 255, 255, 0.08)" }} />
                      <VuiTypography variant="caption" color="text">
                        Siga as orientações do seu profissional de saúde. 
                        Qualquer alteração no plano deve ser discutida previamente.
                      </VuiTypography>
                    </VuiBox>
                  </VuiBox>
                </Card>
              </Grid>
            ))}
          </Grid>
        </VuiBox>
      </VuiBox>
      <Footer />
    </DashboardLayout>
  );
};

export default Alimentacao;



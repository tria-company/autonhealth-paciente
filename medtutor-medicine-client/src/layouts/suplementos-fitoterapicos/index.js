import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import Grid from "@mui/material/Grid";
import { Card, CircularProgress, Chip } from "@mui/material";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";

// Vision UI Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Vision UI Dashboard React base styles
import colors from "assets/theme/base/colors";
import linearGradient from "assets/theme/functions/linearGradient";
import { IoWarning, IoFlask, IoLeaf, IoFlower } from "react-icons/io5";
import { FaCapsules, FaPills } from "react-icons/fa";
import { GiHerbsBundle } from "react-icons/gi";

// Hooks e funções
import { buscarSuplementacao } from "lib/suplementacao";
import { usePaciente } from "hooks/usePaciente";

// Função para obter ícone e cor baseado na categoria
const getCategoriaInfo = (categoria) => {
  const categorias = {
    suplementos: { Icon: FaCapsules, color: "#2c3e50", label: "Suplemento" },
    fitoterapicos: { Icon: IoLeaf, color: "#01b574", label: "Fitoterápico" },
    homeopatia: { Icon: GiHerbsBundle, color: "#9f7aea", label: "Homeopatia" },
    florais_bach: { Icon: IoFlower, color: "#f6ad55", label: "Floral de Bach" },
  };
  return categorias[categoria] || { Icon: IoFlask, color: "#4299e1", label: "Outro" };
};

// Função para formatar data
const formatarData = (data) => {
  if (!data || data === "Ongoing" || data === "ongoing") return "Em andamento";
  try {
    // Se já estiver formatada (DD/MM/YYYY), retornar como está
    if (data.includes("/")) return data;
    // Se for YYYY-MM-DD, converter para DD/MM/YYYY
    if (data.includes("-")) {
      const [year, month, day] = data.split("-");
      return `${day}/${month}/${year}`;
    }
    return data;
  } catch (e) {
    return data;
  }
};

const SuplementosFitoterapicos = () => {
  const { gradients } = colors;
  const { cardContent } = gradients;
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [itens, setItens] = useState([]);
  const { paciente, loading: loadingPaciente } = usePaciente();

  // Resetar estado quando a rota mudar
  useEffect(() => {
    setItens([]);
    setLoading(true);
    setError(null);
  }, [location.pathname]);

  // Dados mockados (fallback)
  const suplementosMockados = [
    {
      id: 1,
      nome: "Vitamina D3 + K2",
      objetivo: "Corrigir deficiência severa de vitamina D (12 ng/mL) identificada em exame, para restaurar função imune, saúde óssea e regulação hormonal.",
      dosagem: "10.000 UI D3 + 100mcg K2 MK-7",
      horario: "Café da manhã com gordura",
      inicio: "01/11/2025",
      termino: "01/05/2026",
      criticidade: "CRÍTICO",
      observacaoCritica: "Tomar com gordura para absorção",
      iconColor: "#F9CF05",
      Icon: FaCapsules,
    },
    {
      id: 2,
      nome: "Magnésio Glicinato",
      objetivo: "Reduzir câimbras musculares, melhorar qualidade do sono e função neuromuscular.",
      dosagem: "400mg (citrato/glicinato)",
      horario: "Jantar",
      inicio: "15/10/2025",
      termino: "15/04/2026",
      criticidade: null,
      observacaoCritica: null,
      iconColor: "#2c3e50",
      Icon: IoFlask,
    },
    {
      id: 3,
      nome: "Ômega 3",
      objetivo: "Suporte anti-inflamatório, saúde cardiovascular e função cognitiva.",
      dosagem: "2g (EPA + DHA)",
      horario: "Café da manhã",
      inicio: "01/09/2025",
      termino: "Ongoing",
      criticidade: null,
      observacaoCritica: null,
      iconColor: "#01b574",
      Icon: IoLeaf,
    },
    {
      id: 4,
      nome: "Coenzima Q10",
      objetivo: "Energia celular, saúde cardiovascular e antioxidante.",
      dosagem: "200mg",
      horario: "Manhã",
      inicio: "01/12/2025",
      termino: "01/06/2026",
      criticidade: null,
      observacaoCritica: null,
      iconColor: "#4299e1",
      Icon: FaPills,
    },
    {
      id: 5,
      nome: "Probióticos",
      objetivo: "Equilibrar microbiota intestinal, melhorar digestão e função imune.",
      dosagem: "50 bilhões CFU",
      horario: "Em jejum",
      inicio: "01/10/2025",
      termino: "Ongoing",
      criticidade: null,
      observacaoCritica: null,
      iconColor: "#f6ad55",
      Icon: IoFlask,
    },
    {
      id: 6,
      nome: "Complexo B",
      objetivo: "Energia, função cognitiva e metabolismo de carboidratos.",
      dosagem: "B50 Complex",
      horario: "Manhã",
      inicio: "01/11/2025",
      termino: "01/05/2026",
      criticidade: null,
      observacaoCritica: null,
      iconColor: "#9f7aea",
      Icon: FaCapsules,
    },
  ];

  // Função para carregar dados
  const carregarDados = async () => {
    // Aguardar o carregamento do paciente antes de buscar os dados
    if (loadingPaciente) {
      console.log('⏳ Aguardando carregamento do paciente...');
      return;
    }

    console.log('🔍 Carregando dados de Suplementação...');
    console.log('👤 Paciente:', paciente);
    
    if (!paciente || !paciente.id) {
      console.log('❌ Paciente não encontrado ou sem ID');
      setLoading(false);
      setError("Paciente não encontrado");
      return;
    }

    console.log('✅ Paciente ID:', paciente.id);

    try {
      setLoading(true);
      const dados = await buscarSuplementacao(paciente.id);
      
      console.log('📦 Dados retornados:', dados);

      if (!dados) {
        setError("Nenhum dado de suplementação encontrado para este paciente");
        setLoading(false);
        return;
      }

      // Combinar todas as categorias em um único array
      const todosItens = [];
      let idCounter = 1;

      // Processar suplementos
      if (dados.suplementos && dados.suplementos.length > 0) {
        dados.suplementos.forEach((item) => {
          const categoriaInfo = getCategoriaInfo('suplementos');
          todosItens.push({
            id: idCounter++,
            categoria: 'suplementos',
            nome: item.nome || '',
            objetivo: item.objetivo || '',
            dosagem: item.dosagem || '',
            horario: item.horario || '',
            inicio: formatarData(item.inicio || ''),
            termino: formatarData(item.termino || ''),
            criticidade: null,
            observacaoCritica: null,
            iconColor: categoriaInfo.color,
            Icon: categoriaInfo.Icon,
          });
        });
      }

      // Processar fitoterápicos
      if (dados.fitoterapicos && dados.fitoterapicos.length > 0) {
        dados.fitoterapicos.forEach((item) => {
          const categoriaInfo = getCategoriaInfo('fitoterapicos');
          todosItens.push({
            id: idCounter++,
            categoria: 'fitoterapicos',
            nome: item.nome || '',
            objetivo: item.objetivo || '',
            dosagem: item.dosagem || '',
            horario: item.horario || '',
            inicio: formatarData(item.inicio || ''),
            termino: formatarData(item.termino || ''),
            criticidade: null,
            observacaoCritica: null,
            iconColor: categoriaInfo.color,
            Icon: categoriaInfo.Icon,
          });
        });
      }

      // Processar homeopatia
      if (dados.homeopatia && dados.homeopatia.length > 0) {
        dados.homeopatia.forEach((item) => {
          const categoriaInfo = getCategoriaInfo('homeopatia');
          todosItens.push({
            id: idCounter++,
            categoria: 'homeopatia',
            nome: item.nome || '',
            objetivo: item.objetivo || '',
            dosagem: item.dosagem || '',
            horario: item.horario || '',
            inicio: formatarData(item.inicio || ''),
            termino: formatarData(item.termino || ''),
            criticidade: null,
            observacaoCritica: null,
            iconColor: categoriaInfo.color,
            Icon: categoriaInfo.Icon,
          });
        });
      }

      // Processar florais de Bach
      if (dados.florais_bach && dados.florais_bach.length > 0) {
        dados.florais_bach.forEach((item) => {
          const categoriaInfo = getCategoriaInfo('florais_bach');
          todosItens.push({
            id: idCounter++,
            categoria: 'florais_bach',
            nome: item.nome || '',
            objetivo: item.objetivo || '',
            dosagem: item.dosagem || '',
            horario: item.horario || '',
            inicio: formatarData(item.inicio || ''),
            termino: formatarData(item.termino || ''),
            criticidade: null,
            observacaoCritica: null,
            iconColor: categoriaInfo.color,
            Icon: categoriaInfo.Icon,
          });
        });
      }

      console.log('📊 Total de itens processados:', todosItens.length);
      setItens(todosItens);
      setLoading(false);
    } catch (err) {
      console.error('Erro ao carregar Suplementação:', err);
      setError("Erro ao carregar os dados de suplementação");
      setLoading(false);
    }
  };

  // Buscar dados quando paciente estiver disponível
  useEffect(() => {
    if (!loadingPaciente && paciente?.id) {
      carregarDados();
    }
  }, [paciente?.id, loadingPaciente, location.pathname]);

  // Sistema de refresh automático removido para evitar loops

  // Loading state
  if (loadingPaciente || loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <VuiBox pt={3} pb={6} display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <VuiBox textAlign="center">
            <CircularProgress sx={{ color: "#2c3e50", mb: 2 }} />
            <VuiTypography variant="h6" color="white" fontWeight="medium">
              {loadingPaciente ? "Carregando informações do paciente..." : "Carregando Suplementação..."}
            </VuiTypography>
          </VuiBox>
        </VuiBox>
        <Footer />
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <VuiBox pt={3} pb={6}>
          <Card
            sx={{
              borderRadius: "20px",
              background: linearGradient(cardContent.main, cardContent.state, cardContent.deg),
            }}
          >
            <VuiBox p={3} textAlign="center">
              <VuiTypography variant="h5" color="white" fontWeight="bold" mb={2}>
                {error}
              </VuiTypography>
              <VuiTypography variant="body2" color="text" fontWeight="regular">
                Entre em contato com o suporte se o problema persistir.
              </VuiTypography>
            </VuiBox>
          </Card>
        </VuiBox>
        <Footer />
      </DashboardLayout>
    );
  }

  // Usar dados dinâmicos ou fallback
  const itensParaExibir = itens.length > 0 ? itens : suplementosMockados;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox pt={3} pb={6}>
        <VuiBox mb={3}>
          <VuiTypography variant="h4" color="white" fontWeight="bold" mb={1}>
            Suplementos e Fitoterápicos
          </VuiTypography>
        </VuiBox>

        <Grid container spacing={3}>
          {itensParaExibir.map((suplemento) => {
            const IconComponent = suplemento.Icon;
            const categoriaInfo = suplemento.categoria ? getCategoriaInfo(suplemento.categoria) : null;
            return (
              <Grid item xs={12} md={4} key={suplemento.id}>
                <Card
                  sx={{
                    borderRadius: "20px",
                    background: linearGradient(cardContent.main, cardContent.state, cardContent.deg),
                    position: "relative",
                    overflow: "visible",
                    height: "100%",
                  }}
                >
                  <VuiBox p={4} position="relative">
                    {/* Ícone do suplemento */}
                    <VuiBox
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      mb={3}
                      sx={{
                        width: 100,
                        height: 100,
                        backgroundColor: suplemento.iconColor,
                        borderRadius: "50%",
                        mx: "auto",
                        position: "relative",
                        boxShadow: `0 8px 16px ${suplemento.iconColor}30`,
                      }}
                    >
                      <IconComponent size={50} color="#FFFFFF" />
                    </VuiBox>

                  {/* Nome do suplemento */}
                  <VuiBox textAlign="center" mb={2}>
                    <VuiTypography variant="h5" color="white" fontWeight="bold" mb={1}>
                      {suplemento.nome}
                    </VuiTypography>
                    {categoriaInfo && (
                      <Chip
                        label={categoriaInfo.label}
                        size="small"
                        sx={{
                          backgroundColor: `${suplemento.iconColor}20`,
                          color: suplemento.iconColor,
                          fontWeight: "medium",
                          border: `1px solid ${suplemento.iconColor}40`,
                        }}
                      />
                    )}
                  </VuiBox>

                  {/* Grid de informações */}
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <VuiBox>
                        <VuiTypography variant="caption" color="text" fontWeight="medium" mb={1}>
                          Objetivo
                        </VuiTypography>
                        <VuiBox
                          p={2}
                          sx={{
                            borderRadius: "15px",
                            background: "rgba(255, 255, 255, 0.05)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                          }}
                        >
                          <VuiTypography variant="body2" color="white" fontWeight="regular">
                            {suplemento.objetivo}
                          </VuiTypography>
                          {suplemento.criticidade && (
                            <VuiBox
                              mt={2}
                              display="flex"
                              alignItems="center"
                              p={2}
                              sx={{
                                borderRadius: "12px",
                                background: "rgba(249, 207, 5, 0.15)",
                                border: "1px solid rgba(249, 207, 5, 0.3)",
                              }}
                            >
                              <IoWarning size={24} color="#F9CF05" />
                              <VuiBox ml={2}>
                                <VuiTypography variant="button" color="#F9CF05" fontWeight="bold">
                                  {suplemento.criticidade}:
                                </VuiTypography>
                                <VuiTypography variant="body2" color="#F9CF05" fontWeight="regular">
                                  {suplemento.observacaoCritica}
                                </VuiTypography>
                              </VuiBox>
                            </VuiBox>
                          )}
                        </VuiBox>
                      </VuiBox>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <VuiBox>
                        <VuiTypography variant="caption" color="text" fontWeight="medium" mb={1}>
                          Dosagem
                        </VuiTypography>
                        <VuiBox
                          p={2}
                          sx={{
                            borderRadius: "15px",
                            background: "rgba(255, 255, 255, 0.05)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                          }}
                        >
                          <VuiTypography variant="body2" color="white" fontWeight="medium">
                            {suplemento.dosagem}
                          </VuiTypography>
                        </VuiBox>
                      </VuiBox>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <VuiBox>
                        <VuiTypography variant="caption" color="text" fontWeight="medium" mb={1}>
                          Horário
                        </VuiTypography>
                        <VuiBox
                          p={2}
                          sx={{
                            borderRadius: "15px",
                            background: "rgba(255, 255, 255, 0.05)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                          }}
                        >
                          <VuiTypography variant="body2" color="white" fontWeight="medium">
                            {suplemento.horario}
                          </VuiTypography>
                        </VuiBox>
                      </VuiBox>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <VuiBox>
                        <VuiTypography variant="caption" color="text" fontWeight="medium" mb={1}>
                          Início
                        </VuiTypography>
                        <VuiBox
                          p={2}
                          sx={{
                            borderRadius: "15px",
                            background: "rgba(255, 255, 255, 0.05)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                          }}
                        >
                          <VuiTypography variant="body2" color="white" fontWeight="medium">
                            {suplemento.inicio}
                          </VuiTypography>
                        </VuiBox>
                      </VuiBox>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <VuiBox>
                        <VuiTypography variant="caption" color="text" fontWeight="medium" mb={1}>
                          Término
                        </VuiTypography>
                        <VuiBox
                          p={2}
                          sx={{
                            borderRadius: "15px",
                            background: "rgba(255, 255, 255, 0.05)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                          }}
                        >
                          <VuiTypography variant="body2" color="white" fontWeight="medium">
                            {suplemento.termino}
                          </VuiTypography>
                        </VuiBox>
                      </VuiBox>
                    </Grid>
                  </Grid>
                </VuiBox>
              </Card>
            </Grid>
          );
          })}
        </Grid>
      </VuiBox>
      <Footer />
    </DashboardLayout>
  );
};

export default SuplementosFitoterapicos;


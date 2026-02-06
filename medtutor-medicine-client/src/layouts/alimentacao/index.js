import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";

import { IoLeafOutline, IoTimeOutline, IoWaterOutline, IoNutritionOutline } from "react-icons/io5";

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
import { buscarRefeicaoPaciente, processarDadosRefeicao, buscarMetaAguaPaciente } from "lib/alimentacao";

const Alimentacao = () => {
  const { paciente, loading: loadingPaciente } = usePaciente();
  const location = useLocation();
  const [dadosAlimentacao, setDadosAlimentacao] = useState(null);
  const [metaAguaMl, setMetaAguaMl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [viewRefeicao, setViewRefeicao] = useState({});
  const { gradients } = colors;
  const { cardContent, info, success } = gradients;

  // Resetar estado quando a rota mudar
  useEffect(() => {
    setDadosAlimentacao(null);
    setMetaAguaMl(null);
    setLoading(true);
    setErro(null);
    setViewRefeicao({});
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
      const [registroRefeicao, aguaMl] = await Promise.all([
        buscarRefeicaoPaciente(paciente.id),
        buscarMetaAguaPaciente(paciente.id),
      ]);
      const dadosProcessados = processarDadosRefeicao(registroRefeicao);
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
            <CircularProgress size={60} sx={{ color: '#2c3e50' }} />
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
      <VuiBox pt={{ xs: 2, md: 3 }} pb={{ xs: 4, md: 6 }}>
        <VuiBox mb={4}>
          <VuiTypography variant="h3" color="white" fontWeight="bold" mb={1} sx={{ fontSize: { xs: "1.35rem", sm: "1.6rem", md: "1.75rem" } }}>
            Plano Alimentar Personalizado
          </VuiTypography>
          <VuiTypography variant="body2" color="text" fontWeight="regular" sx={{ maxWidth: 720, fontSize: { xs: "0.8rem", md: "0.875rem" } }}>
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
              <VuiBox p={{ xs: 2, md: 3 }} display="flex" flexDirection="column" gap={1.5}>
                <VuiBox display="flex" alignItems="center" gap={1.5}>
                  <IoNutritionOutline size={24} color="#00d4ff" style={{ flexShrink: 0 }} />
                  <VuiTypography variant="h6" color="white" fontWeight="bold" sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}>
                    Calorias Totais
                  </VuiTypography>
                </VuiBox>
                <VuiTypography variant="h3" color="white" fontWeight="bold" sx={{ fontSize: { xs: "1.4rem", md: "1.75rem" } }}>
                  {dadosAlimentacao.totalCalorias} kcal
                </VuiTypography>
                <VuiTypography variant="caption" color="text" sx={{ fontSize: { xs: "0.75rem", md: "0.75rem" } }}>
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
              <VuiBox p={{ xs: 2, md: 3 }} display="flex" flexDirection="column" gap={1.5}>
                <VuiBox display="flex" alignItems="center" gap={1.5}>
                  <IoLeafOutline size={24} color="#01b574" style={{ flexShrink: 0 }} />
                  <VuiTypography variant="h6" color="white" fontWeight="bold" sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}>
                    Total de Refeições
                  </VuiTypography>
                </VuiBox>
                <VuiTypography variant="h3" color="white" fontWeight="bold" sx={{ fontSize: { xs: "1.4rem", md: "1.75rem" } }}>
                  {dadosAlimentacao.refeicoes.length}
                </VuiTypography>
                <VuiTypography variant="caption" color="text" sx={{ fontSize: { xs: "0.75rem", md: "0.75rem" } }}>
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
              <VuiBox p={{ xs: 2, md: 3 }} display="flex" flexDirection="column" gap={1.5}>
                <VuiBox display="flex" alignItems="center" gap={1.5}>
                  <IoWaterOutline size={24} color="#2c3e50" style={{ flexShrink: 0 }} />
                  <VuiTypography variant="h6" color="white" fontWeight="bold" sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}>
                    Meta de Água
                  </VuiTypography>
                </VuiBox>
                <VuiTypography variant="h3" color="white" fontWeight="bold" sx={{ fontSize: { xs: "1.4rem", md: "1.75rem" } }}>
                  {metaAguaMl != null && !Number.isNaN(metaAguaMl) && metaAguaMl >= 0
                    ? `${(metaAguaMl / 1000).toFixed(1)} L`
                    : "—"}
                </VuiTypography>
                <VuiTypography variant="caption" color="text" sx={{ fontSize: { xs: "0.75rem", md: "0.75rem" } }}>
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
              <VuiBox p={{ xs: 2, md: 3 }} display="flex" flexDirection="column" gap={1.5}>
                <VuiBox display="flex" alignItems="center" gap={1.5}>
                  <IoTimeOutline size={24} color="#f9cf05" style={{ flexShrink: 0 }} />
                  <VuiTypography variant="h6" color="white" fontWeight="bold" sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}>
                    Acompanhamento
                  </VuiTypography>
                </VuiBox>
                <VuiTypography variant="body2" color="text" sx={{ fontSize: { xs: "0.8rem", md: "0.875rem" } }}>
                  Siga as orientações do seu profissional de saúde
                </VuiTypography>
                <VuiTypography variant="caption" color="text" sx={{ fontSize: { xs: "0.75rem", md: "0.75rem" } }}>
                  Ajuste conforme necessário
                </VuiTypography>
              </VuiBox>
            </Card>
          </Grid>
        </Grid>

        <VuiBox mt={6}>
          <VuiTypography variant="h4" color="white" fontWeight="bold" mb={3} sx={{ fontSize: { xs: "1.15rem", sm: "1.25rem", md: "1.5rem" } }}>
            Distribuição das Refeições
          </VuiTypography>
          <Grid container spacing={3}>
            {dadosAlimentacao.refeicoes.map((refeicao) => (
              <Grid item xs={12} key={refeicao.id}>
                <Card
                  sx={{
                    borderRadius: "20px",
                    background: linearGradient(cardContent.main, cardContent.state, cardContent.deg),
                    overflow: "hidden",
                  }}
                >
                  <VuiBox p={{ xs: 2, md: 3 }}>
                    <VuiBox display="flex" alignItems="center" justifyContent="space-between" mb={2} flexWrap="wrap" gap={1}>
                      <VuiBox>
                        <VuiTypography variant="caption" color="text" fontWeight="medium" sx={{ fontSize: { xs: "0.75rem", md: "0.75rem" } }}>
                          {refeicao.totalKcal || 0} kcal
                        </VuiTypography>
                        <VuiTypography variant="h5" color="white" fontWeight="bold" sx={{ fontSize: { xs: "1.1rem", md: "1.25rem" } }}>
                          {refeicao.nome}
                        </VuiTypography>
                      </VuiBox>
                      <VuiBox
                        sx={{
                          display: "flex",
                          backgroundColor: "rgba(44, 62, 80, 0.5)",
                          borderRadius: "10px",
                          p: 0.25,
                        }}
                      >
                        <VuiBox
                          component="button"
                          onClick={() => setViewRefeicao((prev) => ({ ...prev, [refeicao.id]: "principal" }))}
                          sx={{
                            px: 2,
                            py: 0.75,
                            borderRadius: "8px",
                            border: "none",
                            cursor: "pointer",
                            fontWeight: "bold",
                            fontSize: { xs: "0.8rem", md: "0.85rem" },
                            transition: "all 0.2s",
                            backgroundColor: (viewRefeicao[refeicao.id] || "principal") === "principal" ? "#1e3a5f" : "rgba(44, 62, 80, 0.4)",
                            color: (viewRefeicao[refeicao.id] || "principal") === "principal" ? "#fff" : "rgba(255,255,255,0.6)",
                          }}
                        >
                          Principal
                        </VuiBox>
                        <VuiBox
                          component="button"
                          onClick={() => setViewRefeicao((prev) => ({ ...prev, [refeicao.id]: "substituicoes" }))}
                          sx={{
                            px: 2,
                            py: 0.75,
                            borderRadius: "8px",
                            border: "none",
                            cursor: "pointer",
                            fontWeight: "bold",
                            fontSize: { xs: "0.8rem", md: "0.85rem" },
                            transition: "all 0.2s",
                            backgroundColor: (viewRefeicao[refeicao.id] || "principal") === "substituicoes" ? "#1e3a5f" : "rgba(44, 62, 80, 0.4)",
                            color: (viewRefeicao[refeicao.id] || "principal") === "substituicoes" ? "#fff" : "rgba(255,255,255,0.6)",
                          }}
                        >
                          Substituições
                        </VuiBox>
                      </VuiBox>
                    </VuiBox>

                    {(viewRefeicao[refeicao.id] || "principal") === "principal" ? (
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <VuiBox
                          sx={{
                            background: "rgba(46, 114, 172, 0.15)",
                            borderRadius: "14px",
                            p: { xs: 2.5, md: 2 },
                            width: "100%",
                            minWidth: { xs: "100%", md: 400 },
                            height: "100%",
                          }}
                        >
                          <VuiBox display="grid" gridTemplateColumns={{ xs: "1fr 1.4fr 0.9fr 0.6fr", md: "1fr 1.2fr 0.8fr 0.5fr" }} px={{ xs: 1.5, md: 1 }} py={{ xs: 1, md: 0.5 }} gap={{ xs: 0.5, md: 0 }}>
                            <VuiTypography variant="caption" color="text" fontWeight="medium" sx={{ fontSize: { xs: "0.85rem", md: "0.75rem" } }}>Categoria</VuiTypography>
                            <VuiTypography variant="caption" color="text" fontWeight="medium" sx={{ fontSize: { xs: "0.85rem", md: "0.75rem" } }}>Alimento</VuiTypography>
                            <VuiTypography variant="caption" color="text" fontWeight="medium" sx={{ fontSize: { xs: "0.85rem", md: "0.75rem" } }}>Qtd</VuiTypography>
                            <VuiTypography variant="caption" color="text" fontWeight="medium" textAlign="right" sx={{ fontSize: { xs: "0.85rem", md: "0.75rem" } }}>kcal</VuiTypography>
                          </VuiBox>
                          <Divider sx={{ backgroundColor: "rgba(255, 255, 255, 0.1)", my: 1 }} />
                          {(refeicao.refeicaoPrincipal?.itens || []).length > 0 ? (
                            (refeicao.refeicaoPrincipal.itens || []).map((item, index) => (
                              <VuiBox
                                key={`principal-${index}`}
                                display="grid"
                                gridTemplateColumns={{ xs: "1fr 1.4fr 0.9fr 0.6fr", md: "1fr 1.2fr 0.8fr 0.5fr" }}
                                px={{ xs: 1.5, md: 1.5 }}
                                py={{ xs: 1, md: 1 }}
                                gap={{ xs: 0.5, md: 0 }}
                                sx={{
                                  backgroundColor: "#FFFFFF",
                                  borderRadius: "10px",
                                  borderLeft: "4px solid #1e3a5f",
                                  mb: 1,
                                  "&:last-of-type": { mb: 0 },
                                }}
                              >
                                <VuiTypography variant="caption" textTransform="capitalize" sx={{ fontSize: { xs: "0.85rem", md: "0.75rem" }, color: "#2c3e50" }}>{(item.categoria || "").replace(/_/g, " ")}</VuiTypography>
                                <VuiTypography variant="body2" fontWeight="medium" sx={{ fontSize: { xs: "0.9rem", md: "0.875rem" }, color: "#2c3e50" }}>{item.alimento}</VuiTypography>
                                <VuiTypography variant="body2" sx={{ fontSize: { xs: "0.9rem", md: "0.875rem" }, color: "#2c3e50" }}>{item.quantidade}</VuiTypography>
                                <VuiTypography variant="body2" textAlign="right" fontWeight="bold" sx={{ fontSize: { xs: "0.9rem", md: "0.875rem" }, color: "#2c3e50" }}>{Math.round(item.kcal || 0)}</VuiTypography>
                              </VuiBox>
                            ))
                          ) : (
                            <VuiTypography variant="body2" color="text" sx={{ fontSize: { xs: "0.9rem", md: "0.875rem" } }}>Nenhum item</VuiTypography>
                          )}
                          {(refeicao.refeicaoPrincipal?.totalKcal || 0) > 0 && (
                            <VuiBox mt={1.5} pt={1.5} sx={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                              <VuiTypography variant="caption" color="text" fontWeight="bold" sx={{ fontSize: { xs: "0.85rem", md: "0.75rem" } }}>
                                Total: {refeicao.refeicaoPrincipal.totalKcal} kcal
                              </VuiTypography>
                            </VuiBox>
                          )}
                        </VuiBox>
                      </Grid>
                    </Grid>
                    ) : (
                    <VuiBox
                      sx={{
                        background: "rgba(255, 255, 255, 0.05)",
                        borderRadius: "14px",
                        p: { xs: 1.5, md: 2 },
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      {(() => {
                        const porCategoria = refeicao.substituicoesPorCategoria || {};
                        const labels = { proteinas: "Proteínas", carboidratos: "Carboidratos", gorduras: "Gorduras", leguminosas: "Leguminosas" };
                        const categorias = ["proteinas", "carboidratos", "gorduras", "leguminosas"];
                        return categorias.map((cat) => {
                          const itens = porCategoria[cat] || [];
                          if (itens.length === 0) return null;
                          return (
                            <VuiBox key={cat} mb={{ xs: 1.5, md: 2 }}>
                              <VuiTypography variant="caption" color="white" fontWeight="bold" sx={{ display: "block", mb: 0.75, fontSize: { xs: "0.7rem", md: "0.75rem" } }}>
                                {labels[cat]}
                              </VuiTypography>
                              <VuiBox sx={{ pl: 1.5, borderLeft: "3px solid rgba(46, 114, 172, 0.5)" }}>
                                {itens.map((item, idx) => (
                                  <VuiBox
                                    key={`${cat}-${idx}`}
                                    display="grid"
                                    gridTemplateColumns={{ xs: "1fr 0.7fr 0.5fr", md: "1.2fr 0.8fr 0.5fr" }}
                                    px={1}
                                    py={{ xs: 0.4, md: 0.5 }}
                                    sx={{ backgroundColor: idx % 2 === 0 ? "rgba(255,255,255,0.03)" : "transparent", borderRadius: 1 }}
                                  >
                                    <VuiTypography variant="body2" color="white" fontWeight="medium" sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}>{item.alimento}</VuiTypography>
                                    <VuiTypography variant="body2" color="text" sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}>{item.quantidade}</VuiTypography>
                                    <VuiTypography variant="body2" color="white" textAlign="right" fontWeight="bold" sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}>{Math.round(item.kcal || 0)}</VuiTypography>
                                  </VuiBox>
                                ))}
                              </VuiBox>
                            </VuiBox>
                          );
                        });
                      })()}
                      {!refeicao.substituicoesPorCategoria || Object.values(refeicao.substituicoesPorCategoria).every((arr) => !arr || arr.length === 0) ? (
                        <VuiTypography variant="body2" color="text" sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" } }}>Nenhuma substituição</VuiTypography>
                      ) : null}
                    </VuiBox>
                    )}

                    <VuiBox mt={3}>
                      <Divider sx={{ backgroundColor: "rgba(255, 255, 255, 0.08)" }} />
                      <VuiTypography variant="caption" color="text" mt={2} sx={{ display: "block", fontSize: { xs: "0.7rem", md: "0.75rem" } }}>
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



import React from "react";
import Grid from "@mui/material/Grid";
import { Card, Chip } from "@mui/material";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import colors from "assets/theme/base/colors";
import linearGradient from "assets/theme/functions/linearGradient";
import { IoMoon, IoTime, IoCalendar, IoCheckmarkCircle, IoCloseCircle, IoAlertCircle } from "react-icons/io5";

const HigieneDoSono = () => {
  const { gradients } = colors;
  const { cardContent } = gradients;

  // Dados do JSON fornecido
  const dadosSono = {
    horario_dormir_recomendado: "23:00",
    horario_acordar_recomendado: "07:00",
    duracao_alvo: "8h",
    janela_sono_semana: "23:00-07:00",
    janela_sono_fds: "23:00-07:00",
    consistencia_horario: "Variação máxima ±30min entre semana e fins de semana",
    rotina_pre_sono: [
      "22:00 - Desligar telas e luz branca",
      "22:20 - Banho morno ou técnica respiratória/mindfulness",
      "22:40 - Leitura leve com luz tênue",
      "23:00 - Deitar no horário combinado",
    ],
    gatilhos_evitar: [
      "Cafeína após 16h",
      "Exercício intenso noturno (após 20h)",
      "Telas ou reuniões após 21h",
      "Refeições pesadas após 20h",
    ],
    progressao_ajuste:
      "Reduzir horário de dormir 15 minutos a cada 3 dias até atingir 23:00 sem perda do despertar fixo às 07:00.",
    observacoes_clinicas:
      "Sono cronicamente curto e superficial, mente ativa e jet-lag social moderado (>1h2min). Prioridade máxima para saúde neurocognitiva e metabólica. Impacto de olheiras, fadiga e desempenho oscilante exige ajuste imediato na rotina.",
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox pt={3} pb={6}>
        {/* Título Principal */}
        <VuiBox mb={4} display="flex" alignItems="center">
          <IoMoon size={40} color="#2c3e50" style={{ marginRight: 16 }} />
          <VuiTypography variant="h3" color="white" fontWeight="bold">
            Higiene do Sono
          </VuiTypography>
        </VuiBox>

        {/* Card de Resumo - Horários Recomendados */}
        <Card
          sx={{
            borderRadius: "20px",
            background: linearGradient(cardContent.main, cardContent.state, cardContent.deg),
            mb: 3,
          }}
        >
          <VuiBox p={3}>
            <VuiBox display="flex" alignItems="center" mb={3}>
              <IoTime size={28} color="#2c3e50" style={{ marginRight: 12 }} />
              <VuiTypography variant="h5" color="white" fontWeight="bold">
                Horários Recomendados
              </VuiTypography>
            </VuiBox>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card
                  sx={{
                    borderRadius: "15px",
                    background: "rgba(46, 114, 172, 0.2)",
                    p: 2,
                    textAlign: "center",
                  }}
                >
                  <VuiTypography variant="button" color="text" fontWeight="medium" mb={1}>
                    Dormir
                  </VuiTypography>
                  <VuiTypography variant="h4" color="white" fontWeight="bold">
                    {dadosSono.horario_dormir_recomendado}
                  </VuiTypography>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card
                  sx={{
                    borderRadius: "15px",
                    background: "rgba(46, 114, 172, 0.2)",
                    p: 2,
                    textAlign: "center",
                  }}
                >
                  <VuiTypography variant="button" color="text" fontWeight="medium" mb={1}>
                    Acordar
                  </VuiTypography>
                  <VuiTypography variant="h4" color="white" fontWeight="bold">
                    {dadosSono.horario_acordar_recomendado}
                  </VuiTypography>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card
                  sx={{
                    borderRadius: "15px",
                    background: "rgba(46, 114, 172, 0.2)",
                    p: 2,
                    textAlign: "center",
                  }}
                >
                  <VuiTypography variant="button" color="text" fontWeight="medium" mb={1}>
                    Duração Alvo
                  </VuiTypography>
                  <VuiTypography variant="h4" color="white" fontWeight="bold">
                    {dadosSono.duracao_alvo}
                  </VuiTypography>
                </Card>
              </Grid>
            </Grid>
            <VuiBox mt={3} p={2} sx={{ background: "rgba(255, 255, 255, 0.05)", borderRadius: "12px" }}>
              <VuiTypography variant="body2" color="text" fontWeight="regular" sx={{ lineHeight: 1.7 }}>
                <strong>Consistência:</strong> {dadosSono.consistencia_horario}
              </VuiTypography>
            </VuiBox>
          </VuiBox>
        </Card>

        {/* Janela de Sono - Semana e Fins de Semana */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: "20px",
                background: linearGradient(cardContent.main, cardContent.state, cardContent.deg),
                height: "100%",
              }}
            >
              <VuiBox p={3}>
                <VuiBox display="flex" alignItems="center" mb={2}>
                  <IoCalendar size={24} color="#2c3e50" style={{ marginRight: 12 }} />
                  <VuiTypography variant="h6" color="white" fontWeight="bold">
                    Janela de Sono - Semana
                  </VuiTypography>
                </VuiBox>
                <VuiBox
                  p={2.5}
                  sx={{
                    background: "rgba(46, 114, 172, 0.15)",
                    borderRadius: "12px",
                    textAlign: "center",
                  }}
                >
                  <VuiTypography variant="h4" color="white" fontWeight="bold">
                    {dadosSono.janela_sono_semana}
                  </VuiTypography>
                </VuiBox>
              </VuiBox>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: "20px",
                background: linearGradient(cardContent.main, cardContent.state, cardContent.deg),
                height: "100%",
              }}
            >
              <VuiBox p={3}>
                <VuiBox display="flex" alignItems="center" mb={2}>
                  <IoCalendar size={24} color="#2c3e50" style={{ marginRight: 12 }} />
                  <VuiTypography variant="h6" color="white" fontWeight="bold">
                    Janela de Sono - Fins de Semana
                  </VuiTypography>
                </VuiBox>
                <VuiBox
                  p={2.5}
                  sx={{
                    background: "rgba(46, 114, 172, 0.15)",
                    borderRadius: "12px",
                    textAlign: "center",
                  }}
                >
                  <VuiTypography variant="h4" color="white" fontWeight="bold">
                    {dadosSono.janela_sono_fds}
                  </VuiTypography>
                </VuiBox>
              </VuiBox>
            </Card>
          </Grid>
        </Grid>

        {/* Rotina Pré-Sono */}
        <Card
          sx={{
            borderRadius: "20px",
            background: linearGradient(cardContent.main, cardContent.state, cardContent.deg),
            mb: 3,
          }}
        >
          <VuiBox p={3}>
            <VuiBox display="flex" alignItems="center" mb={3}>
              <IoCheckmarkCircle size={28} color="#2c3e50" style={{ marginRight: 12 }} />
              <VuiTypography variant="h5" color="white" fontWeight="bold">
                Rotina Pré-Sono
              </VuiTypography>
            </VuiBox>
            <VuiBox position="relative">
              {dadosSono.rotina_pre_sono.map((item, index) => {
                const [horario, atividade] = item.split(" - ");
                const isLast = index === dadosSono.rotina_pre_sono.length - 1;
                return (
                  <VuiBox key={index} position="relative" mb={isLast ? 0 : 3}>
                    <VuiBox display="flex" alignItems="flex-start">
                      {/* Timeline Circle and Line */}
                      <VuiBox
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          mr: 2,
                          flexShrink: 0,
                        }}
                      >
                        <VuiBox
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            background: linearGradient(
                              gradients.info.main,
                              gradients.info.state,
                              gradients.info.deg
                            ),
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 2,
                          }}
                        >
                          <VuiTypography variant="button" color="white" fontWeight="bold">
                            {index + 1}
                          </VuiTypography>
                        </VuiBox>
                        {!isLast && (
                          <VuiBox
                            sx={{
                              width: "2px",
                              height: "calc(100% + 12px)",
                              background: "rgba(46, 114, 172, 0.3)",
                              mt: 1,
                            }}
                          />
                        )}
                      </VuiBox>
                      {/* Conteúdo */}
                      <VuiBox flex={1}>
                        <Card
                          sx={{
                            borderRadius: "12px",
                            background: "rgba(255, 255, 255, 0.05)",
                            p: 2.5,
                            transition: "all 0.3s ease",
                            "&:hover": {
                              background: "rgba(255, 255, 255, 0.08)",
                              transform: "translateX(4px)",
                            },
                          }}
                        >
                          <VuiBox display="flex" alignItems="center" mb={1} flexWrap="wrap">
                            <VuiTypography
                              variant="h6"
                              color="white"
                              fontWeight="bold"
                              sx={{ minWidth: "80px", mb: { xs: 1, sm: 0 } }}
                            >
                              {horario}
                            </VuiTypography>
                            <VuiBox
                              sx={{
                                flex: 1,
                                minWidth: "60px",
                                height: "2px",
                                background: "rgba(46, 114, 172, 0.3)",
                                mx: { xs: 0, sm: 2 },
                                display: { xs: "none", sm: "block" },
                              }}
                            />
                          </VuiBox>
                          <VuiTypography variant="body2" color="text" fontWeight="regular" sx={{ lineHeight: 1.7 }}>
                            {atividade}
                          </VuiTypography>
                        </Card>
                      </VuiBox>
                    </VuiBox>
                  </VuiBox>
                );
              })}
            </VuiBox>
          </VuiBox>
        </Card>

        {/* Gatilhos a Evitar */}
        <Card
          sx={{
            borderRadius: "20px",
            background: linearGradient(cardContent.main, cardContent.state, cardContent.deg),
            mb: 3,
          }}
        >
          <VuiBox p={3}>
            <VuiBox display="flex" alignItems="center" mb={3}>
              <IoCloseCircle size={28} color="#FF3838" style={{ marginRight: 12 }} />
              <VuiTypography variant="h5" color="white" fontWeight="bold">
                Gatilhos a Evitar
              </VuiTypography>
            </VuiBox>
            <Grid container spacing={2}>
              {dadosSono.gatilhos_evitar.map((gatilho, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card
                    sx={{
                      borderRadius: "12px",
                      background: "rgba(255, 56, 56, 0.1)",
                      border: "1px solid rgba(255, 56, 56, 0.2)",
                      p: 2,
                    }}
                  >
                    <VuiBox display="flex" alignItems="center">
                      <VuiBox
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background: "rgba(255, 56, 56, 0.2)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mr: 2,
                        }}
                      >
                        <IoCloseCircle size={18} color="#FF3838" />
                      </VuiBox>
                      <VuiTypography variant="body2" color="text" fontWeight="medium" sx={{ lineHeight: 1.6 }}>
                        {gatilho}
                      </VuiTypography>
                    </VuiBox>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </VuiBox>
        </Card>

        {/* Progressão de Ajuste */}
        <Card
          sx={{
            borderRadius: "20px",
            background: linearGradient(cardContent.main, cardContent.state, cardContent.deg),
            mb: 3,
          }}
        >
          <VuiBox p={3}>
            <VuiBox display="flex" alignItems="center" mb={2}>
              <IoCheckmarkCircle size={28} color="#F9CF05" style={{ marginRight: 12 }} />
              <VuiTypography variant="h5" color="white" fontWeight="bold">
                Progressão de Ajuste
              </VuiTypography>
            </VuiBox>
            <Card
              sx={{
                borderRadius: "15px",
                background: "rgba(249, 207, 5, 0.1)",
                border: "1px solid rgba(249, 207, 5, 0.2)",
                p: 2.5,
              }}
            >
              <VuiTypography variant="body2" color="text" fontWeight="regular" sx={{ lineHeight: 1.8 }}>
                {dadosSono.progressao_ajuste}
              </VuiTypography>
            </Card>
          </VuiBox>
        </Card>

        {/* Observações Clínicas */}
        <Card
          sx={{
            borderRadius: "20px",
            background: linearGradient(cardContent.main, cardContent.state, cardContent.deg),
          }}
        >
          <VuiBox p={3}>
            <VuiBox display="flex" alignItems="center" mb={2}>
              <IoAlertCircle size={28} color="#F9CF05" style={{ marginRight: 12 }} />
              <VuiTypography variant="h5" color="white" fontWeight="bold">
                Observações Clínicas
              </VuiTypography>
            </VuiBox>
            <Card
              sx={{
                borderRadius: "15px",
                background: "rgba(249, 207, 5, 0.1)",
                border: "1px solid rgba(249, 207, 5, 0.3)",
                p: 2.5,
              }}
            >
              <VuiTypography variant="body2" color="text" fontWeight="regular" sx={{ lineHeight: 1.8 }}>
                {dadosSono.observacoes_clinicas}
              </VuiTypography>
            </Card>
          </VuiBox>
        </Card>
      </VuiBox>
      <Footer />
    </DashboardLayout>
  );
};

export default HigieneDoSono;


import React from "react";

import Grid from "@mui/material/Grid";
import { Card } from "@mui/material";

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
import { IoWarning, IoFlask, IoLeaf } from "react-icons/io5";
import { FaCapsules, FaPills } from "react-icons/fa";

const SuplementosFitoterapicos = () => {
  const { gradients } = colors;
  const { cardContent } = gradients;

  const suplementos = [
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
      iconColor: "#2E72AC",
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
          {suplementos.map((suplemento) => {
            const IconComponent = suplemento.Icon;
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
                  <VuiBox textAlign="center" mb={3}>
                    <VuiTypography variant="h5" color="white" fontWeight="bold">
                      {suplemento.nome}
                    </VuiTypography>
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


import React from "react";
import { useHistory } from "react-router-dom";
import Grid from "@mui/material/Grid";
import { Card } from "@mui/material";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import colors from "assets/theme/base/colors";
import linearGradient from "assets/theme/functions/linearGradient";
import { IoPlayCircle, IoCheckmarkCircle, IoLockClosed } from "react-icons/io5";

const Educacional = () => {
  const { gradients } = colors;
  const { cardContent } = gradients;
  const history = useHistory();

  const modulos = [
    {
      id: 1,
      titulo: "Módulo 1 - Fundamentos da Saúde Integrativa (FSI)",
      descricao: "Introdução aos conceitos fundamentais da saúde integrativa, abordando os principais pilares para uma vida equilibrada e saudável.",
      totalAulas: 8,
      aulasCompletas: 5,
      progresso: 62.5,
      duracao: "2h 45min",
      imagem: "https://via.placeholder.com/400x200/2E72AC/FFFFFF?text=Modulo+1",
    },
    {
      id: 2,
      titulo: "Módulo 2 - Nutrição Funcional Avançada",
      descricao: "Aprofunde seus conhecimentos sobre nutrição funcional, macro e micronutrientes, e como a alimentação afeta a saúde.",
      totalAulas: 6,
      aulasCompletas: 0,
      progresso: 0,
      duracao: "2h 10min",
      imagem: "https://via.placeholder.com/400x200/01b574/FFFFFF?text=Modulo+2",
    },
    {
      id: 3,
      titulo: "Módulo 3 - Exercício Físico e Performance",
      descricao: "Estratégias avançadas de treinamento, recuperação e otimização do desempenho físico.",
      totalAulas: 7,
      aulasCompletas: 0,
      progresso: 0,
      duracao: "3h 20min",
      imagem: "https://via.placeholder.com/400x200/F9CF05/000000?text=Modulo+3",
    },
    {
      id: 4,
      titulo: "Módulo 4 - Saúde Mental e Bem-Estar",
      descricao: "Técnicas de mindfulness, gestão do estresse e desenvolvimento de resiliência emocional.",
      totalAulas: 5,
      aulasCompletas: 0,
      progresso: 0,
      duracao: "1h 50min",
      imagem: "https://via.placeholder.com/400x200/f6ad55/FFFFFF?text=Modulo+4",
    },
  ];

  const handleModuloClick = (moduloId) => {
    history.push(`/educacional/modulo/${moduloId}`);
  };

  const getStatusIcon = (progresso) => {
    if (progresso === 0) {
      return <IoLockClosed size={24} color="#CBD5E0" />;
    } else if (progresso === 100) {
      return <IoCheckmarkCircle size={24} color="#01b574" />;
    } else {
      return <IoPlayCircle size={24} color="#F9CF05" />;
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox pt={3} pb={6}>
        <VuiBox mb={3}>
          <VuiTypography variant="h4" color="white" fontWeight="bold" mb={1}>
            Educacional
          </VuiTypography>
          <VuiTypography variant="button" color="text" fontWeight="regular">
            Escolha um módulo para começar sua jornada
          </VuiTypography>
        </VuiBox>

        <Grid container spacing={3}>
          {modulos.map((modulo) => (
            <Grid item xs={12} md={6} key={modulo.id}>
              <Card
                sx={{
                  borderRadius: "20px",
                  background: linearGradient(cardContent.main, cardContent.state, cardContent.deg),
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  overflow: "hidden",
                  position: "relative",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 24px rgba(0, 0, 0, 0.3)",
                  },
                }}
                onClick={() => handleModuloClick(modulo.id)}
              >
                <VuiBox position="relative">
                  {/* Imagem do módulo */}
                  <VuiBox
                    sx={{
                      width: "100%",
                      height: "200px",
                      backgroundImage: `url(${modulo.imagem})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      position: "relative",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.7) 100%)",
                      },
                    }}
                  />

                  {/* Ícone de status */}
                  <VuiBox
                    sx={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      zIndex: 10,
                    }}
                  >
                    {getStatusIcon(modulo.progresso)}
                  </VuiBox>

                  <VuiBox p={3}>
                    {/* Título */}
                    <VuiTypography variant="h5" color="white" fontWeight="bold" mb={1}>
                      {modulo.titulo}
                    </VuiTypography>

                    {/* Descrição */}
                    <VuiTypography variant="body2" color="text" fontWeight="regular" mb={2}>
                      {modulo.descricao}
                    </VuiTypography>

                    {/* Informações do módulo */}
                    <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <VuiBox>
                        <VuiTypography variant="caption" color="text" fontWeight="regular">
                          {modulo.totalAulas} aulas
                        </VuiTypography>
                        <VuiTypography variant="caption" color="text" fontWeight="regular" ml={2}>
                          {modulo.duracao}
                        </VuiTypography>
                      </VuiBox>
                    </VuiBox>

                    {/* Barra de progresso */}
                    <VuiBox>
                      <VuiBox
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={1}
                      >
                        <VuiTypography variant="button" color="white" fontWeight="medium">
                          Progresso
                        </VuiTypography>
                        <VuiTypography variant="button" color="text" fontWeight="regular">
                          {modulo.progresso}%
                        </VuiTypography>
                      </VuiBox>
                      <VuiBox
                        sx={{
                          width: "100%",
                          height: "8px",
                          borderRadius: "10px",
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          overflow: "hidden",
                        }}
                      >
                        <VuiBox
                          sx={{
                            width: `${modulo.progresso}%`,
                            height: "100%",
                            background: linearGradient(
                              gradients.info.main,
                              gradients.info.state,
                              gradients.info.deg
                            ),
                            transition: "width 0.5s ease",
                          }}
                        />
                      </VuiBox>
                    </VuiBox>
                  </VuiBox>
                </VuiBox>
              </Card>
            </Grid>
          ))}
        </Grid>
      </VuiBox>
      <Footer />
    </DashboardLayout>
  );
};

export default Educacional;










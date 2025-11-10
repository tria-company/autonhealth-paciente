import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import Grid from "@mui/material/Grid";
import { Card, Icon } from "@mui/material";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiButton from "components/VuiButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import colors from "assets/theme/base/colors";
import linearGradient from "assets/theme/functions/linearGradient";
import { IoCheckmarkCircle, IoPlayCircle, IoLockClosed } from "react-icons/io5";
import { MdOndemandVideo } from "react-icons/md";

const EducacionalModulo = () => {
  const { moduloId } = useParams();
  const history = useHistory();
  const { gradients } = colors;
  const { cardContent, info } = gradients;

  const [aulaSelecionada, setAulaSelecionada] = useState(1);

  const moduloData = {
    1: {
      titulo: "Módulo 1 - Fundamentos da Saúde Integrativa (FSI)",
      descricao: "Introdução aos conceitos fundamentais da saúde integrativa, abordando os principais pilares para uma vida equilibrada e saudável.",
      aulas: [
        {
          id: 1,
          titulo: "Fundamentos da Saúde Integrativa",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          duracao: "23:47",
          completada: true,
        },
        {
          id: 2,
          titulo: "Estratégias Nutricionais no Emagrecimento e Longevidade",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          duracao: "18:32",
          completada: true,
        },
        {
          id: 3,
          titulo: "Os 4 pilares da Nova Saúde no Envelhecimento",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          duracao: "25:15",
          completada: true,
        },
        {
          id: 4,
          titulo: "Nutrição",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          duracao: "20:08",
          completada: true,
        },
        {
          id: 5,
          titulo: "Exercícios",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          duracao: "22:45",
          completada: true,
        },
        {
          id: 6,
          titulo: "Sono",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          duracao: "19:50",
          completada: false,
          emProgresso: true,
        },
        {
          id: 7,
          titulo: "Espiritualidade",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          duracao: "17:25",
          completada: false,
        },
        {
          id: 8,
          titulo: "Saúde da Mente, do Corpo e do Espírito",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          duracao: "21:30",
          completada: false,
        },
      ],
    },
  };

  const modulo = moduloData[moduloId];
  const aulaAtual = modulo?.aulas.find((a) => a.id === aulaSelecionada);

  if (!modulo) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <VuiBox pt={3} pb={6}>
          <VuiTypography variant="h4" color="white">
            Módulo não encontrado
          </VuiTypography>
          <VuiButton onClick={() => history.push("/educacional")}>
            Voltar para Educacional
          </VuiButton>
        </VuiBox>
        <Footer />
      </DashboardLayout>
    );
  }

  const handleAulaClick = (aulaId) => {
    setAulaSelecionada(aulaId);
  };

  const handleAnteriorClick = () => {
    if (aulaSelecionada > 1) {
      setAulaSelecionada(aulaSelecionada - 1);
    }
  };

  const handleProximoClick = () => {
    if (aulaSelecionada < modulo.aulas.length) {
      setAulaSelecionada(aulaSelecionada + 1);
    }
  };

  const getStatusIcon = (aula) => {
    if (aula.completada) {
      return <IoCheckmarkCircle size={20} color="#01b574" />;
    } else if (aula.emProgresso) {
      return <IoPlayCircle size={20} color="#F9CF05" />;
    } else {
      return <IoLockClosed size={20} color="#CBD5E0" />;
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox pt={3} pb={6}>
        <Grid container spacing={3}>
          {/* Vídeo Principal */}
          <Grid item xs={12} lg={8}>
            <Card
              sx={{
                borderRadius: "20px",
                background: linearGradient(cardContent.main, cardContent.state, cardContent.deg),
                overflow: "hidden",
                mb: 3,
              }}
            >
              <VuiBox>
                {/* Player de vídeo */}
                <VuiBox
                  sx={{
                    position: "relative",
                    paddingBottom: "56.25%", // 16:9 aspect ratio
                    height: 0,
                    overflow: "hidden",
                  }}
                >
                  {aulaAtual && (
                    <iframe
                      src={aulaAtual.videoUrl}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        border: "none",
                      }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={aulaAtual.titulo}
                    />
                  )}
                </VuiBox>

                {/* Informações da aula */}
                <VuiBox p={3}>
                  <VuiTypography variant="h5" color="white" fontWeight="bold" mb={1}>
                    {aulaAtual?.titulo}
                  </VuiTypography>
                  <VuiTypography variant="body2" color="text" fontWeight="regular" mb={3}>
                    {modulo.descricao}
                  </VuiTypography>

                  {/* Botões de navegação */}
                  <VuiBox display="flex" justifyContent="space-between">
                    <VuiButton
                      variant="contained"
                      color="white"
                      onClick={handleAnteriorClick}
                      disabled={aulaSelecionada === 1}
                      sx={{
                        background: linearGradient(info.main, info.state, info.deg),
                        color: "#FFFFFF",
                        fontWeight: "bold",
                        "&:disabled": {
                          background: "rgba(255, 255, 255, 0.1)",
                          color: "#CBD5E0",
                        },
                      }}
                    >
                      <Icon sx={{ mr: 1 }}>arrow_back</Icon>
                      Anterior
                    </VuiButton>

                    <VuiButton
                      variant="contained"
                      color="white"
                      onClick={handleProximoClick}
                      disabled={aulaSelecionada === modulo.aulas.length}
                      sx={{
                        background: linearGradient(info.main, info.state, info.deg),
                        color: "#FFFFFF",
                        fontWeight: "bold",
                        "&:disabled": {
                          background: "rgba(255, 255, 255, 0.1)",
                          color: "#CBD5E0",
                        },
                      }}
                    >
                      Próximo
                      <Icon sx={{ ml: 1 }}>arrow_forward</Icon>
                    </VuiButton>
                  </VuiBox>
                </VuiBox>
              </VuiBox>
            </Card>
          </Grid>

          {/* Lista de Aulas */}
          <Grid item xs={12} lg={4}>
            <Card
              sx={{
                borderRadius: "20px",
                background: linearGradient(cardContent.main, cardContent.state, cardContent.deg),
                p: 3,
              }}
            >
              <VuiTypography variant="h6" color="white" fontWeight="bold" mb={3}>
                {modulo.titulo}
              </VuiTypography>

              <VuiBox>
                {modulo.aulas.map((aula, index) => (
                  <VuiBox
                    key={aula.id}
                    onClick={() => handleAulaClick(aula.id)}
                    sx={{
                      p: 2,
                      mb: 1.5,
                      borderRadius: "15px",
                      backgroundColor:
                        aulaSelecionada === aula.id ? "rgba(46, 114, 172, 0.2)" : "rgba(255, 255, 255, 0.03)",
                      border:
                        aulaSelecionada === aula.id
                          ? "1px solid rgba(46, 114, 172, 0.5)"
                          : "1px solid rgba(255, 255, 255, 0.1)",
                      cursor: aula.completada || aula.emProgresso ? "pointer" : "not-allowed",
                      transition: "all 0.3s ease",
                      opacity: aula.completada || aula.emProgresso ? 1 : 0.6,
                      "&:hover": {
                        backgroundColor: "rgba(46, 114, 172, 0.15)",
                        transform: aula.completada || aula.emProgresso ? "translateX(8px)" : "none",
                      },
                    }}
                  >
                    <VuiBox display="flex" alignItems="center">
                      <VuiBox
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          backgroundColor:
                            aulaSelecionada === aula.id
                              ? "rgba(46, 114, 172, 0.3)"
                              : "rgba(255, 255, 255, 0.05)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mr: 2,
                        }}
                      >
                        {getStatusIcon(aula)}
                      </VuiBox>

                      <VuiBox flex={1}>
                        <VuiTypography
                          variant="button"
                          color="white"
                          fontWeight={aulaSelecionada === aula.id ? "bold" : "regular"}
                          mb={0.5}
                        >
                          Aula {aula.id}: {aula.titulo.split(" - ")[0]}
                        </VuiTypography>
                        <VuiBox display="flex" alignItems="center">
                          <MdOndemandVideo size={16} color="#CBD5E0" />
                          <VuiTypography variant="caption" color="text" fontWeight="regular" ml={1}>
                            {aula.duracao}
                          </VuiTypography>
                        </VuiBox>
                      </VuiBox>
                    </VuiBox>
                  </VuiBox>
                ))}
              </VuiBox>
            </Card>
          </Grid>
        </Grid>
      </VuiBox>
      <Footer />
    </DashboardLayout>
  );
};

export default EducacionalModulo;











import React, { useState } from "react";

import Grid from "@mui/material/Grid";
import { Card, Dialog, DialogContent } from "@mui/material";
import Icon from "@mui/material/Icon";
import VuiButton from "components/VuiButton";

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

const ExercicioFisico = () => {
  const { gradients } = colors;
  const { cardContent, info } = gradients;
  const [openVideo, setOpenVideo] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const exercicios = [
    {
      id: 1,
      nome: "Agachamento goblet",
      series: "3",
      repeticoes: "12-15",
      descanso: "60s",
      observacoes: "Manter o peito aberto e coluna reta, agachar até amplitude confortável.",
      completo: true,
      videoUrl: "https://www.youtube.com/embed/2gT1Q_RAlxo",
    },
    {
      id: 2,
      nome: "Flexão de braço",
      series: "3",
      repeticoes: "max",
      descanso: "60s",
      observacoes: "Realizar até a falha técnica, apoiando os joelhos se necessário para manter boa forma.",
      completo: true,
      videoUrl: "https://www.youtube.com/embed/rDwbR2r6iHA",
    },
    {
      id: 3,
      nome: "Remada curvada com halteres",
      series: "3",
      repeticoes: "12-15",
      descanso: "60s",
      observacoes: "Manter o abdômen estabilizado e costas retas; movimento lento e controlado.",
      completo: true,
      videoUrl: "https://www.youtube.com/embed/RipgpZsvFyg",
    },
    {
      id: 4,
      nome: "Desenvolvimento militar com halteres",
      series: "3",
      repeticoes: "12-15",
      descanso: "60s",
      observacoes: "Segurar halteres na linha dos ombros, evitar extensão excessiva do tronco; executar em pé ou sentado.",
      completo: true,
      videoUrl: "https://www.youtube.com/embed/qEwKCR5JCog",
    },
    {
      id: 5,
      nome: "Prancha frontal",
      series: "3",
      repeticoes: "45-60",
      descanso: "45s",
      observacoes: "Manter o corpo alinhado, abdômen contraído, evitar elevação do quadril.",
      completo: true,
      videoUrl: "https://www.youtube.com/embed/ASdvN_XEl_c",
    },
    {
      id: 6,
      nome: "Burpees",
      series: "3",
      repeticoes: "10",
      descanso: "90s",
      observacoes: "Executar com controle, adaptando remoção do salto caso necessário para minimizar impacto.",
      completo: true,
      videoUrl: "https://www.youtube.com/embed/qLG9mUj9mXM",
    },
    {
      id: 7,
      nome: "CARDIO: Bike ou caminhada",
      series: "1",
      repeticoes: "15-20",
      descanso: "0s",
      observacoes: "15-20 minutos após a musculação, intensidade moderada, objetivo de aumentar queima calórica semanal.",
      completo: true,
      videoUrl: "https://www.youtube.com/embed/6CS2xznZ6kw",
    },
    {
      id: 8,
      nome: "Agachamento goblet",
      series: "3",
      repeticoes: "12-15",
      descanso: "60s",
      observacoes: "Manter o peito aberto e coluna reta, agachar até amplitude confortável.",
      completo: true,
      videoUrl: "https://www.youtube.com/embed/2gT1Q_RAlxo",
    },
  ];

  const handleOpenVideo = (exercicio) => {
    setSelectedVideo(exercicio);
    setOpenVideo(true);
  };

  const handleCloseVideo = () => {
    setOpenVideo(false);
    setSelectedVideo(null);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox pt={3} pb={6}>
        <VuiBox mb={3}>
          <VuiTypography variant="h4" color="white" fontWeight="bold" mb={1}>
            Exercício Físico
          </VuiTypography>
          <VuiBox display="flex" justifyContent="center" mb={4}>
            <VuiTypography variant="h5" color="text" fontWeight="regular">
              Treino de Força
            </VuiTypography>
          </VuiBox>
        </VuiBox>

        <Grid container spacing={3}>
          {exercicios.map((exercicio) => (
            <Grid item xs={12} md={4} key={exercicio.id}>
              <Card
                sx={{
                  borderRadius: "20px",
                  background: linearGradient(cardContent.main, cardContent.state, cardContent.deg),
                  position: "relative",
                  overflow: "visible",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <VuiBox p={3} position="relative" sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  {exercicio.completo && (
                    <Icon
                      sx={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        color: "#01b574",
                        fontSize: "24px",
                      }}
                    >
                      check_circle
                    </Icon>
                  )}
                  <VuiTypography
                    variant="caption"
                    color="text"
                    fontWeight="medium"
                    mb={0.5}
                    sx={{ display: "block" }}
                  >
                    Nome do Exercício:
                  </VuiTypography>
                  <VuiTypography variant="h6" color="white" fontWeight="bold" mb={2}>
                    {exercicio.nome}
                  </VuiTypography>

                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <VuiBox>
                        <VuiTypography variant="caption" color="text" fontWeight="regular" mb={0.5}>
                          Séries:
                        </VuiTypography>
                        <VuiTypography variant="body2" color="white" fontWeight="medium">
                          {exercicio.series}
                        </VuiTypography>
                      </VuiBox>
                    </Grid>
                    <Grid item xs={4}>
                      <VuiBox>
                        <VuiTypography variant="caption" color="text" fontWeight="regular" mb={0.5}>
                          Repetições:
                        </VuiTypography>
                        <VuiTypography variant="body2" color="white" fontWeight="medium">
                          {exercicio.repeticoes}
                        </VuiTypography>
                      </VuiBox>
                    </Grid>
                    <Grid item xs={4}>
                      <VuiBox>
                        <VuiTypography variant="caption" color="text" fontWeight="regular" mb={0.5}>
                          Descanso:
                        </VuiTypography>
                        <VuiTypography variant="body2" color="white" fontWeight="medium">
                          {exercicio.descanso}
                        </VuiTypography>
                      </VuiBox>
                    </Grid>
                  </Grid>

                  <VuiBox mt={2}>
                    <VuiTypography variant="caption" color="text" fontWeight="regular" mb={0.5}>
                      Observações:
                    </VuiTypography>
                    <VuiTypography variant="body2" color="text" fontWeight="regular">
                      {exercicio.observacoes}
                    </VuiTypography>
                  </VuiBox>

                  <VuiBox mt="auto" pt={3} display="flex" justifyContent="center">
                    <VuiButton
                      variant="contained"
                      size="small"
                      onClick={() => handleOpenVideo(exercicio)}
                      sx={{
                        background: linearGradient(info.main, info.state, info.deg || "0"),
                        color: "#FFFFFF",
                        fontWeight: "bold",
                        px: 3,
                        py: 1,
                        "&:hover": {
                          opacity: 0.9,
                          background: linearGradient(info.main, info.state, info.deg || "0"),
                        },
                      }}
                    >
                      Ver Vídeo Tutorial
                    </VuiButton>
                  </VuiBox>
                </VuiBox>
              </Card>
            </Grid>
          ))}
        </Grid>
      </VuiBox>
      <Footer />

      {/* Dialog para exibir o vídeo */}
      <Dialog
        open={openVideo}
        onClose={handleCloseVideo}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "transparent",
            boxShadow: "none",
            background: linearGradient(cardContent.main, cardContent.state, cardContent.deg),
            borderRadius: "20px",
            overflow: "hidden",
          },
        }}
      >
        <DialogContent sx={{ p: 0, position: "relative" }}>
          <Icon
            onClick={handleCloseVideo}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              zIndex: 1000,
              cursor: "pointer",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              borderRadius: "50%",
              color: "#FFFFFF",
              fontSize: "28px",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.7)",
              },
            }}
          >
            close
          </Icon>
          {selectedVideo && (
            <VuiBox
              sx={{
                position: "relative",
                paddingBottom: "56.25%", // 16:9 aspect ratio
                height: 0,
                overflow: "hidden",
              }}
            >
              <iframe
                src={selectedVideo.videoUrl}
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
                title={selectedVideo.nome}
              />
            </VuiBox>
          )}
          {selectedVideo && (
            <VuiBox p={3}>
              <VuiTypography variant="h5" color="white" fontWeight="bold" mb={1}>
                {selectedVideo.nome}
              </VuiTypography>
              <VuiTypography variant="body2" color="text" fontWeight="regular">
                {selectedVideo.observacoes}
              </VuiTypography>
            </VuiBox>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default ExercicioFisico;


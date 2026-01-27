import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import Grid from "@mui/material/Grid";
import { Card, Dialog, DialogContent } from "@mui/material";
import Icon from "@mui/material/Icon";
import CircularProgress from "@mui/material/CircularProgress";
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

// Hooks e funções
import { usePaciente } from "hooks/usePaciente";
import { buscarExerciciosPaciente } from "lib/exercicios";

const ExercicioFisico = () => {
  const { gradients } = colors;
  const { cardContent, info } = gradients;
  const { paciente, loading: loadingPaciente } = usePaciente();
  const location = useLocation();
  
  const [exercicios, setExercicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [openVideo, setOpenVideo] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Resetar estado quando a rota mudar
  useEffect(() => {
    setExercicios([]);
    setLoading(true);
    setErro(null);
  }, [location.pathname]);

  // Carregar exercícios
  useEffect(() => {
    async function carregarDados() {
      if (loadingPaciente) {
        setLoading(true);
        return;
      }

      if (!paciente || !paciente.id) {
        setLoading(false);
        setErro('Paciente não encontrado');
        return;
      }

      console.log('🏋️ Carregando exercícios para paciente:', paciente.id);

      try {
        setLoading(true);
        const exerciciosData = await buscarExerciciosPaciente(paciente.id);
        
        // Formatar dados para o formato esperado pelo componente
        const exerciciosFormatados = exerciciosData.map((ex) => ({
          id: ex.id,
          nome: ex.nome_exercicio || 'Sem nome',
          series: ex.series || '-',
          repeticoes: ex.repeticoes || '-',
          descanso: ex.descanso || '-',
          observacoes: ex.observacoes || 'Sem observações',
          completo: true,
          videoUrl: null, // Sem vídeo por enquanto
          tipoTreino: ex.tipo_treino,
          grupoMuscular: ex.grupo_muscular,
        }));

        setExercicios(exerciciosFormatados);
        setErro(null);
      } catch (error) {
        console.error('❌ Erro ao carregar exercícios:', error);
        setErro('Erro ao carregar exercícios');
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, [paciente, loadingPaciente, location.pathname]);

  const handleOpenVideo = (exercicio) => {
    if (exercicio.videoUrl) {
      setSelectedVideo(exercicio);
      setOpenVideo(true);
    }
  };

  const handleCloseVideo = () => {
    setOpenVideo(false);
    setSelectedVideo(null);
  };

  // Estado de loading
  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <VuiBox pt={6} pb={6} display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <VuiBox textAlign="center">
            <CircularProgress size={60} sx={{ color: '#0075FF' }} />
            <VuiTypography variant="h6" color="white" mt={3}>
              Carregando exercícios...
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
              Não foi possível carregar os exercícios.
            </VuiTypography>
          </VuiBox>
        </VuiBox>
      </DashboardLayout>
    );
  }

  // Estado sem dados
  if (!exercicios || exercicios.length === 0) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <VuiBox pt={6} pb={6} display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <VuiBox textAlign="center">
            <VuiTypography variant="h4" color="white" mb={2}>
              🏋️ Nenhum exercício cadastrado
            </VuiTypography>
            <VuiTypography variant="body2" color="text">
              Entre em contato com seu profissional para receber seu plano de treino.
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
        <VuiBox mb={3}>
          <VuiTypography variant="h4" color="white" fontWeight="bold" mb={1}>
            Exercício Físico
          </VuiTypography>
          <VuiTypography variant="body2" color="text" mb={2}>
            {exercicios.length} {exercicios.length === 1 ? 'exercício cadastrado' : 'exercícios cadastrados'}
          </VuiTypography>
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

                  {exercicio.videoUrl && (
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
                  )}
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


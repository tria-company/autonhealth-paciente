import React, { useState } from "react";

import Grid from "@mui/material/Grid";
import { Card, Slider } from "@mui/material";
import VuiButton from "components/VuiButton";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiProgress from "components/VuiProgress";

// Vision UI Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Vision UI Dashboard React base styles
import colors from "assets/theme/base/colors";
import linearGradient from "assets/theme/functions/linearGradient";

// Icons
import { IoMoon, IoFlower, IoFitness, IoRestaurant, IoPeople } from "react-icons/io5";
import { GiBrainStem } from "react-icons/gi";

const CheckinDiarios = () => {
  const { gradients, info } = colors;
  const { cardContent } = gradients;
  const [iniciado, setIniciado] = useState(false);
  const [stepAtual, setStepAtual] = useState(0);

  // Estados para os valores dos sliders
  const [valores, setValores] = useState({
    sono: { qualidade: 2, tempo: 7 },
    ambiente: { sol: 15, natureza: 30 },
    atividade: { tempo: 1, intensidade: 50 },
    sistemaNervoso: { estresse: 30, mindfulness: 15 },
    alimentacao: { refeicoes: 4, agua: 2.1 },
    relacionamento: { qualidade: 60, tempo: 50 },
  });

  const categorias = [
    {
      id: 1,
      nome: "Sono",
      descricao: "Sua Base de Regeneração",
      icone: IoMoon,
      corIcone: "#F9CF05",
    },
    {
      id: 2,
      nome: "Ambiente",
      descricao: "Natureza e Exposição Solar",
      icone: IoFlower,
      corIcone: "#01b574",
    },
    {
      id: 3,
      nome: "Atividade Física",
      descricao: "Movimento e Exercício",
      icone: IoFitness,
      corIcone: "#2E72AC",
    },
    {
      id: 4,
      nome: "Sistema Nervoso",
      descricao: "Mindfulness e Controle do Estresse",
      icone: GiBrainStem,
      corIcone: "#f6ad55",
    },
    {
      id: 5,
      nome: "Alimentação",
      descricao: "Nutrição e Hidratação",
      icone: IoRestaurant,
      corIcone: "#4299e1",
    },
    {
      id: 6,
      nome: "Relacionamento",
      descricao: "Conexões e Comunicação",
      icone: IoPeople,
      corIcone: "#9f7aea",
    },
  ];

  const handleIniciar = () => {
    setIniciado(true);
    setStepAtual(0);
  };

  const handleProximo = () => {
    if (stepAtual < categorias.length - 1) {
      setStepAtual(stepAtual + 1);
    }
  };

  const handleAnterior = () => {
    if (stepAtual > 0) {
      setStepAtual(stepAtual - 1);
    }
  };

  const handleFinalizar = () => {
    // Aqui você pode salvar os dados
    alert("Check-in diário concluído com sucesso!");
    setIniciado(false);
    setStepAtual(0);
  };

  const categoriaAtual = categorias[stepAtual];
  const IconComponent = categoriaAtual?.icone;

  // Renderizar Checklist Geral
  if (!iniciado) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <VuiBox pt={3} pb={6}>
          <VuiBox mb={3}>
            <VuiTypography variant="h4" color="white" fontWeight="bold" mb={1}>
              Check List Diários
            </VuiTypography>
            <VuiTypography variant="button" color="text" fontWeight="regular">
              Checklist Geral
            </VuiTypography>
          </VuiBox>

          <Grid container spacing={3}>
            {categorias.map((categoria) => {
              const Icon = categoria.icone;
              return (
                <Grid item xs={12} md={6} key={categoria.id}>
                  <Card
                    sx={{
                      borderRadius: "20px",
                      background: linearGradient(cardContent.main, cardContent.state, cardContent.deg),
                      position: "relative",
                      overflow: "visible",
                    }}
                  >
                    <VuiBox p={3}>
                      <VuiBox display="flex" alignItems="center" mb={2}>
                        <VuiBox
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          sx={{
                            width: 60,
                            height: 60,
                            backgroundColor: categoria.corIcone,
                            borderRadius: "50%",
                            mr: 2,
                            boxShadow: `0 4px 8px ${categoria.corIcone}40`,
                          }}
                        >
                          <Icon size={30} color="#FFFFFF" />
                        </VuiBox>
                        <VuiTypography variant="h6" color="white" fontWeight="bold">
                          {categoria.nome}
                        </VuiTypography>
                      </VuiBox>
                      <VuiTypography variant="body2" color="text" fontWeight="regular">
                        {categoria.descricao}
                      </VuiTypography>
                    </VuiBox>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          <VuiBox display="flex" justifyContent="center" mt={4}>
            <VuiButton
              variant="contained"
              color="white"
              size="large"
              onClick={handleIniciar}
              sx={{
                background: linearGradient(gradients.info.main, gradients.info.state, gradients.info.deg),
                color: "#FFFFFF",
                fontWeight: "bold",
                px: 6,
                py: 1.5,
                "&:hover": {
                  opacity: 0.9,
                  background: linearGradient(gradients.info.main, gradients.info.state, gradients.info.deg),
                },
              }}
            >
              Iniciar
            </VuiButton>
          </VuiBox>
        </VuiBox>
        <Footer />
      </DashboardLayout>
    );
  }

  // Renderizar Steps Individuais
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox pt={3} pb={6}>
        <VuiBox mb={3}>
          <VuiTypography variant="h4" color="white" fontWeight="bold" mb={1}>
            Check List Diários
          </VuiTypography>
          <VuiTypography variant="button" color="text" fontWeight="regular" mb={3}>
            Passo {stepAtual + 1} de {categorias.length}
          </VuiTypography>

          {/* Progress Bar */}
          <VuiProgress
            value={(stepAtual + 1) * (100 / categorias.length)}
            color="info"
            sx={{ mb: 4 }}
          />
        </VuiBox>

        {/* Card da Categoria Atual */}
        <Card
          sx={{
            borderRadius: "20px",
            background: linearGradient(cardContent.main, cardContent.state, cardContent.deg),
            position: "relative",
            overflow: "visible",
          }}
        >
          <VuiBox p={4}>
            {/* Cabeçalho */}
            <VuiBox display="flex" alignItems="center" mb={3}>
              <VuiBox
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{
                  width: 80,
                  height: 80,
                  backgroundColor: categoriaAtual.corIcone,
                  borderRadius: "20px",
                  mr: 3,
                  boxShadow: `0 4px 8px ${categoriaAtual.corIcone}40`,
                }}
              >
                <IconComponent size={40} color="#FFFFFF" />
              </VuiBox>
              <VuiBox>
                <VuiTypography variant="h5" color="white" fontWeight="bold" mb={0.5}>
                  {categoriaAtual.nome}
                </VuiTypography>
                <VuiTypography variant="body2" color="text" fontWeight="regular">
                  {categoriaAtual.descricao}
                </VuiTypography>
              </VuiBox>
            </VuiBox>

            {/* Conteúdo específico de cada categoria */}
            {renderStepContent(categoriaAtual, valores, setValores)}
          </VuiBox>
        </Card>

        {/* Botões de Navegação */}
        <VuiBox display="flex" justifyContent="space-between" mt={4}>
          <VuiButton
            variant="outlined"
            size="medium"
            onClick={handleAnterior}
            disabled={stepAtual === 0}
            sx={{
              borderColor: "#2E72AC",
              color: "#2E72AC",
              px: 4,
              "&:hover": {
                borderColor: "#2E72AC",
                backgroundColor: "rgba(46, 114, 172, 0.1)",
              },
              "&.Mui-disabled": {
                borderColor: "#8190A1",
                color: "#8190A1",
              },
            }}
          >
            Anterior
          </VuiButton>

          {stepAtual === categorias.length - 1 ? (
            <VuiButton
              variant="contained"
              color="white"
              size="medium"
              onClick={handleFinalizar}
              sx={{
                background: linearGradient(gradients.info.main, gradients.info.state, gradients.info.deg),
                color: "#FFFFFF",
                fontWeight: "bold",
                px: 6,
                "&:hover": {
                  opacity: 0.9,
                  background: linearGradient(gradients.info.main, gradients.info.state, gradients.info.deg),
                },
              }}
            >
              Finalizar
            </VuiButton>
          ) : (
            <VuiButton
              variant="contained"
              color="white"
              size="medium"
              onClick={handleProximo}
              sx={{
                background: linearGradient(gradients.info.main, gradients.info.state, gradients.info.deg),
                color: "#FFFFFF",
                fontWeight: "bold",
                px: 6,
                "&:hover": {
                  opacity: 0.9,
                  background: linearGradient(gradients.info.main, gradients.info.state, gradients.info.deg),
                },
              }}
            >
              Próximo
            </VuiButton>
          )}
        </VuiBox>
      </VuiBox>
      <Footer />
    </DashboardLayout>
  );
};

// Função para renderizar o conteúdo de cada step
function renderStepContent(categoria, valores, setValores) {
  const handleChange = (categoriaKey, campo, valor) => {
    setValores((prev) => ({
      ...prev,
      [categoriaKey]: {
        ...prev[categoriaKey],
        [campo]: valor,
      },
    }));
  };

  const getLabel = (valor, tipo) => {
    switch (tipo) {
      case "qualidade":
        if (valor <= 3) return "Baixo";
        if (valor <= 6) return "Moderado";
        return "Alto";
      case "tempo":
        if (valor <= 6) return "Insuficiente";
        if (valor <= 8) return "Moderado";
        return "Excelente";
      case "percentual":
        if (valor <= 33) return "Baixo";
        if (valor <= 66) return "Médio";
        return "Alto";
      default:
        return "";
    }
  };

  switch (categoria.nome) {
    case "Sono":
      return (
        <VuiBox>
          <VuiTypography variant="body1" color="text" mb={4}>
            O descanso certo muda sua energia, humor e foco.
          </VuiTypography>
          <VuiBox mb={4}>
            <VuiTypography variant="body2" color="white" fontWeight="medium" mb={2}>
              Qualidade do Sono
            </VuiTypography>
            <Slider
              value={valores.sono.qualidade}
              onChange={(e, novoValor) => handleChange("sono", "qualidade", novoValor)}
              min={0}
              max={10}
              step={1}
              sx={{
                color: "#2E72AC",
                "& .MuiSlider-thumb": {
                  width: 20,
                  height: 20,
                  backgroundColor: "#2E72AC",
                  border: "2px solid #FFFFFF",
                },
                "& .MuiSlider-track": {
                  backgroundColor: "#2E72AC",
                },
                "& .MuiSlider-rail": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            />
            <VuiBox display="flex" justifyContent="space-between" mt={1}>
              <VuiTypography variant="caption" color="text">
                {valores.sono.qualidade}
              </VuiTypography>
              <VuiTypography variant="caption" color="white">
                {getLabel(valores.sono.qualidade, "qualidade")}
              </VuiTypography>
            </VuiBox>
          </VuiBox>
          <VuiBox>
            <VuiTypography variant="body2" color="white" fontWeight="medium" mb={2}>
              Tempo de Sono (horas)
            </VuiTypography>
            <Slider
              value={valores.sono.tempo}
              onChange={(e, novoValor) => handleChange("sono", "tempo", novoValor)}
              min={0}
              max={12}
              step={0.5}
              sx={{
                color: "#01b574",
                "& .MuiSlider-thumb": {
                  width: 20,
                  height: 20,
                  backgroundColor: "#01b574",
                  border: "2px solid #FFFFFF",
                },
                "& .MuiSlider-track": {
                  backgroundColor: "#01b574",
                },
                "& .MuiSlider-rail": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            />
            <VuiBox display="flex" justifyContent="space-between" mt={1}>
              <VuiTypography variant="caption" color="text">
                {valores.sono.tempo}h
              </VuiTypography>
              <VuiTypography variant="caption" color="white">
                {getLabel(valores.sono.tempo, "tempo")}
              </VuiTypography>
            </VuiBox>
          </VuiBox>
        </VuiBox>
      );

    case "Ambiente":
      return (
        <VuiBox>
          <VuiTypography variant="body1" color="text" mb={4}>
            A exposição solar e contato com a natureza são fundamentais para sua saúde.
          </VuiTypography>
          <VuiBox mb={4}>
            <VuiTypography variant="body2" color="white" fontWeight="medium" mb={2}>
              Tempo de exposição ao sol (minutos)
            </VuiTypography>
            <Slider
              value={valores.ambiente.sol}
              onChange={(e, novoValor) => handleChange("ambiente", "sol", novoValor)}
              min={0}
              max={120}
              step={5}
              sx={{
                color: "#F9CF05",
                "& .MuiSlider-thumb": {
                  width: 20,
                  height: 20,
                  backgroundColor: "#F9CF05",
                  border: "2px solid #FFFFFF",
                },
                "& .MuiSlider-track": {
                  backgroundColor: "#F9CF05",
                },
                "& .MuiSlider-rail": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            />
            <VuiBox display="flex" justifyContent="space-between" mt={1}>
              <VuiTypography variant="caption" color="text">
                {valores.ambiente.sol}min
              </VuiTypography>
              <VuiTypography variant="caption" color="white">
                Bom
              </VuiTypography>
            </VuiBox>
          </VuiBox>
          <VuiBox>
            <VuiTypography variant="body2" color="white" fontWeight="medium" mb={2}>
              Tempo em ambientes naturais (minutos)
            </VuiTypography>
            <Slider
              value={valores.ambiente.natureza}
              onChange={(e, novoValor) => handleChange("ambiente", "natureza", novoValor)}
              min={0}
              max={120}
              step={5}
              sx={{
                color: "#01b574",
                "& .MuiSlider-thumb": {
                  width: 20,
                  height: 20,
                  backgroundColor: "#01b574",
                  border: "2px solid #FFFFFF",
                },
                "& .MuiSlider-track": {
                  backgroundColor: "#01b574",
                },
                "& .MuiSlider-rail": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            />
            <VuiBox display="flex" justifyContent="space-between" mt={1}>
              <VuiTypography variant="caption" color="text">
                {valores.ambiente.natureza}min
              </VuiTypography>
              <VuiTypography variant="caption" color="white">
                Excelente
              </VuiTypography>
            </VuiBox>
          </VuiBox>
        </VuiBox>
      );

    case "Atividade Física":
      return (
        <VuiBox>
          <VuiTypography variant="body1" color="text" mb={4}>
            Movimento regular é essencial para a saúde física e mental.
          </VuiTypography>
          <VuiBox mb={4}>
            <VuiTypography variant="body2" color="white" fontWeight="medium" mb={2}>
              Tempo de Treino (horas)
            </VuiTypography>
            <Slider
              value={valores.atividade.tempo}
              onChange={(e, novoValor) => handleChange("atividade", "tempo", novoValor)}
              min={0}
              max={3}
              step={0.5}
              sx={{
                color: "#2E72AC",
                "& .MuiSlider-thumb": {
                  width: 20,
                  height: 20,
                  backgroundColor: "#2E72AC",
                  border: "2px solid #FFFFFF",
                },
                "& .MuiSlider-track": {
                  backgroundColor: "#2E72AC",
                },
                "& .MuiSlider-rail": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            />
            <VuiBox display="flex" justifyContent="space-between" mt={1}>
              <VuiTypography variant="caption" color="text">
                {valores.atividade.tempo}h
              </VuiTypography>
              <VuiTypography variant="caption" color="white">
                Ótimo
              </VuiTypography>
            </VuiBox>
          </VuiBox>
          <VuiBox>
            <VuiTypography variant="body2" color="white" fontWeight="medium" mb={2}>
              Intensidade do Treino (%)
            </VuiTypography>
            <Slider
              value={valores.atividade.intensidade}
              onChange={(e, novoValor) => handleChange("atividade", "intensidade", novoValor)}
              min={0}
              max={100}
              step={5}
              sx={{
                color: "#01b574",
                "& .MuiSlider-thumb": {
                  width: 20,
                  height: 20,
                  backgroundColor: "#01b574",
                  border: "2px solid #FFFFFF",
                },
                "& .MuiSlider-track": {
                  backgroundColor: "#01b574",
                },
                "& .MuiSlider-rail": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            />
            <VuiBox display="flex" justifyContent="space-between" mt={1}>
              <VuiTypography variant="caption" color="text">
                {valores.atividade.intensidade}%
              </VuiTypography>
              <VuiTypography variant="caption" color="white">
                {getLabel(valores.atividade.intensidade, "percentual")}
              </VuiTypography>
            </VuiBox>
          </VuiBox>
        </VuiBox>
      );

    case "Sistema Nervoso":
      return (
        <VuiBox>
          <VuiTypography variant="body1" color="text" mb={4}>
            O equilíbrio do sistema nervoso impacta diretamente sua qualidade de vida.
          </VuiTypography>
          <VuiBox mb={4}>
            <VuiTypography variant="body2" color="white" fontWeight="medium" mb={2}>
              Nível de Estresse (%)
            </VuiTypography>
            <Slider
              value={valores.sistemaNervoso.estresse}
              onChange={(e, novoValor) => handleChange("sistemaNervoso", "estresse", novoValor)}
              min={0}
              max={100}
              step={5}
              sx={{
                color: "#01b574",
                "& .MuiSlider-thumb": {
                  width: 20,
                  height: 20,
                  backgroundColor: "#01b574",
                  border: "2px solid #FFFFFF",
                },
                "& .MuiSlider-track": {
                  backgroundColor: "#01b574",
                },
                "& .MuiSlider-rail": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            />
            <VuiBox display="flex" justifyContent="space-between" mt={1}>
              <VuiTypography variant="caption" color="text">
                {valores.sistemaNervoso.estresse}%
              </VuiTypography>
              <VuiTypography variant="caption" color="white">
                {valores.sistemaNervoso.estresse < 40 ? "Excelente" : valores.sistemaNervoso.estresse < 70 ? "Moderado" : "Alto"}
              </VuiTypography>
            </VuiBox>
          </VuiBox>
          <VuiBox>
            <VuiTypography variant="body2" color="white" fontWeight="medium" mb={2}>
              Tempo de Mindfulness/Meditação (minutos)
            </VuiTypography>
            <Slider
              value={valores.sistemaNervoso.mindfulness}
              onChange={(e, novoValor) => handleChange("sistemaNervoso", "mindfulness", novoValor)}
              min={0}
              max={60}
              step={5}
              sx={{
                color: "#2E72AC",
                "& .MuiSlider-thumb": {
                  width: 20,
                  height: 20,
                  backgroundColor: "#2E72AC",
                  border: "2px solid #FFFFFF",
                },
                "& .MuiSlider-track": {
                  backgroundColor: "#2E72AC",
                },
                "& .MuiSlider-rail": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            />
            <VuiBox display="flex" justifyContent="space-between" mt={1}>
              <VuiTypography variant="caption" color="text">
                {valores.sistemaNervoso.mindfulness}min
              </VuiTypography>
              <VuiTypography variant="caption" color="white">
                {valores.sistemaNervoso.mindfulness > 20 ? "Excelente" : valores.sistemaNervoso.mindfulness > 10 ? "Bom" : "Básico"}
              </VuiTypography>
            </VuiBox>
          </VuiBox>
        </VuiBox>
      );

    case "Alimentação":
      return (
        <VuiBox>
          <VuiTypography variant="body1" color="text" mb={4}>
            A nutrição adequada é a base para o seu desempenho.
          </VuiTypography>
          <VuiBox mb={4}>
            <VuiTypography variant="body2" color="white" fontWeight="medium" mb={2}>
              Refeições Completas Hoje
            </VuiTypography>
            <Slider
              value={valores.alimentacao.refeicoes}
              onChange={(e, novoValor) => handleChange("alimentacao", "refeicoes", novoValor)}
              min={0}
              max={6}
              step={1}
              sx={{
                color: "#4299e1",
                "& .MuiSlider-thumb": {
                  width: 20,
                  height: 20,
                  backgroundColor: "#4299e1",
                  border: "2px solid #FFFFFF",
                },
                "& .MuiSlider-track": {
                  backgroundColor: "#4299e1",
                },
                "& .MuiSlider-rail": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            />
            <VuiBox display="flex" justifyContent="space-between" mt={1}>
              <VuiTypography variant="caption" color="text">
                {valores.alimentacao.refeicoes} refeições
              </VuiTypography>
              <VuiTypography variant="caption" color="white">
                {valores.alimentacao.refeicoes >= 4 ? "Excelente" : valores.alimentacao.refeicoes >= 2 ? "Bom" : "Insuficiente"}
              </VuiTypography>
            </VuiBox>
          </VuiBox>
          <VuiBox>
            <VuiTypography variant="body2" color="white" fontWeight="medium" mb={2}>
              Ingestão de Água (litros)
            </VuiTypography>
            <Slider
              value={valores.alimentacao.agua}
              onChange={(e, novoValor) => handleChange("alimentacao", "agua", novoValor)}
              min={0}
              max={4}
              step={0.1}
              sx={{
                color: "#01b574",
                "& .MuiSlider-thumb": {
                  width: 20,
                  height: 20,
                  backgroundColor: "#01b574",
                  border: "2px solid #FFFFFF",
                },
                "& .MuiSlider-track": {
                  backgroundColor: "#01b574",
                },
                "& .MuiSlider-rail": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            />
            <VuiBox display="flex" justifyContent="space-between" mt={1}>
              <VuiTypography variant="caption" color="text">
                {valores.alimentacao.agua}L
              </VuiTypography>
              <VuiTypography variant="caption" color="white">
                {valores.alimentacao.agua >= 2 ? "Excelente" : valores.alimentacao.agua >= 1.5 ? "Bom" : "Insuficiente"}
              </VuiTypography>
            </VuiBox>
          </VuiBox>
        </VuiBox>
      );

    case "Relacionamento":
      return (
        <VuiBox>
          <VuiTypography variant="body1" color="text" mb={4}>
            Conexões saudáveis enriquecem sua vida e bem-estar.
          </VuiTypography>
          <VuiBox mb={4}>
            <VuiTypography variant="body2" color="white" fontWeight="medium" mb={2}>
              Qualidade das Interações Sociais (%)
            </VuiTypography>
            <Slider
              value={valores.relacionamento.qualidade}
              onChange={(e, novoValor) => handleChange("relacionamento", "qualidade", novoValor)}
              min={0}
              max={100}
              step={5}
              sx={{
                color: "#9f7aea",
                "& .MuiSlider-thumb": {
                  width: 20,
                  height: 20,
                  backgroundColor: "#9f7aea",
                  border: "2px solid #FFFFFF",
                },
                "& .MuiSlider-track": {
                  backgroundColor: "#9f7aea",
                },
                "& .MuiSlider-rail": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            />
            <VuiBox display="flex" justifyContent="space-between" mt={1}>
              <VuiTypography variant="caption" color="text">
                {valores.relacionamento.qualidade}%
              </VuiTypography>
              <VuiTypography variant="caption" color="white">
                {getLabel(valores.relacionamento.qualidade, "percentual")}
              </VuiTypography>
            </VuiBox>
          </VuiBox>
          <VuiBox>
            <VuiTypography variant="body2" color="white" fontWeight="medium" mb={2}>
              Satisfação com Relacionamentos (%)
            </VuiTypography>
            <Slider
              value={valores.relacionamento.tempo}
              onChange={(e, novoValor) => handleChange("relacionamento", "tempo", novoValor)}
              min={0}
              max={100}
              step={5}
              sx={{
                color: "#9f7aea",
                "& .MuiSlider-thumb": {
                  width: 20,
                  height: 20,
                  backgroundColor: "#9f7aea",
                  border: "2px solid #FFFFFF",
                },
                "& .MuiSlider-track": {
                  backgroundColor: "#9f7aea",
                },
                "& .MuiSlider-rail": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            />
            <VuiBox display="flex" justifyContent="space-between" mt={1}>
              <VuiTypography variant="caption" color="text">
                {valores.relacionamento.tempo}%
              </VuiTypography>
              <VuiTypography variant="caption" color="white">
                {getLabel(valores.relacionamento.tempo, "percentual")}
              </VuiTypography>
            </VuiBox>
          </VuiBox>
        </VuiBox>
      );

    default:
      return null;
  }
}

export default CheckinDiarios;


import React from "react";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";

import { IoFastFoodOutline, IoTimeOutline, IoWaterOutline, IoNutritionOutline } from "react-icons/io5";

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

const metasDiarias = {
  calorias: 2100,
  proteinas: 160,
  carboidratos: 240,
  gorduras: 70,
  fibras: 30,
  agua: "2,5 L",
};

const refeicoes = [
  {
    id: 1,
    nome: "Café da Manhã",
    horario: "07:30",
    kcal: 480,
    foco: "Estabilidade de energia e aporte proteico logo ao acordar.",
    itens: [
      { alimento: "Ovos mexidos", quantidade: "3 unidades", kcal: 210 },
      { alimento: "Aveia em flocos", quantidade: "40 g", kcal: 150 },
      { alimento: "Banana prata", quantidade: "1 unidade média", kcal: 95 },
      { alimento: "Castanhas-do-pará", quantidade: "2 unidades", kcal: 25 },
    ],
    macros: { proteina: "30 g", carboidrato: "45 g", gordura: "18 g" },
  },
  {
    id: 2,
    nome: "Lanche da Manhã",
    horario: "10:00",
    kcal: 210,
    foco: "Manter saciedade e evitar queda de desempenho cognitivo.",
    itens: [
      { alimento: "Iogurte grego natural", quantidade: "170 g (1 pote)", kcal: 120 },
      { alimento: "Amêndoas", quantidade: "15 g (1 colher de sopa cheia)", kcal: 90 },
    ],
    macros: { proteina: "12 g", carboidrato: "10 g", gordura: "11 g" },
  },
  {
    id: 3,
    nome: "Almoço",
    horario: "12:30",
    kcal: 620,
    foco: "Refeição completa com foco em saciedade prolongada e recuperação muscular.",
    itens: [
      { alimento: "Arroz integral cozido", quantidade: "120 g (4 colheres de sopa)", kcal: 150 },
      { alimento: "Feijão carioca cozido", quantidade: "110 g (concha média)", kcal: 150 },
      { alimento: "Peito de frango grelhado", quantidade: "150 g", kcal: 210 },
      { alimento: "Brócolis no vapor", quantidade: "80 g", kcal: 40 },
      { alimento: "Azeite de oliva extra virgem", quantidade: "1 colher de sopa", kcal: 70 },
    ],
    macros: { proteina: "45 g", carboidrato: "60 g", gordura: "20 g" },
  },
  {
    id: 4,
    nome: "Lanche da Tarde",
    horario: "16:00",
    kcal: 280,
    foco: "Aporte de carboidratos de média absorção antes do treino.",
    itens: [
      { alimento: "Pão integral", quantidade: "2 fatias", kcal: 160 },
      { alimento: "Pasta de atum com cottage", quantidade: "60 g", kcal: 120 },
    ],
    macros: { proteina: "18 g", carboidrato: "32 g", gordura: "8 g" },
  },
  {
    id: 5,
    nome: "Pré-Treino",
    horario: "18:00",
    kcal: 180,
    foco: "Elevar energia imediata e preservar massa magra durante o treino.",
    itens: [
      { alimento: "Banana nanica", quantidade: "1 unidade grande", kcal: 120 },
      { alimento: "Pasta de amendoim", quantidade: "1 colher de sopa cheia (20 g)", kcal: 60 },
    ],
    macros: { proteina: "6 g", carboidrato: "28 g", gordura: "6 g" },
  },
  {
    id: 6,
    nome: "Jantar",
    horario: "20:30",
    kcal: 420,
    foco: "Reparação muscular noturna com digestão leve.",
    itens: [
      { alimento: "Quinoa cozida", quantidade: "100 g", kcal: 120 },
      { alimento: "Salmão grelhado", quantidade: "130 g", kcal: 230 },
      { alimento: "Aspargos salteados", quantidade: "80 g", kcal: 50 },
      { alimento: "Limão espremido", quantidade: "1 unidade", kcal: 20 },
    ],
    macros: { proteina: "35 g", carboidrato: "32 g", gordura: "16 g" },
  },
  {
    id: 7,
    nome: "Ceia",
    horario: "22:00",
    kcal: 180,
    foco: "Fornecer aminoácidos de liberação lenta e apoio ao sono.",
    itens: [
      { alimento: "Iogurte natural integral", quantidade: "170 g (1 pote)", kcal: 120 },
      { alimento: "Semente de chia", quantidade: "10 g (1 colher de sobremesa)", kcal: 60 },
    ],
    macros: { proteina: "12 g", carboidrato: "12 g", gordura: "8 g" },
  },
];

const observacoes = [
  "Priorizar consumo de água distribuída ao longo do dia, evitando intervalos maiores que 60 minutos sem ingestão.",
  "Ajustar o horário das refeições em até ±30 minutos conforme rotina do paciente, mantendo a distribuição total.",
  "Antes dos treinos intensos, manter intervalo de 60-90 minutos após a refeição completa para otimizar digestão.",
  "Em dias de menor atividade física, reduzir 20% das porções de carboidratos principais (arroz, pão, banana).",
  "Registrar saciedade e energia em cada refeição para ajustes finos na próxima consulta.",
];

const Alimentacao = () => {
  const { gradients } = colors;
  const { cardContent, info, success } = gradients;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox pt={3} pb={6}>
        <VuiBox mb={4}>
          <VuiTypography variant="h3" color="white" fontWeight="bold" mb={1}>
            Plano Alimentar Personalizado
          </VuiTypography>
          <VuiTypography variant="body2" color="text" fontWeight="regular" sx={{ maxWidth: 720 }}>
            Estrutura diária com horários, porções e calorias planejadas para favorecer desempenho cognitivo,
            composição corporal e qualidade do sono. Os alimentos podem ser trocados por opções equivalentes
            em macronutrientes conforme orientação profissional.
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
                    Calorias Diárias
                  </VuiTypography>
                </VuiBox>
                <VuiTypography variant="h3" color="white" fontWeight="bold">
                  {metasDiarias.calorias} kcal
                </VuiTypography>
                <VuiTypography variant="caption" color="text">
                  Distribuídas em 38% carboidratos, 32% proteínas e 30% gorduras.
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
                  <IoFastFoodOutline size={28} color="#01b574" />
                  <VuiTypography variant="h6" color="white" fontWeight="bold">
                    Metas de Macronutrientes
                  </VuiTypography>
                </VuiBox>
                <VuiTypography variant="body2" color="text">
                  <strong>Proteínas:</strong> {metasDiarias.proteinas} g / dia
                </VuiTypography>
                <VuiTypography variant="body2" color="text">
                  <strong>Carboidratos:</strong> {metasDiarias.carboidratos} g / dia
                </VuiTypography>
                <VuiTypography variant="body2" color="text">
                  <strong>Gorduras:</strong> {metasDiarias.gorduras} g / dia
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
                    Hidratação e Fibras
                  </VuiTypography>
                </VuiBox>
                <VuiTypography variant="body2" color="text">
                  <strong>Água:</strong> {metasDiarias.agua}
                </VuiTypography>
                <VuiTypography variant="body2" color="text">
                  <strong>Fibras:</strong> {metasDiarias.fibras} g / dia
                </VuiTypography>
                <VuiTypography variant="caption" color="text">
                  Fracionar ingestão ao longo do dia e priorizar vegetais variados.
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
                    Janela Alimentar
                  </VuiTypography>
                </VuiBox>
                <VuiTypography variant="body2" color="text">
                  Refeições entre 07h30 e 22h, com intervalos médios de 2h30 a 3h.
                </VuiTypography>
                <VuiTypography variant="caption" color="text">
                  Ajustar conforme agenda e sinais de fome, mantendo regularidade.
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
            {refeicoes.map((refeicao) => (
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
                          {refeicao.horario} • {refeicao.kcal} kcal
                        </VuiTypography>
                        <VuiTypography variant="h5" color="white" fontWeight="bold">
                          {refeicao.nome}
                        </VuiTypography>
                      </VuiBox>
                      <Chip
                        label={`${refeicao.macros.proteina} P • ${refeicao.macros.carboidrato} C • ${refeicao.macros.gordura} G`}
                        sx={{
                          backgroundColor: "rgba(255, 255, 255, 0.08)",
                          color: "#FFFFFF",
                          fontWeight: "bold",
                        }}
                      />
                    </VuiBox>

                    <VuiTypography variant="body2" color="text" fontWeight="regular" mb={2}>
                      {refeicao.foco}
                    </VuiTypography>

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
                      {refeicao.itens.map((item, index) => (
                        <VuiBox
                          key={item.alimento}
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
                            {item.kcal}
                          </VuiTypography>
                        </VuiBox>
                      ))}
                    </VuiBox>

                    <VuiBox mt="auto">
                      <Divider sx={{ my: 3, backgroundColor: "rgba(255, 255, 255, 0.08)" }} />
                      <VuiTypography variant="caption" color="text">
                        Ajustes finos podem ser realizados com equivalentes nutricionais (ex.: trocar frango por tofu,
                        arroz por batata-doce) mantendo porções e calorias sugeridas.
                      </VuiTypography>
                    </VuiBox>
                  </VuiBox>
                </Card>
              </Grid>
            ))}
          </Grid>
        </VuiBox>

        <VuiBox mt={6}>
          <Card
            sx={{
              borderRadius: "20px",
              background: linearGradient(cardContent.main, cardContent.state, cardContent.deg),
            }}
          >
            <VuiBox p={3}>
              <VuiTypography variant="h4" color="white" fontWeight="bold" mb={2}>
                Observações e Estratégias
              </VuiTypography>
              <Grid container spacing={2}>
                {observacoes.map((texto, index) => (
                  <Grid item xs={12} md={6} key={texto}>
                    <VuiBox
                      sx={{
                        background: "rgba(255, 255, 255, 0.04)",
                        borderRadius: "16px",
                        px: 3,
                        py: 2.5,
                      }}
                    >
                      <VuiTypography variant="button" color="text" fontWeight="medium" mb={1}>
                        {`Estratégia ${index + 1}`}
                      </VuiTypography>
                      <VuiTypography variant="body2" color="white" fontWeight="regular" sx={{ lineHeight: 1.7 }}>
                        {texto}
                      </VuiTypography>
                    </VuiBox>
                  </Grid>
                ))}
              </Grid>
            </VuiBox>
          </Card>
        </VuiBox>
      </VuiBox>
      <Footer />
    </DashboardLayout>
  );
};

export default Alimentacao;



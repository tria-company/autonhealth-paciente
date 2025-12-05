import React from "react";

import { Card, Icon } from "@mui/material";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import colors from "assets/theme/base/colors";
import linearGradient from "assets/theme/functions/linearGradient";
import { usePaciente } from "hooks/usePaciente";

// imagem vinda da pasta public

const WelcomeMark = () => {
  const { gradients } = colors;
  const { cardDark } = gradients;
  const { paciente } = usePaciente();

  // Extrair apenas nome e sobrenome
  const nomeCompleto = paciente?.name || "Usuário";
  const partesNome = nomeCompleto.trim().split(' ');
  const nomeExibicao = partesNome.length >= 2 
    ? `${partesNome[0]} ${partesNome[1]}`
    : partesNome[0];

  return (
    <Card sx={() => ({
      height: "340px",
      py: "32px",
      backgroundImage: `${linearGradient(cardDark.main, cardDark.state, cardDark.deg)}, url(/card-main.png)`,
      backgroundRepeat: "no-repeat, no-repeat",
      backgroundSize: "100% 100%, auto 100%",
      backgroundPosition: "center, right center"
    })}>
      <VuiBox height="100%" display="flex" flexDirection="column" justifyContent="space-between">
        <VuiBox>
          <VuiTypography color="text" variant="button" fontWeight="regular" mb="12px">
            Bem vindo de volta,
          </VuiTypography>
          <VuiTypography color="white" variant="h3" fontWeight="bold" mb="18px">
            {nomeExibicao}
          </VuiTypography>
          <VuiTypography color="text" variant="h6" fontWeight="regular" mb="auto">
            Que bom ver você de novo!
            <br />
          </VuiTypography>
        </VuiBox>
        <VuiTypography
          component="a"
          href="#"
          variant="button"
          color="white"
          fontWeight="regular"
          sx={{
            mr: "5px",
            display: "inline-flex",
            alignItems: "center",
            cursor: "pointer",

            "& .material-icons-round": {
              fontSize: "1.125rem",
              transform: `translate(2px, -0.5px)`,
              transition: "transform 0.2s cubic-bezier(0.34,1.61,0.7,1.3)",
            },

            "&:hover .material-icons-round, &:focus  .material-icons-round": {
              transform: `translate(6px, -0.5px)`,
            },
          }}
        >
          Tap to record
          <Icon sx={{ fontWeight: "bold", ml: "5px" }}>arrow_forward</Icon>
        </VuiTypography>
      </VuiBox>
    </Card>
  );
};

export default WelcomeMark;

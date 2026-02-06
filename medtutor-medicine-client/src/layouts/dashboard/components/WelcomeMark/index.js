import React from "react";

import { Card } from "@mui/material";
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

  const nomeCompleto = paciente?.name || "Usuário";
  const primeiroNome = nomeCompleto.trim().split(" ")[0] || nomeCompleto;

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
            {primeiroNome}
          </VuiTypography>
          <VuiTypography color="text" variant="h6" fontWeight="regular" mb="auto">
            Que bom ver você de novo!
            <br />
          </VuiTypography>
        </VuiBox>
      </VuiBox>
    </Card>
  );
};

export default WelcomeMark;

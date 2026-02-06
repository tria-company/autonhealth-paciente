// @mui material components
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Icon from "@mui/material/Icon";
import Link from "@mui/material/Link";

import VuiButton from "components/VuiButton";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";

// Custom styles for the SidenavCard
import { card, cardContent, cardIconBox, cardIcon } from "examples/Sidenav/styles/sidenavCard";

import { useVisionUIController } from "context";

function SidenavCard({ color, ...rest }) {
  const [controller] = useVisionUIController();
  const { miniSidenav, sidenavColor } = controller;

  return (
    <Card sx={(theme) => card(theme, { miniSidenav })}>
      <CardContent sx={(theme) => cardContent(theme, { sidenavColor })}>
        <VuiBox
          bgColor="light"
          width="2rem"
          height="2rem"
          borderRadius="md"
          shadow="md"
          mb={2}
          sx={cardIconBox}
        >
          <Icon fontSize="medium" sx={(theme) => cardIcon(theme, { color })}>
            help
          </Icon>
        </VuiBox>
        <VuiBox lineHeight={1}>
          <VuiTypography variant="h6" color="dark">
            Precisa de ajuda?
          </VuiTypography>
          <VuiBox mb={1.825} mt={-1}>
            {/* Texto removido conforme solicitado */}
          </VuiBox>
          <VuiButton
            component={Link}
            href="https://www.google.com"
            target="_blank"
            rel="noreferrer"
            size="small"
            sx={({ palette: { primary, white } }) => ({
              color: `${white.main} !important`,
              background: primary.main,
              "&:hover": {
                background: primary.focus,
              },
            })}
            fullWidth
          >
            ACESSAR
          </VuiButton>
        </VuiBox>
      </CardContent>
    </Card>
  );
}

export default SidenavCard;

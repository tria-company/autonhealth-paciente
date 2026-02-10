// @mui material components
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Icon from "@mui/material/Icon";

import VuiButton from "components/VuiButton";

// Custom styles for the SidenavCard
import { card, cardContent } from "examples/Sidenav/styles/sidenavCard";

import { useVisionUIController } from "context";
import { useHistory } from "react-router-dom";
import { supabase } from "lib/supabase-client";

function SidenavCard({ color, ...rest }) {
  const [controller] = useVisionUIController();
  const { miniSidenav, sidenavColor } = controller;
  const history = useHistory();

  const handleSair = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("paciente");
      localStorage.removeItem("user_auth_id");
      history.push("/authentication/sign-in");
    } catch (error) {
      console.error("Erro ao sair da plataforma:", error);
    }
  };

  return (
    <Card sx={(theme) => card(theme, { miniSidenav })}>
      <CardContent sx={(theme) => cardContent(theme, { sidenavColor })}>
        <VuiButton
          onClick={handleSair}
          size="small"
          sx={({ palette: { primary, white } }) => ({
            color: `${white.main} !important`,
            background: primary.main,
            "&:hover": {
              background: primary.focus,
            },
          })}
          fullWidth
          startIcon={<Icon>logout</Icon>}
        >
          Sair da plataforma
        </VuiButton>
      </CardContent>
    </Card>
  );
}

export default SidenavCard;

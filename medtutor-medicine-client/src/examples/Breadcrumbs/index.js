// react-router-dom components
import { Link } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import { Breadcrumbs as MuiBreadcrumbs } from "@mui/material";
import Icon from "@mui/material/Icon";

import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";

const ROUTE_LABELS = {
  lifestyle: "Estilo de Vida",
  "livro-da-vida": "Livro da Vida",
  alimentacao: "Alimentação",
  "exercicio-fisico": "Exercício Físico",
  "suplementos-fitoterapicos": "Suplementos e Fitoterápicos",
  "checkin-diarios": "Check-in Diários",
  perfil: "Perfil",
  dashboard: "Início",
};

function getRouteLabel(segment) {
  return ROUTE_LABELS[segment] || segment.replace(/-/g, " ");
}

function Breadcrumbs({ icon, title, route, light, inline }) {
  const routeArray = Array.isArray (route) ? route : [route];
  const routes = routeArray.slice(0, -1);
  const currentLabel = getRouteLabel(title || routeArray[routeArray.length - 1]);

  const breadcrumbContent = (
    <MuiBreadcrumbs
      sx={{
        "& .MuiBreadcrumbs-separator": {
          color: ({ palette: { white, grey } }) => (light ? white.main : grey[600]),
        },
      }}
    >
      <Link to="/dashboard">
        <VuiTypography
          component="span"
          variant="body2"
          color={light ? "white" : "dark"}
          opacity={light ? 0.8 : 0.5}
          sx={{ lineHeight: 0 }}
        >
          <Icon>{icon}</Icon>
        </VuiTypography>
      </Link>
      {routes.map((el) => (
        <VuiTypography
          key={el}
          component="span"
          variant="button"
          fontWeight="regular"
          color={light ? "white" : "dark"}
          opacity={light ? 0.8 : 0.5}
          sx={{ lineHeight: 0, textTransform: "capitalize" }}
        >
          {getRouteLabel(el)}
        </VuiTypography>
      ))}
      <VuiTypography
        variant="button"
        fontWeight="regular"
        textTransform="capitalize"
        color={light ? "white" : "dark"}
        sx={{ lineHeight: 0 }}
      >
        {currentLabel}
      </VuiTypography>
    </MuiBreadcrumbs>
  );

  const titleContent = (
    <VuiTypography
      fontWeight="bold"
      textTransform="capitalize"
      variant="h6"
      color={light ? "white" : "dark"}
      noWrap
    >
      {currentLabel}
    </VuiTypography>
  );

  return (
    <VuiBox
      mr={{ xs: 0, xl: 8 }}
      sx={
        inline
          ? {
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
            }
          : {}
      }
    >
      
      {titleContent}
    </VuiBox>
  );
}

// Setting default values for the props of Breadcrumbs
Breadcrumbs.defaultProps = {
  light: false,
  inline: false,
};

// Typechecking props for the Breadcrumbs
Breadcrumbs.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  route: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  light: PropTypes.bool,
  inline: PropTypes.bool,
};

export default Breadcrumbs;

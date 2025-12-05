/*!

=========================================================
* Vision UI Free React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/vision-ui-free-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)
* Licensed under MIT (https://github.com/creativetimofficial/vision-ui-free-react/blob/master LICENSE.md)

* Design and Coded by Simmmple & Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import { useState, useEffect } from "react";

// react-router components
import { useLocation, Link, useHistory } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @material-ui core components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";

// Vision UI Dashboard React example components
import Breadcrumbs from "examples/Breadcrumbs";

// Custom styles for DashboardNavbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

// Vision UI Dashboard React context
import {
  useVisionUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";

// Supabase
import { supabase } from "lib/supabase-client";
import { usePaciente } from "hooks/usePaciente";

function DashboardNavbar({ absolute, light, isMini }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useVisionUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const route = useLocation().pathname.split("/").slice(1);
  const history = useHistory();
  const { paciente } = usePaciente();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('paciente');
      localStorage.removeItem('user_auth_id');
      history.push('/authentication/sign-in');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  useEffect(() => {
    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    /** 
     The event listener that's calling the handleTransparentNavbar function when 
     scrolling the window.
    */
    window.addEventListener("scroll", handleTransparentNavbar);

    // Call the handleTransparentNavbar function to set the state with the initial value.
    handleTransparentNavbar();

    // Remove event listener on cleanup
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);

  // Render the profile menu
  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ 
        mt: 2,
        "& .MuiPaper-root": {
          backgroundColor: "#0F1535",
          border: "1px solid rgba(226, 232, 240, 0.1)",
          minWidth: "280px",
          borderRadius: "12px",
        }
      }}
    >
      <VuiBox px={2.5} py={2.5}>
        {/* Header do Perfil */}
        <VuiBox display="flex" alignItems="center" mb={2.5}>
          <Icon sx={{ fontSize: "48px", color: "#0075FF" }}>account_circle</Icon>
          <VuiBox ml={2}>
            <VuiTypography variant="h6" color="white" fontWeight="bold" sx={{ mb: 0.3 }}>
              {paciente?.name}
            </VuiTypography>
            <VuiTypography variant="caption" color="text" fontWeight="regular">
              Paciente
            </VuiTypography>
          </VuiBox>
        </VuiBox>

        {/* Divisor */}
        <VuiBox 
          sx={{ 
            height: "1px", 
            backgroundColor: "rgba(226, 232, 240, 0.15)",
            mb: 2 
          }} 
        />

        {/* Botão Acessar Perfil */}
        <VuiBox mb={1}>
          <IconButton 
            component={Link}
            to="/perfil"
            sx={{
              width: "100%",
              justifyContent: "flex-start",
              padding: "12px 16px",
              borderRadius: "10px",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "rgba(0, 117, 255, 0.15)",
                transform: "translateX(4px)",
              }
            }}
            onClick={handleCloseMenu}
          >
            <Icon sx={{ color: "#0075FF", mr: 1.5, fontSize: "20px" }}>person</Icon>
            <VuiTypography variant="button" color="white" fontWeight="medium">
              Acessar Perfil
            </VuiTypography>
          </IconButton>
        </VuiBox>

        {/* Botão de Logout */}
        <VuiBox>
          <IconButton 
            sx={{
              width: "100%",
              justifyContent: "flex-start",
              padding: "12px 16px",
              borderRadius: "10px",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "rgba(255, 56, 56, 0.15)",
                transform: "translateX(4px)",
              }
            }}
            onClick={() => {
              handleCloseMenu();
              handleLogout();
            }}
          >
            <Icon sx={{ color: "#FF3838", mr: 1.5, fontSize: "20px" }}>logout</Icon>
            <VuiTypography variant="button" color="error" fontWeight="medium">
              Sair da Conta
            </VuiTypography>
          </IconButton>
        </VuiBox>
      </VuiBox>
    </Menu>
  );

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <VuiBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          <Breadcrumbs icon="home" title={(route && route.length ? route[route.length - 1] : "")} route={route || []} light={light} />
        </VuiBox>
        {isMini ? null : (
          <VuiBox sx={(theme) => navbarRow(theme, { isMini })}>
            <VuiBox color={light ? "white" : "inherit"} display="flex" alignItems="center" gap={2}>
              {/* Perfil do Paciente */}
              {paciente && (
                <IconButton 
                  sx={navbarIconButton} 
                  size="small" 
                  onClick={handleOpenMenu}
                  aria-controls="profile-menu"
                  aria-haspopup="true"
                >
                  <Icon
                    sx={({ palette: { dark, white } }) => ({
                      color: light ? white.main : dark.main,
                    })}
                  >
                    account_circle
                  </Icon>
                  <VuiTypography
                    variant="button"
                    fontWeight="medium"
                    color={light ? "white" : "dark"}
                    ml={1}
                  >
                    Perfil
                  </VuiTypography>
                </IconButton>
              )}
              
              {/* Botão de Menu Mobile */}
              <IconButton
                size="small"
                color="inherit"
                sx={navbarMobileMenu}
                onClick={handleMiniSidenav}
              >
                <Icon className={"text-white"}>{miniSidenav ? "menu_open" : "menu"}</Icon>
              </IconButton>
              
              {renderMenu()}
            </VuiBox>
          </VuiBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;

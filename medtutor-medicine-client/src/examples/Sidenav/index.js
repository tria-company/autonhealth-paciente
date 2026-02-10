import { useEffect, useState } from "react";

// react-router-dom components
import { useLocation, NavLink, useHistory } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";

import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiButton from "components/VuiButton";

import SidenavCollapse from "examples/Sidenav/SidenavCollapse";
import SidenavCard from "examples/Sidenav/SidenavCard";

// Custom styles for the Sidenav
import SidenavRoot from "examples/Sidenav/SidenavRoot";
import sidenavLogoLabel from "examples/Sidenav/styles/sidenav";

import { useVisionUIController, setMiniSidenav, setTransparentSidenav } from "context";

// function Sidenav({ color, brand, brandName, routes, ...rest }) {
function Sidenav({ color, brandName, routes, ...rest }) {
  const [controller, dispatch] = useVisionUIController();
  const { miniSidenav, transparentSidenav } = controller;
  const location = useLocation();
  const { pathname } = location;
  const collapseName = pathname.split("/").slice(1)[0];
  const [openMenu, setOpenMenu] = useState({});
  const history = useHistory();

  const closeSidenav = () => setMiniSidenav(dispatch, true);

  useEffect(() => {
    // A function that sets the mini state of the sidenav.
    function handleMiniSidenav() {
      setMiniSidenav(dispatch, window.innerWidth < 1200);
    }

    /** 
     The event listener that's calling the handleMiniSidenav function when resizing the window.
    */
    window.addEventListener("resize", handleMiniSidenav);

    // Call the handleMiniSidenav function to set the state with the initial value.
    handleMiniSidenav();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleMiniSidenav);
  }, [dispatch, location]);

  useEffect(() => {
    if (window.innerWidth < 1440) {
      setTransparentSidenav(dispatch, false);
    }
  }, []);

  useEffect(() => {
    // abre automaticamente o submenu correspondente à rota atual
    const first = pathname.split("/").slice(1)[0];
    if (first) {
      setOpenMenu((prev) => ({ ...prev, [first]: true }));
    }
  }, [pathname]);

  // Render all the routes from the routes.js (All the visible items on the Sidenav)
  const renderRoutes = routes.map(({ type, name, icon, title, noCollapse, key, route, href, collapse }) => {
    let returnValue;

    if (type === "collapse") {
      if (collapse && Array.isArray(collapse)) {
        // Parent with submenu
        const isOpen = openMenu[key] ?? key === collapseName;
        // Verifica se alguma rota filha está ativa
        const isChildActive = collapse.some((child) => pathname.startsWith(child.route));
        returnValue = (
          <SidenavCollapse
            key={key}
            color={color}
            name={name}
            icon={icon}
            active={false}
            open={isOpen}
            onClick={() => {
              const newOpenState = !isOpen;
              setOpenMenu((prev) => ({ ...prev, [key]: newOpenState }));
              // Se estiver abrindo e for "Estilo de Vida", navega para a primeira opção
              if (newOpenState && key === "lifestyle" && collapse.length > 0) {
                history.push(collapse[0].route);
              }
            }}
          >
            {collapse.map((child) => (
              <NavLink to={child.route} key={child.key}>
                <SidenavCollapse
                  color={color}
                  name={child.name}
                  icon={child.icon}
                  active={pathname.startsWith(child.route)}
                  noCollapse
                  isChild
                />
              </NavLink>
            ))}
          </SidenavCollapse>
        );
      } else {
        returnValue = href ? (
          <Link
            href={href}
            key={key}
            target="_blank"
            rel="noreferrer"
            sx={{ textDecoration: "none" }}
          >
            <SidenavCollapse
              color={color}
              name={name}
              icon={icon}
              active={key === collapseName}
              noCollapse={noCollapse}
            />
          </Link>
        ) : (
          <NavLink to={route} key={key}>
            <SidenavCollapse
              color={color}
              key={key}
              name={name}
              icon={icon}
              active={key === collapseName}
              noCollapse={noCollapse}
            />
          </NavLink>
        );
      }
    } else if (type === "title") {
      returnValue = (
        <VuiTypography
          key={key}
          color="text"
          display="block"
          variant="caption"
          fontWeight="bold"
          textTransform="uppercase"
          pl={3}
          mt={2}
          mb={1}
          ml={1}
        >
          {title}
        </VuiTypography>
      );
    } else if (type === "divider") {
      returnValue = <Divider light key={key} />;
    }

    return returnValue;
  });

  return (
    <SidenavRoot {...rest} variant="permanent" ownerState={{ transparentSidenav, miniSidenav }}>
      <VuiBox
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        <VuiBox
          pt={3.5}
          pb={0.5}
          px={4}
          textAlign="center"
          sx={{ flexShrink: 0, overflow: "unset !important" }}
        >
          <VuiBox
            display={{ xs: "block", xl: "none" }}
            position="absolute"
            top={0}
            right={0}
            p={1.625}
            onClick={closeSidenav}
            sx={{ cursor: "pointer" }}
          >
            <VuiTypography variant="h6" color="text">
              <Icon sx={{ fontWeight: "bold" }}>close</Icon>
            </VuiTypography>
          </VuiBox>
          <VuiBox component={NavLink} to="/dashboard" display="flex" alignItems="center">
            <VuiBox
              sx={
                ((theme) => sidenavLogoLabel(theme, { miniSidenav }),
                {
                  display: "flex",
                  alignItems: "center",
                  margin: "0 auto",
                })
              }
            >
              <VuiTypography
                variant="button"
                textGradient={false}
                color="dark"
                fontSize={14}
                letterSpacing={2}
                fontWeight="medium"
                sx={
                  ((theme) => sidenavLogoLabel(theme, { miniSidenav, transparentSidenav }),
                  {
                    opacity: miniSidenav || (miniSidenav && transparentSidenav) ? 0 : 1,
                    maxWidth: miniSidenav || (miniSidenav && transparentSidenav) ? 0 : "100%",
                    margin: "0 auto",
                  })
                }
              >
                {brandName}
              </VuiTypography>
            </VuiBox>
          </VuiBox>
        </VuiBox>
        <Divider light sx={{ flexShrink: 0 }} />
        <List
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {renderRoutes}
        </List>
        <VuiBox
          my={2}
          mx={2}
          mt="auto"
          sx={{
            flexShrink: 0,
            paddingBottom: { xs: "max(16px, env(safe-area-inset-bottom))", xl: 4 },
          }}
        >
          <SidenavCard color={color} />
        </VuiBox>
      </VuiBox>
    </SidenavRoot>
  );
}

// Setting default values for the props of Sidenav
Sidenav.defaultProps = {
  color: "info",
  // brand: "",
};

// Typechecking props for the Sidenav
Sidenav.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  // brand: PropTypes.string,
  brandName: PropTypes.string.isRequired,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidenav;

// Images
import backgroundImage from "assets/images/sidenav/sidenav-card-background.png";

function card(theme, ownerState) {
  const { borders, functions, transitions, breakpoints, palette } = theme;
  const { miniSidenav } = ownerState;

  const { borderRadius } = borders;
  const { pxToRem } = functions;
  const { white, borderCol } = palette;

  return {
    minWidth: "auto",
    backgroundImage: "none",
    backgroundColor: white.main,
    borderRadius: borderRadius.xl,
    boxShadow: "none",
    border: `1px solid ${borderCol.main}`,

    [breakpoints.up("xl")]: {
      maxHeight: miniSidenav ? pxToRem(64) : pxToRem(192),
      transition: transitions.create("max-height", {
        easing: transitions.easing.easeInOut,
        duration: transitions.duration.standard,
      }),
    },
    padding: "0px",
  };
}

function cardContent(theme) {
  const { palette, borders } = theme;

  const { dark, text } = palette;
  const { borderRadius } = borders;

  return {
    color: text.main,
    position: "relative",
    zIndex: 2,
    width: "100%",
    height: "100%",
    p: 2,

    "&::after": {
      content: '""',
      display: "block",
      height: "100%",
      width: "100%",
      borderRadius: borderRadius.xl,
      position: "absolute",
      top: 0,
      left: 0,
      opacity: 0,
      zIndex: -1,
    },

    "& .MuiButton-root": {
      color: dark.main,
    },

    "&:last-child": {
      pb: 2,
    },
  };
}

const cardIconBox = {
  display: "grid",
  placeItems: "center",
  transition: ({ transitions }) =>
    transitions.create("margin", {
      easing: transitions.easing.easeInOut,
      duration: transitions.duration.standard,
    }),
};

function cardIcon(theme, ownerState) {
  const { palette } = theme;
  const { color } = ownerState;

  return {
    WebkitTextFillColor: palette[color].main,
  };
}

export { card, cardContent, cardIconBox, cardIcon };

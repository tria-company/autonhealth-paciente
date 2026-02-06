function collapseItem(theme, ownerState) {
  const { palette, transitions, breakpoints, boxShadows, borders, functions } = theme;
  const { active, transparentSidenav, isChild } = ownerState;

  const { transparent, text } = palette;
  const { xxl } = boxShadows;
  const { borderRadius } = borders;
  const { pxToRem } = functions;

  return {
    background: isChild 
      ? (active ? "rgba(45, 98, 147, 0.12)" : transparent.main)
      : (active ? "rgba(45, 98, 147, 0.12)" : transparent.main),
    color: text.main,
    display: "flex",
    alignItems: "center",
    width: "100%",
    padding: `${pxToRem(10.8)} ${pxToRem(12.8)} ${pxToRem(10.8)} ${isChild ? pxToRem(32) : pxToRem(16)}`,
    margin: isChild ? `0 ${pxToRem(32)}` : `0 ${pxToRem(16)}`,
    borderRadius: borderRadius.lg,
    cursor: "pointer",
    userSelect: "none",
    whiteSpace: "normal",
    overflow: "visible",
    boxShadow: active && transparentSidenav && !isChild ? xxl : "none",
    borderLeft: isChild ? "2px solid rgba(45, 98, 147, 0.4)" : "none",
    [breakpoints.up("xl")]: {
      boxShadow: () => {
        if (active && !isChild) {
          return transparentSidenav ? xxl : "none";
        }

        return "none";
      },
      transition: transitions.create("box-shadow", {
        easing: transitions.easing.easeInOut,
        duration: transitions.duration.shorter,
      }),
    },
  };
}

function collapseIconBox(theme, ownerState) {
  const { palette, transitions, breakpoints, boxShadows, borders, functions } = theme;
  const { active, color } = ownerState;

  const { white, info, gradients, transparent, primary } = palette;
  const { md } = boxShadows;
  const { borderRadius } = borders;
  const { pxToRem } = functions;

  return {
    background: (active) => {
      if (active) {
        return color === "default" ? primary.main : primary.main;
      }
      return "rgba(27, 66, 102, 0.08)";
    },
    minWidth: pxToRem(32),
    minHeight: pxToRem(32),
    borderRadius: borderRadius.button,
    display: "grid",
    placeItems: "center",
    boxShadow: md,
    transition: transitions.create("margin", {
      easing: transitions.easing.easeInOut,
      duration: transitions.duration.standard,
    }),

    [breakpoints.up("xl")]: {
      background: () => {
        let background;

        if (!active) {
          background = "rgba(27, 66, 102, 0.08)";
        } else if (color === "default") {
          background = primary.main;
        } else if (color === "warning") {
          background = gradients.warning.main;
        } else {
          background = palette[color].main;
        }

        return background;
      },
    },

    backgroundColor: active ? palette[color].main : transparent.main,
    "& svg, svg g": {
      fill: active ? white.main : primary.main,
    },
  };
}

const collapseIcon = ({ palette: { white, text, primary } }, { active }) => ({
  color: active ? white.main : (text.main || primary.main),
});

function collapseText(theme, ownerState) {
  const { typography, transitions, breakpoints, functions } = theme;
  const { miniSidenav, active } = ownerState;

  const { size, fontWeightMedium, fontWeightRegular } = typography;
  const { pxToRem } = functions;

  return {
    marginLeft: pxToRem(12.8),

    [breakpoints.up("xl")]: {
      opacity: miniSidenav || miniSidenav ? 0 : 1,
      maxWidth: miniSidenav || miniSidenav ? 0 : "100%",
      marginLeft: miniSidenav || miniSidenav ? 0 : pxToRem(12.8),
      transition: transitions.create(["opacity", "margin"], {
        easing: transitions.easing.easeInOut,
        duration: transitions.duration.standard,
      }),
    },

    "& span": {
      fontWeight: active ? fontWeightMedium : fontWeightRegular,
      fontSize: size.sm,
      lineHeight: 1.4,
      color: active ? "#2c3e50" : "#2c3e50",
    },
  };
}

export { collapseItem, collapseIconBox, collapseIcon, collapseText };

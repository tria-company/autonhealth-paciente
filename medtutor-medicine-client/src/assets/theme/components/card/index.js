import colors from "assets/theme/base/colors";
import linearGradient from "assets/theme/functions/linearGradient";
import borders from "assets/theme/base/borders";
import boxShadows from "assets/theme/base/boxShadows";

import rgba from "assets/theme/functions/rgba";

const { black, gradients } = colors;
const { card } = gradients;
const { borderWidth, borderRadius } = borders;
const { xxl } = boxShadows;

export default {
  styleOverrides: {
    root: {
      display: "flex",
      flexDirection: "column",
      background: linearGradient(card.main, card.state, card.deg),
      backdropFilter: "blur(12px)",
      position: "relative",
      minWidth: 0,
      padding: "22px",
      wordWrap: "break-word",
      backgroundClip: "border-box",
      border: `1px solid ${rgba(black.main, 0.12)}`,
      borderRadius: borderRadius.xl,
      boxShadow: xxl,
    },
  },
};

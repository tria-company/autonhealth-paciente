// @mui material components
import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";

export default styled(Switch)(({ theme, ownerState }) => {
  const { palette } = theme;
  const { color } = ownerState;
  const { white, secondary } = palette;

  // styles for the button with variant="contained"
  const containedStyles = () => {
    const backgroundValue = palette[color] ? palette[color].main : white.main;

    return {
      "& .MuiSwitch-thumb": {
        backgroundColor: white.main,
      },
      "& .MuiSwitch-track": {
        backgroundColor: "rgba(180, 190, 200, 0.9) !important",
        borderColor: "transparent",
      },
      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
        backgroundColor: `${backgroundValue} !important`,
      },
    };
  };

  return {
    ...containedStyles(),
  };
});

import { Box, styled, Typography } from "@mui/material";
import React from "react";
import heroImg from "../../resources/hero-image.jpg";
import pngLogo from "../../resources/logo.png";

const StyledGradientBox = styled(Box)(({ theme }) => ({
  backgroundImage:
    "linear-gradient(182deg, hsla(240, 20%, 5%, 1), hsla(184, 100%, 50%, 0.81) 100%);",
  borderRadius: "11px",
  padding: "0rem 0.1rem 0.1rem 0.1rem",
  margin: "0px",
  width: "90%",
  height: "90%",
  marginBottom: "3rem",
}));

const OverlayLogoStyles = {
  background: "#0a0a0fc5",
  width: "80%",
  marginBottom: 5,
  borderRadius: "11px",
  padding: 2,
  backdropFilter: "blur(10px)",
  border: "solid 0.001em",
  borderColor: "hsla(184, 100%, 50%, 0.32)",
  display: "flex",
};

const OverlayStyledBox = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "100%",
  borderRadius: "11px",
  backgroundImage: `url(${heroImg})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "center",
}));

const imgStyle = {
  height: "100%",
  width: "100%",
  transform: "scale(1.2)",
  transformOrigin: "center",
};

const iconStyles = {
  height: 30,
  width: 40,
  padding: 2,
  marginRight: 3,
  background:
    "linear-gradient(120deg,rgba(0, 240, 255, 1) 1%, rgba(139, 92, 246, 1) 80%);",
  borderRadius: 2,
  fill: "white",
};

const StyledTypography = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.9rem",
  },
}));

function HeroImgContainer() {
  return (
    <StyledGradientBox>
      <OverlayStyledBox className="overlay">
        <Box sx={OverlayLogoStyles}>
          <Box sx={iconStyles}>
            <img src={pngLogo} alt="logo" style={imgStyle} />
          </Box>
          <Box sx={{ alignContent: "end" }}>
            <StyledTypography
              variant="body1"
              sx={{ color: "#aaa8a8ff", fontSize: "1.2em" }}
            >
              Din hälsa i fokus
            </StyledTypography>
            <StyledTypography variant="h6" color="white">
              Träning med hjärta för din hälsa i din takt
            </StyledTypography>
          </Box>
        </Box>
      </OverlayStyledBox>
    </StyledGradientBox>
  );
}

export default HeroImgContainer;

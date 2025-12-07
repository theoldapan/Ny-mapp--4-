import { Box, Button, Container, styled, Typography } from "@mui/material";
import React from "react";
import pngLogo from "../../resources/logo.png";
import EastIcon from "@mui/icons-material/East";

const shortMessageStyle = {
  background: "#00eeff27",
  width: "fit-content",
  borderRadius: "15px",
  padding: 1.1,
  display: "flex",
  alignItems: "center",
  border: "solid 0.1em",
  borderColor: "#00eeff86",
};

const ShortMessageStyleBox = styled(Box)(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {
    marginBottom: 40,
  },
}));

const imgStyle = {
  height: 30,
  width: 40,
  transform: "scale(1.1)",
  marginRight: 2,
};

const SloganText = styled(Typography)(({ theme }) => ({
  color: "white",
  fontWeight: "400",
  [theme.breakpoints.up("lg")]: {
    marginTop: "4rem",
    fontSize: "4rem",
    letterSpacing: "0.5rem",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "2.5rem",
  },
}));

const SubSloganText = styled(Typography)(({ theme }) => ({
  fontWeight: "600",
  textTransform: "uppercase",
  [theme.breakpoints.up("lg")]: {
    fontSize: "4rem",
    marginTop: 4,
    letterSpacing: "1rem",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "2.5rem",
  },
  background: "linear-gradient(to right, #00f0ff , #8b5cf6ff 10rem)",
  backgroundClip: "text",
  color: "transparent",
}));

const StyledStartJourneyButton = styled(Button)(({ theme }) => ({
  [theme.breakpoints.up("lg")]: {
    marginRight: 35,
  },
  [theme.breakpoints.up("sm")]: {
    marginRight: 30,
  },
  marginRight: 14,
  background: "#00f0ff",
  color: "#0a0a0f",
  fontWeight: "600",
  borderRadius: "10px",
  "&:hover": {
    background: "#00eeffce",
  },
}));

const programsNavigationButtonStyle = {
  border: "solid 0.001em",
  borderColor: "hsla(184, 100%, 50%, 0.45)",
  borderRadius: "10px",
};

const StyledContainer = styled(Container)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 0,
    marginTop: 96,
  },
}));

function HeroBanner() {
  return (
    <StyledContainer>
      <ShortMessageStyleBox sx={shortMessageStyle}>
        <img src={pngLogo} alt="logo" style={imgStyle} />
        <Typography variant="subtitle1" color="#00f0ff">
          Mer än ett gym ! Framtidens träning
        </Typography>
      </ShortMessageStyleBox>
      <div>
        <SloganText variant="h1">Allt börjar med din</SloganText>
        <SubSloganText variant="h1">hälsa</SubSloganText>
      </div>
      <Box sx={{ width: { lg: "80%", xs: "90%" }, marginTop: 4 }}>
        <Typography variant="h6" color="#8888a0">
          En personlig och välkomnande träningsanläggning där gemenskap och din
          hälsa står i centrum. Oavsett erfarenhet finns vi här för att hjälpa
          dig komma igång på rätt sätt
        </Typography>
      </Box>
      <Box marginTop={6}>
        <StyledStartJourneyButton
          variant="contained"
          endIcon={<EastIcon sx={{ marginLeft: 1 }} />}
        >
          Börja din resa
        </StyledStartJourneyButton>
        <Button sx={programsNavigationButtonStyle} variant="contained">
          Utforska våra program
        </Button>
      </Box>
      <Box
        marginTop={9}
        display="flex"
        justifyContent={"space-between"}
        width="70%"
      >
        <div>
          <Typography variant="h1" fontWeight={300} color="#00f0ff">
            3K+
          </Typography>
          <Typography variant="subtitle1" color="#8888a0">
            Medlemmar
          </Typography>
        </div>
        <div>
          <Typography variant="h1" fontWeight={300} color="#00f0ff">
            30+
          </Typography>
          <Typography variant="subtitle1" color="#8888a0">
            Tränare
          </Typography>
        </div>
        <div>
          <Typography variant="h1" fontWeight={300} color="#00f0ff">
            18 / 7
          </Typography>
          <Typography variant="subtitle1" color="#8888a0">
            Tillgång
          </Typography>
        </div>
      </Box>
    </StyledContainer>
  );
}

export default HeroBanner;

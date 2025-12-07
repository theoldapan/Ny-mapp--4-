import { Box, Grid, styled } from "@mui/material";
import React from "react";
import HeroImgContainer from "./HeroImgContainer";
import HeroBanner from "./HeroBanner";

const boxStyle = {
  background:
    "linear-gradient(166deg, hsla(240, 20%, 5%, 0.80) 65%, hsla(198, 80%, 6%, 1.00) 100%);",
};

const StyledContainerBox = styled(Box)(({ theme }) => ({
  height: "100%",
  backgroundImage:
    "linear-gradient(to right, #ffffff22 1px, transparent 1px),linear-gradient(to bottom, #ffffff22 1px, transparent 1px)",
  backgroundSize: "5rem 5rem",
}));

function Hero() {
  return (
    <Box sx={{ boxStyle, height: { md: "100vh" } }}>
      <StyledContainerBox>
        <Grid container height={"100%"} alignItems={"center"}>
          <Grid size={{ xs: 12, md: 6 }} height={600}>
            <HeroBanner />
          </Grid>
          <Grid
            size={{ xs: 12, md: 6 }}
            height={600}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <HeroImgContainer />
          </Grid>
        </Grid>
      </StyledContainerBox>
    </Box>
  );
}

export default Hero;

import { Box, Grid, styled, Typography } from "@mui/material";
import React from "react";
import TrainingProgramComponent from "./TrainingProgramComponent";
import { TrainingIntensity, TrainingProgram } from "../Models/TrainingProgram";

const TrainingPrograms = () => {
  return (
    <StyleBox>
      <Typography sx={shortMessageStyle} variant="subtitle1" color="#8b5cf6">
        Träningsutbud
      </Typography>
      <SloganText variant="h1">Våra träningspass</SloganText>
      <SubSloganText variant="subtitle1" textAlign={"center"}>
        Välj bland olika träningsprogram framtagna av våra erfarna och
        certifierade tränare.
      </SubSloganText>

      <Grid container padding={{ xs: 1 }} spacing={3} marginTop={2}>
        {programs.map((p, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 5, lg: 3 }}>
            <TrainingProgramComponent trainingProgram={p} />
          </Grid>
        ))}
      </Grid>
    </StyleBox>
  );
};

const programs: TrainingProgram[] = [
  {
    title: "PT Team",
    description:
      "TEAM är vårt populära livsstilsprogram där du tränar 1–2 PT-grupppass/vecka med en engagerad coach.",
    duration: 30,
    headlineImg:
      "https://images.unsplash.com/photo-1607962837359-5e7e89f86776?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
    intensity: TrainingIntensity.Low,
  },
  {
    title: "PT 1on1",
    description:
      "TEAM är vårt populära livsstilsprogram där du tränar 1–2 PT-grupppass/vecka med en engagerad coach.",
    duration: 30,
    headlineImg:
      "https://halsoprofilen.com/wp-content/uploads/2022/04/11A9770.jpg",
    intensity: TrainingIntensity.Low,
  },
  {
    title: "Milon",
    description:
      "TEAM är vårt populära livsstilsprogram där du tränar 1–2 PT-grupppass/vecka med en engagerad coach.",
    duration: 30,
    headlineImg:
      "https://halsoprofilen.com/wp-content/uploads/2017/11/11_7292.jpg",
    intensity: TrainingIntensity.Low,
  },
  {
    title: "Gruppträning",
    description:
      "TEAM är vårt populära livsstilsprogram där du tränar 1–2 PT-grupppass/vecka med en engagerad coach.",
    duration: 30,
    headlineImg:
      "https://halsoprofilen.com/wp-content/uploads/2018/10/SPRINT.jpg",
    intensity: TrainingIntensity.Low,
  },
  {
    title: "Gym",
    description:
      "TEAM är vårt populära livsstilsprogram där du tränar 1–2 PT-grupppass/vecka med en engagerad coach.",
    duration: 30,
    headlineImg:
      "https://halsoprofilen.com/wp-content/uploads/2023/09/HPMalmo_personal-12-scaled.jpg",
    intensity: TrainingIntensity.Low,
  },
  {
    title: "Fysioterapi",
    description:
      "TEAM är vårt populära livsstilsprogram där du tränar 1–2 PT-grupppass/vecka med en engagerad coach.",
    duration: 30,
    headlineImg:
      "https://plus.unsplash.com/premium_photo-1661719096747-0501039e0ab9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
    intensity: TrainingIntensity.Low,
  },
  {
    title: "Massage",
    description: "https://godkrop.dk/wp-content/uploads/2023/11/massage.webp",
    duration: 30,
    headlineImg:
      "https://halsoprofilen.com/wp-content/uploads/2022/04/11A9770.jpg",
    intensity: TrainingIntensity.Low,
  },
];

const StyleBox = styled(Box)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    marginTop: "6rem",
  },
  marginTop: "2rem",
  marginBottom: "2rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
}));

const shortMessageStyle = {
  background: "#8a5cf61f",
  width: "fit-content",
  borderRadius: "40px",
  paddingX: 4,
  paddingY: 0.7,
  display: "flex",
  alignItems: "center",
  border: "solid 0.1em",
  borderColor: "#8a5cf688",
};

const SloganText = styled(Typography)(({ theme }) => ({
  color: "white",
  fontWeight: "400",
  marginTop: "1rem",
  [theme.breakpoints.up("lg")]: {
    fontSize: "4rem",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "2.5rem",
  },
}));

const SubSloganText = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    width: "50%",
  },
  [theme.breakpoints.down("sm")]: {},
  color: "#8888a0",
  marginTop: "0.5rem",
  padding: "0.5rem",
}));

export default TrainingPrograms;

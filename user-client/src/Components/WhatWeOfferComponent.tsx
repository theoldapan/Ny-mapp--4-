import { styled, SvgIconProps, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import React, { ElementType } from "react";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";

function WhatWeOfferComponent() {
  return (
    <StyleBox>
      <Typography sx={shortMessageStyle} variant="subtitle1" color="#00f0ff">
        Drag
      </Typography>
      <SloganText variant="h1">Varför välja oss</SloganText>
      <SubSloganText variant="subtitle1" textAlign={"center"}>
        Vi erbjuder något för alla oavsett om du är nybörjare eller erfaren.
        Våra kunniga tränare finns här för att guida dig mot dina hälsomål. I en
        trivsam och exklusiv miljö har du tillgång till gym, gruppträning och
        unika träningskoncept.
      </SubSloganText>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 2, sm: 3, md: 4 }}
        paddingX={3}
        marginTop={"3rem"}
      >
        {whatWeOffer.map((offer, index) => {
          const Icon = offer.icon;
          return (
            <OfferStyledBox key={index}>
              <IconStyledBox>
                <Icon sx={{ color: "white", fontSize: "2.5rem" }} />
              </IconStyledBox>
              <Typography
                variant="h6"
                color="white"
                textTransform={"capitalize"}
              >
                {offer.title}
              </Typography>
              <Typography variant="subtitle1" color="#8888a0">
                {offer.description}
              </Typography>
            </OfferStyledBox>
          );
        })}
      </Stack>
    </StyleBox>
  );
}

export default WhatWeOfferComponent;

const shortMessageStyle = {
  background: "#00eeff27",
  width: "fit-content",
  borderRadius: "40px",
  paddingX: 4,
  paddingY: 0.7,
  display: "flex",
  alignItems: "center",
  border: "solid 0.1em",
  borderColor: "#00eeff86",
};

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

const OfferStyledBox = styled(Box)(({ theme }) => ({
  background: "#12121a",
  borderRadius: "14px",
  padding: 15,
  border: "solid 0.01rem #f0f0f54b",
}));

const IconStyledBox = styled(Box)(({ theme }) => ({
  height: "3.2rem",
  width: "3.2rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  background:
    "linear-gradient(120deg,rgba(0, 240, 255, 1) 1%, rgba(139, 92, 246, 1) 80%);",
  borderRadius: "1rem",
  marginBottom: 15,
}));

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

type MaterialIcon = ElementType<SvgIconProps>;

type Offer = {
  icon: MaterialIcon;
  title: string;
  description: string;
};

const whatWeOffer: Offer[] = [
  {
    icon: VolunteerActivismIcon,
    title: "Stödjande gemenskap",
    description:
      "Träna i en välkomnande miljö med andra som värdesätter hälsa, rörelse och balans. Delta i gruppklasser, hälsoevenemang eller bara njut av sällskapet.",
  },
  {
    icon: HealthAndSafetyIcon,
    title: "Hälsofokuserade resultat",
    description:
      "Våra program är utformade för att förbättra rörlighet, styrka, balans och allmänt välbefinnande – vilket hjälper dig att hålla dig självständig, pigg och frisk hela livet.",
  },
  {
    icon: PeopleOutlinedIcon,
    title: "Stödjande gemenskap",
    description:
      "Träna i en välkomnande miljö med andra som värdesätter hälsa, rörelse och balans. Delta i gruppklasser, hälsoevenemang eller bara njut av sällskapet.",
  },
  {
    icon: AccessibilityNewIcon,
    title: "Personlig träning för alla kroppar",
    description:
      "Få anpassade träningsplaner utformade för dina behov, mål och konditionsnivå – oavsett om du håller dig aktiv, bygger styrka eller hanterar hälsoproblem.",
  },
];

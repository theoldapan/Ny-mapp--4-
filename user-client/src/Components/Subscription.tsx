import { Box, styled, Typography } from "@mui/material";
import React from "react";
import { SubscriptionPlan } from "../Models/SubscriptionPlan";
import CheckIcon from "@mui/icons-material/Check";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface Props {
  subscription: SubscriptionPlan;
  selectSub?: (subscription: SubscriptionPlan) => void;
}

function Subscription({ subscription, selectSub }: Props) {
  return (
    <RootBox onClick={() => selectSub?.(subscription)}>
      <Typography variant="h5" color="white">
        {subscription.title}
      </Typography>
      <Typography
        fontWeight={100}
        color="#8888a0"
        variant="body1"
        marginTop={2}
      >
        {subscription.service}
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "baseline",
          marginTop: 1,
          marginBottom: 1,
        }}
      >
        <PriceText> {subscription.price} kr </PriceText>
        <Typography
          fontWeight={100}
          marginLeft={1}
          color="#8888a0"
          variant="subtitle1"
        >
          /månad
        </Typography>
      </Box>
      <Box sx={{ display: "flex" }}>
        <CheckIcon
          sx={{ fill: "#00f0ff", fontSize: "1.2rem", marginRight: 1 }}
        />
        <Typography color="white" variant="body2">
          Kaffe
        </Typography>
      </Box>
      <Box sx={{ display: "flex" }}>
        <CheckIcon
          sx={{ fill: "#00f0ff", fontSize: "1.2rem", marginRight: 1 }}
        />
        <Typography color="white" variant="body2">
          Träna på alla våra anläggningar
        </Typography>
      </Box>
      <Box sx={{ display: "flex" }}>
        <CheckIcon
          sx={{ fill: "#00f0ff", fontSize: "1.2rem", marginRight: 1 }}
        />
        <Typography color="white" variant="body2">
          Personlig hälsoplan
        </Typography>
      </Box>
      <Box sx={{ display: "flex" }}>
        <CheckIcon
          sx={{ fill: "#00f0ff", fontSize: "1.2rem", marginRight: 1 }}
        />
        <Typography color="white" variant="body2">
          Gym introduktion
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          marginTop: "auto",
          justifySelf: "flex-start",
          alignSelf: "baseline",
        }}
      >
        <Typography color="#00f0ff" variant="body2" marginRight={1}>
          Välj abonnemang
        </Typography>
        <ArrowForwardIcon
          sx={{ fill: "#00f0ff", fontSize: "1.2rem", marginRight: 1 }}
        />
      </Box>
    </RootBox>
  );
}

const RootBox = styled(Box)(({ theme }) => ({
  borderRadius: 15,
  padding: 20,
  marginTop: 5,
  border: "1px solid #8080805c",
  backgroundColor: "#12121a",
  width: 250,
  height: 270,
  display: "flex",
  flexDirection: "column",
  "&:hover": {
    border: "1px solid #00f0ff",
    cursor: "pointer",
    transform: "scale(1.03)",
    boxShadow: "0 0 15px #00eeff8c",
  },
}));

const PriceText = styled(Typography)(({ theme }) => ({
  fontWeight: "600",
  fontSize: "2rem",
  background: "linear-gradient(to right, #00f0ff , #8b5cf6ff 2rem)",
  backgroundClip: "text",
  color: "transparent",
}));

export default Subscription;

import { Box, styled, Typography } from "@mui/material";
import pngLogo from "../resources/logo.png";
import { useEffect, useState } from "react";
import Subscription from "./Subscription";
import { SubscriptionPlan } from "../Models/SubscriptionPlan";

type Props = {
  select?: (subscription: SubscriptionPlan) => void;
};

function Subscriptions({ select }: Props) {
  const [subscriptions, setSubscriptions] = useState<SubscriptionPlan[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("http://localhost:8080/api/subscriptions", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const json = await res.json();
        setSubscriptions(json);
      } catch (err) {}
    }

    fetchData();
  }, []);

  return (
    <RootBox sx={{ justifyItems: "center" }}>
      <Box sx={iconStyles}>
        <img src={pngLogo} alt="logo" style={imgStyle} />
      </Box>
      <Typography color="white" fontWeight={100} variant="h1" marginTop={2}>
        Välj din plan
      </Typography>
      <Typography
        fontWeight={100}
        color="#8888a0"
        variant="body1"
        marginTop={2}
      >
        Välj den perfekta träningsplanen för att starta din resa
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          width: "100%",
          marginTop: 3,
        }}
      >
        {subscriptions.map((sub) => (
          <Subscription selectSub={select} key={sub.id} subscription={sub} />
        ))}
      </Box>
    </RootBox>
  );
}

const iconStyles = {
  height: "40px",
  width: "50px",
  padding: "0.8rem",
  marginX: 2,
  background:
    "linear-gradient(120deg,rgba(0, 240, 255, 1) 1%, rgba(139, 92, 246, 1) 80%);",
  borderRadius: 2,
  fill: "white",
};
const imgStyle = {
  height: "100%",
  width: "100%",
  transform: "scale(1.2)",
  transformOrigin: "center",
};

const RootBox = styled(Box)(({ theme }) => ({
  borderRadius: 15,
  padding: 10,
  marginTop: 30,
  border: "1px solid #8080805c",
  backgroundColor: "#0a0a0fb0",
  width: "50%",
  paddingBottom: 30,
  marginBottom: 150,
}));

export default Subscriptions;

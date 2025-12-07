import {
  Box,
  Step,
  StepConnector,
  StepLabel,
  Stepper,
  Typography,
  stepConnectorClasses,
  styled,
} from "@mui/material";
import React, { useState } from "react";
import RegisterForm from "../Components/RegisterForm";
import Subscriptions from "../Components/Subscriptions";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useNavigate } from "react-router-dom";
import { SubscriptionPlan } from "../Models/SubscriptionPlan";

const steps = ["", ""];

const RegisterPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());
  const [subscription, setSubscription] = useState<SubscriptionPlan>();

  const navigate = useNavigate();
  const handelSubscriptionSelect = (subscription: SubscriptionPlan) => {
    setSubscription(subscription);
    handleNext();
  };
  const handleNext = () => {
    let newSkipped = skipped;

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => {
      let nextStep = prevActiveStep - 1;
      if (nextStep < 0) {
        navigate("/");
        return 0;
      }
      return nextStep;
    });
  };

  const stepComponents = [
    <Subscriptions select={handelSubscriptionSelect} />,
    <RegisterForm selectedSubscription={subscription} />,
  ];

  return (
    <Box
      sx={{
        paddingTop: 10,
        background:
          " radial-gradient(circle,rgba(139, 92, 246, 1) 9%, rgba(41, 30, 71, 1) 42%, rgba(10, 10, 15, 1) 93%);",
      }}
    >
      <Box
        paddingLeft={10}
        display={"flex"}
        sx={{
          display: "flex",
          alignContent: "center",
          alignItems: "center",
          width: "fit-content",
          "&:hover": {
            cursor: "pointer",
          },
        }}
        onClick={handleBack}
      >
        <ArrowBackIosIcon sx={{ color: "#8888a0" }} />
        <Typography color="#8888a0" variant="h5">
          {activeStep === steps.length - 1 ? "Tillbaka till planerna" : "Hem"}
        </Typography>
      </Box>
      <Stepper
        activeStep={activeStep}
        sx={{ width: 200, marginRight: 2, marginLeft: "auto" }}
        connector={<StyledStepConnector />}
      >
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};

          return (
            <Step key={index} {...stepProps}>
              <StepLabel
                slotProps={{
                  stepIcon: {
                    sx: {
                      color: "#00eeff1e",
                      border: "2px solid gray",
                      borderRadius: 5,
                      fontSize: 28,
                      "& text": { fill: "gray" },
                      "&.Mui-active": {
                        color: "#00eeff42",
                        borderColor: "#00f0ff",
                        "& text": { fill: "#00f0ff" },
                      },
                      "&.Mui-completed": {
                        color: "#00eeff91",
                        borderColor: "#00f0ff",
                      },
                    },
                  },
                }}
                {...labelProps}
              >
                {label}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        {stepComponents[activeStep]}
      </Box>
    </Box>
  );
};

const StyledStepConnector = styled(StepConnector)(({ theme }) => ({
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: "#00f0ff",
    borderTopWidth: 3,
  },
}));

export default RegisterPage;

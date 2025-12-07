import { Button, styled, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { TrainingProgram } from "../Models/TrainingProgram";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MovingIcon from "@mui/icons-material/Moving";

type Props = {
  trainingProgram: TrainingProgram;
};

function TrainingProgramComponent({ trainingProgram }: Props) {
  return (
    <StyleBox>
      <Box
        sx={{
          height: "50%",
        }}
      >
        <img
          style={{
            height: "100%",
            width: "100%",
            borderTopLeftRadius: "14px",
            borderTopRightRadius: "14px",
          }}
          alt="program img"
          src={trainingProgram.headlineImg}
        />
      </Box>
      <Box sx={{ padding: 1, marginX: 2 }}>
        <Typography variant="h5" color="white" textTransform={"capitalize"}>
          {trainingProgram.title}
        </Typography>
        <Typography
          variant="subtitle2"
          color="#8888a0"
          paddingTop={1}
          height="40%"
        >
          {trainingProgram.description}
        </Typography>
        <Box display="flex" flexDirection="row" paddingTop={1}>
          <Box display="flex" alignItems="center">
            <AccessTimeIcon color="secondary" />
            <Typography variant="subtitle1" color="#8888a0" paddingLeft={1}>
              {trainingProgram.duration} min
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" marginLeft={2}>
            <MovingIcon color="secondary" />
            <Typography
              variant="subtitle1"
              color="#8888a0"
              textTransform={"capitalize"}
              paddingLeft={1}
            >
              {trainingProgram.intensity}
            </Typography>
          </Box>
        </Box>
        <Button sx={{ paddingY: "0.2rem", marginTop: 2 }} style={bookButton}>
          Boka träningspass
        </Button>
      </Box>
    </StyleBox>
  );
}

const StyleBox = styled(Box)(({ theme }) => ({
  background: "#12121a",
  width: "100%",
  borderRadius: "14px",
  height: "450px",
  border: "solid 0.01rem #f0f0f54b",
  display: "flex",
  flexDirection: "column",
}));

const bookButton = {
  background: "#00eeff27",
  border: "solid 0.1em",
  borderColor: "#00eeff86",
  color: "#00f0ff",
  borderRadius: "10px",
  width: "100%",
};

export default TrainingProgramComponent;

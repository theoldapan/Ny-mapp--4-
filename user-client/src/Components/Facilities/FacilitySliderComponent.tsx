import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import React from "react";
import Facility from "../../Models/Facilities/Facility";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import Address from "../../Models/Address";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";

const cardContentStyle = {
  background: "white",
  color: "#000000",
};

const imgStyles = {
  height: "140px",
  objectFit: "cover",
  objectPosition: "top",
};

type Props = {
  facility: Facility;
};

function FacilitySliderComponent({ facility }: Props) {
  const address = (address: Address) => {
    return (
      <Box sx={{ display: "flex", justifyContent: "left" }} mt={2}>
        <LocationOnOutlinedIcon sx={{ marginRight: 2 }} fontSize="small" />
        <Typography variant="body2">
          {facility.address.street} {facility.address.postalCode}{" "}
          {facility.address.city}
        </Typography>
      </Box>
    );
  };

  const hours = (hour: string) => {
    return (
      <Box sx={{ display: "flex", justifyContent: "left" }} mt={1} key={hour}>
        <AccessTimeOutlinedIcon sx={{ marginRight: 2 }} fontSize="small" />
        <Typography variant="body2">{hour}</Typography>
      </Box>
    );
  };

  return (
    <Card style={{ background: "#0a0a0f" }}>
      <CardActionArea sx={{ height: "20rem" }}>
        <CardMedia component="img" image={facility.images[1]} sx={imgStyles} />
        <CardContent style={cardContentStyle}>
          <Typography gutterBottom variant="h5" component="div">
            {facility.address.city}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {facility.description}
          </Typography>
          {address(facility.address)}
          {facility.contactInformation.openHours.map((e) => hours(e))}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default FacilitySliderComponent;

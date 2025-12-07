import React, { useEffect, useState } from "react";
import Facility from "../Models/Facilities/Facility";
import Hero from "../Components/Hero/Hero";
import { Box } from "@mui/material";

import WhatWeOfferComponent from "../Components/WhatWeOfferComponent";
import TrainingPrograms from "../Components/TrainingPrograms";
import { fetchRequest } from "../Services/fetchService";

function HomePage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);

  useEffect(() => {
    async function getDat() {
      try {
        const res = await fetchRequest<Facility[]>("/facilities/all");
        if (res !== null) {
          setFacilities(res);
        }
      } catch (error: any) {
        console.error("Fetch error:", error);
      }
    }
    getDat();
    console.log(facilities);
    // eslint-disable-next-line
  }, []);

  return (
    <Box>
      <Hero />
      <WhatWeOfferComponent />
      <TrainingPrograms />
    </Box>
  );
}

export default HomePage;

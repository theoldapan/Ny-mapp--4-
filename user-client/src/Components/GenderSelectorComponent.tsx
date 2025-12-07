import styled from "@emotion/styled";
import {
  FormControl,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import React from "react";
import { UseFormRegister } from "react-hook-form";
import { CreateMemberRequest } from "../Models/CreateMemberRequest";
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = ["Man", "Kvinna"];
type Props = {
  register: UseFormRegister<CreateMemberRequest>;
};

function GenderSelectorComponent({ register }: Props) {
  const [personName, setPersonName] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <FormControl fullWidth sx={{ marginTop: 2 }}>
      <Typography variant="subtitle2" fontWeight={600} color="white">
        Kön
      </Typography>
      <Select
        required
        displayEmpty
        {...register("gender")}
        value={personName}
        onChange={handleChange}
        input={<StyledStyledInput />}
        renderValue={(selected) => {
          if (selected.length === 0) {
            return <em>Välj kön</em>;
          }

          return selected.join(", ");
        }}
        MenuProps={MenuProps}
        inputProps={{ "aria-label": "Without label" }}
      >
        <MenuItem disabled value="">
          <em>Välj kön</em>
        </MenuItem>
        {names.map((name) => (
          <MenuItem key={name} value={name}>
            {name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

let StyledStyledInput = styled(OutlinedInput)(({ theme }) => ({
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#f0f0f54b",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#f0f0f54b",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#f0f0f54b",
    borderWidth: "2px",
  },
  backgroundColor: "#1f1f2e",
}));

export default GenderSelectorComponent;

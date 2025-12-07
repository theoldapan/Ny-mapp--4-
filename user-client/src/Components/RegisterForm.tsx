import {
  Backdrop,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  OutlinedInput,
  styled,
  Typography,
} from "@mui/material";
import React from "react";
import pngLogo from "../resources/logo.png";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import GenderSelectorComponent from "../Components/GenderSelectorComponent";
import { SubscriptionPlan } from "../Models/SubscriptionPlan";
import { CreateMemberRequest } from "../Models/CreateMemberRequest";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

type Props = {
  selectedSubscription?: SubscriptionPlan;
};

const RegisterForm = ({ selectedSubscription }: Props) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateMemberRequest>();
  const navigate = useNavigate();
  const onSubmit: SubmitHandler<CreateMemberRequest> = async (data) => {
    setOpen(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      data.subscriptionID = selectedSubscription?.id.toString()!;
      data.gender = data.gender[0];
      const response = await fetch("http://localhost:8080/api/members", {
        method: "POST",
        headers: {
          accept: "text/plain",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response;
      if (responseData.ok) {
        setOpen(false);
        navigate("/login");
      } else {
        setOpen(false);
      }
    } catch (error) {
      setOpen(false);
      console.error("Error:", error);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <StyledBox>
        <Box sx={boxStyle}>
          <Box sx={iconStyles}>
            <img src={pngLogo} alt="logo" style={imgStyle} />
          </Box>
          <Typography variant="h6" color="white">
            Skapa konto
          </Typography>
          <Typography variant="subtitle2" fontSize={18} color="#f0f0f54b">
            Börja din transformationsresa idag
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "80%",
              border: "0.1rem solid #00f0ff",
              backgroundColor: "#00eeff11",
              borderRadius: 4,
              padding: 3,
              marginTop: 1,
            }}
          >
            <Box>
              <Typography variant="subtitle2" color="#7d7d80ff">
                Vald plan
              </Typography>
              <Typography variant="body1" fontWeight={100} color="#00f0ff">
                {selectedSubscription?.title}
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="subtitle1"
                fontSize={20}
                fontWeight={600}
                sx={{
                  background:
                    "linear-gradient(to right, #00f0ff , #8b5cf6ff 2rem)",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {selectedSubscription?.price} kr
              </Typography>
              <Typography variant="subtitle2" color="#f0f0f54b">
                /månad
              </Typography>
            </Box>
          </Box>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box display={"flex"}>
            <FormControl sx={{ marginRight: 2, width: "50%" }}>
              <Typography variant="subtitle2" fontWeight={600} color="white">
                Förnamn
              </Typography>
              <StyledStyledInput
                required
                error={errors.firstName ? true : false}
                {...register("firstName", {
                  required: "Förnamn krävs",
                  minLength: 3,
                })}
              />
              <FormHelperText error>{errors.firstName?.message}</FormHelperText>
            </FormControl>

            <FormControl sx={{ width: "50%" }}>
              <Typography variant="subtitle2" fontWeight={600} color="white">
                Efternamn
              </Typography>
              <StyledStyledInput
                required
                error={errors.lastName ? true : false}
                {...register("lastName", {
                  required: "Efternamn krävs",
                  minLength: 3,
                })}
              />
              <FormHelperText error>{errors.lastName?.message}</FormHelperText>
            </FormControl>
          </Box>
          <FormControl fullWidth sx={{ marginTop: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} color="white">
              E-postadress
            </Typography>
            <StyledStyledInput
              error={errors.email ? true : false}
              required
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email format",
                },
              })}
              fullWidth
            />
            <FormHelperText error>{errors.email?.message}</FormHelperText>
          </FormControl>

          <Box display={"flex"}>
            <FormControl sx={{ marginRight: 2, width: "50%" }}>
              <Typography variant="subtitle2" fontWeight={600} color="white">
                Stad
              </Typography>
              <StyledStyledInput
                required
                error={errors.address?.city ? true : false}
                {...register("address.city", {
                  required: "Stad krävs",
                  minLength: 3,
                })}
              />
              <FormHelperText error>
                {errors.address?.city?.message}
              </FormHelperText>
            </FormControl>

            <FormControl sx={{ width: "50%" }}>
              <Typography variant="subtitle2" fontWeight={600} color="white">
                Postnummer
              </Typography>
              <StyledStyledInput
                required
                error={errors.address?.postalCode ? true : false}
                {...register("address.postalCode", {
                  required: "Efternamn krävs",
                  minLength: 3,
                })}
              />
              <FormHelperText error>
                {errors.address?.postalCode?.message}
              </FormHelperText>
            </FormControl>
          </Box>

          <FormControl fullWidth sx={{ marginTop: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} color="white">
              Gatuadress
            </Typography>
            <StyledStyledInput
              error={errors.address?.street ? true : false}
              required
              {...register("address.street", {
                required: "Required",
              })}
              fullWidth
            />
            <FormHelperText error>
              {errors.address?.street?.message}
            </FormHelperText>
          </FormControl>

          <FormControl fullWidth sx={{ marginTop: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} color="white">
              Lösenord
            </Typography>
            <StyledStyledInput
              error={errors.password ? true : false}
              required
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 12,
                  message: "Minim required length is 12",
                },
              })}
              fullWidth
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword
                        ? "hide the password"
                        : "display the password"
                    }
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                  >
                    {showPassword ? (
                      <VisibilityOff sx={{ color: "white" }} />
                    ) : (
                      <Visibility sx={{ color: "white" }} />
                    )}
                  </IconButton>
                </InputAdornment>
              }
            />
            <FormHelperText error>{errors.password?.message}</FormHelperText>
          </FormControl>

          <FormControl fullWidth sx={{ marginTop: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} color="white">
              Bekräfta lösenord
            </Typography>
            <StyledStyledInput
              fullWidth
              required
              type="password"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword
                        ? "hide the password"
                        : "display the password"
                    }
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                  >
                    {showPassword ? (
                      <VisibilityOff sx={{ color: "white" }} />
                    ) : (
                      <Visibility sx={{ color: "white" }} />
                    )}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>

          <FormControl fullWidth sx={{ marginTop: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} color="white">
              Mobil
            </Typography>
            <StyledStyledInput
              required
              {...register("phoneNr", { required: true })}
              placeholder="+46 7X XXX XX XX"
              fullWidth
            />
          </FormControl>
          <FormControl fullWidth sx={{ marginTop: 2 }}>
            <Typography variant="subtitle2" fontWeight={600} color="white">
              Personnummer
            </Typography>
            <StyledStyledInput
              required
              {...register("socialSecurityNumber", { required: true })}
              fullWidth
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: 10,
                marginBottom: 15,
                width: "100%",
              }}
            >
              <Checkbox />
              <Typography fontSize={"0.8rem"} fontWeight={600}>
                Jag har inget svenskt personnummer
              </Typography>
            </div>
          </FormControl>
          <GenderSelectorComponent register={register} />
          <FormControl
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: 2,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 10,
                marginBottom: 15,
              }}
            >
              <Checkbox required />
              <Typography fontSize={"0.8rem"} fontWeight={600}>
                Jag godkänner
                <span style={{ color: "#7c3aed" }}> Användarvillkoren</span> och
                <span style={{ color: "#7c3aed" }}> Sekretesspolicyn</span>
              </Typography>
            </div>

            <StyledRegisterButton disabled={isSubmitting} type="submit">
              Skapa konto
            </StyledRegisterButton>
            <Typography fontSize={"0.8rem"} fontWeight={600} marginTop={3}>
              Har du redan ett konto?
              <span style={{ color: "#7c3aed" }}> Logga in</span> och
            </Typography>
          </FormControl>
        </form>
      </StyledBox>
    </Box>
  );
};

const StyledRegisterButton = styled(Button)(({ theme }) => ({
  background:
    "linear-gradient(120deg,rgba(0, 240, 255, 1) 10%, rgba(139, 92, 246, 1) 65%);",
  color: "#0a0a0f",
  fontWeight: "600",
  borderRadius: "9px",
  height: 50,
  width: "85%",
  [theme.breakpoints.up("xs")]: {
    marginLeft: theme.spacing(2),
    paddingTop: 3,
    paddingBottom: 3,
  },
  "&:hover": {
    background: "#00eeffce",
  },
  transition: "background 0.8s ease-in-out",
  boxShadow: "0 0 8px #00eeff8c",
}));

const boxStyle = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginBottom: 3,
};

const imgStyle = {
  height: "100%",
  width: "100%",
  transform: "scale(1.2)",
  transformOrigin: "center",
};

const iconStyles = {
  height: 30,
  width: 36,
  padding: 2,
  marginBottom: 1,
  background:
    "linear-gradient(120deg,rgba(0, 240, 255, 1) 1%, rgba(139, 92, 246, 1) 80%);",
  borderRadius: 2,
  fill: "white",
  boxShadow: "6px 5px 17px -12px rgba(0, 240, 255, 1);",
};

const StyledBox = styled(Box)(({ theme }) => ({
  width: "85%",
  minHeight: "80vh",
  height: "fit-content",
  borderRadius: "14px",
  border: "solid 0.01rem #f0f0f54b",
  padding: 15,
  [theme.breakpoints.up("sm")]: {
    width: "70%",
  },
  [theme.breakpoints.up("md")]: {
    width: "35%",
  },
  [theme.breakpoints.up("lg")]: {
    width: "30%",
  },
  alignItems: "center",
  backgroundColor: "#171724ff",
}));

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

export default RegisterForm;

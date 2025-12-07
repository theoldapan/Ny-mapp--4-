import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Typography,
  styled,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link } from "react-router-dom";
import logo from "../resources/logo.png";
import { useAuth } from "../context/useAuth";

const API_URL = "http://localhost:8080";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleTogglePassword = () => setShowPassword((prev) => !prev);
  const handleMouseDownPassword = (e: React.MouseEvent<HTMLButtonElement>) =>
    e.preventDefault();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const statusCode = await login(email, password);
    if (statusCode === 200) {
      navigate("/");
    } else {
      setError("Login fail !");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#0a0a0f",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        pt: { xs: 6, sm: 10 },
      }}
    >
      <StyledContainer>
        {/* Header with logo */}
        <Box sx={headerStyle}>
          <Box sx={logoWrapper}>
            <img src={logo} alt="Logo" style={logoStyle} />
          </Box>
          <Typography variant="h4" color="white" fontWeight={600}>
            Welcome Back
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ color: "#f0f0f54b", fontSize: 20, mt: 1 }}
          >
            Sign in to continue your fitness journey
          </Typography>
        </Box>

        {/* Login Form */}
        {/* onSubmit={handleLogin} */}
        <Box component="form" onSubmit={handleLogin} sx={{ mt: 5 }}>
          {/* Email Field */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <Typography
              variant="subtitle2"
              fontWeight={600}
              color="white"
              gutterBottom
            >
              Email Address
            </Typography>
            {/* value + onChange + type="email" */}
            <StyledInput
              placeholder="your.email@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormControl>

          {/* Password Field */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <Typography
              variant="subtitle2"
              fontWeight={600}
              color="white"
              gutterBottom
            >
              Password
            </Typography>
            {/* value + onChange */}
            <StyledInput
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleTogglePassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    sx={{ color: "white" }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>

          {/* Remember me + Forgot password */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Checkbox
                sx={{
                  color: "#f0f0f54b",
                  "&.Mui-checked": { color: "#00f0ff" },
                }}
              />
              <Typography fontSize="0.9rem" color="white">
                Remember me
              </Typography>
            </Box>

            <Typography
              component={Link}
              to="/forgot-password"
              fontSize="0.9rem"
              sx={{ color: "#7c3aed", textDecoration: "none" }}
            >
              Forgot Password?
            </Typography>
          </Box>

          {/* Error message */}
          {error && (
            <Typography
              color="#ff6b6b"
              textAlign="center"
              mb={2}
              fontWeight={500}
            >
              {error}
            </Typography>
          )}

          {/* Sign In Button */}
          <StyledSignInButton type="submit" fullWidth>
            Sign In
          </StyledSignInButton>

          {/* Sign up link */}
          <Typography
            textAlign="center"
            color="#f0f0f54b"
            fontSize="0.95rem"
            mt={4}
          >
            Don't have an account?{" "}
            <Link
              to="/register"
              style={{
                color: "#7c3aed",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Sign up now
            </Link>
          </Typography>
        </Box>
      </StyledContainer>
    </Box>
  );
};

/* ──────────────────────────────
   Styling – identical to your design
   ────────────────────────────── */
const StyledContainer = styled(Box)(({ theme }) => ({
  width: "90%",
  maxWidth: 480,
  minHeight: "80vh",
  background: "#0a0a0f",
  border: "0.01rem solid #f0f0f54b",
  borderRadius: "14px",
  padding: 32,
  [theme.breakpoints.up("sm")]: { width: "70%" },
  [theme.breakpoints.up("md")]: { width: "40%" },
  [theme.breakpoints.up("lg")]: { width: "30%" },
}));

const headerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  mb: 3,
};

const logoWrapper = {
  height: 50,
  width: 56,
  padding: 8,
  mb: 3,
  background:
    "linear-gradient(120deg, rgba(0, 240, 255, 1) 1%, rgba(139, 92, 246, 1) 80%)",
  borderRadius: 2,
  boxShadow: "6px 5px 17px -12px rgba(0, 240, 255, 1)",
};

const logoStyle: React.CSSProperties = {
  height: "100%",
  width: "100%",
  objectFit: "contain",
  transform: "scale(1.3)",
};

const StyledInput = styled(OutlinedInput)({
  backgroundColor: "#1f1f2e",
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#f0f0f54b" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#f0f0f54b" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#00f0ff",
    borderWidth: 2,
  },
  "& input::placeholder": { color: "#ffffff80", opacity: 1 },
});

const StyledSignInButton = styled(Button)(({ theme }) => ({
  background: "#00f0ff",
  color: "#0a0a0f",
  fontWeight: 600,
  fontSize: "1.1rem",
  borderRadius: "12px",
  padding: theme.spacing(1.8, 0),
  textTransform: "none",
  "&:hover": { background: "#00eeffce" },
}));

export default LoginPage;

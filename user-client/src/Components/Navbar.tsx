import {
  AppBar,
  Box,
  Button,
  MenuItem,
  styled,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import theme from "../theme";
import MenuIcon from "@mui/icons-material/Menu";
import pngLogo from "../resources/logo.png";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/useAuth";
import React from "react";

const StyledLoginButton = styled(Button)<{
  component?: React.ElementType;
  to?: string;
}>(({ theme }) => ({
  background: "transparent",
  color: "white",
}));

const StyledSignUpButton = styled(Button)<{
  component?: React.ElementType;
  to?: string;
}>(({ theme }) => ({
  background: "#00f0ff",
  color: "#0a0a0f",
  fontWeight: "600",
  borderRadius: "9px",
  [theme.breakpoints.up("xs")]: {
    marginLeft: theme.spacing(2),
    paddingTop: 3,
    paddingBottom: 3,
  },
  "&:hover": {
    background: "#00eeffce",
  },
}));

const iconStyles = {
  height: "20px",
  width: "26px",
  padding: 1,
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

const appBarStyle = {
  backgroundColor: "#0a0a0fc5",
  backdropFilter: "blur(10px)",
};

const appBarStyleTransparent = {
  background: "transparent",
};

const links: Page[] = [
  { label: "Hem", to: "/" },
  { label: "Boka pass", to: "book-class" },
  { label: "Platser", to: "locations" },
  { label: "Om oss", to: "about" },
  { label: "Kontakat", to: "contact" },
];

type Page = {
  label: string;
  to: string;
};

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const Logout = async () => {
    const statusCode = await logout();
    if (statusCode === 200) {
      navigate("/");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 17);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AppBar
      position="fixed"
      sx={isScrolled ? appBarStyle : appBarStyleTransparent}
    >
      <Toolbar>
        <Box sx={iconStyles}>
          <img src={pngLogo} alt="logo" style={imgStyle} />
        </Box>
        <Typography
          variant="h5"
          fontSize={25}
          sx={{
            flexGrow: { md: 0, lg: 1 },
            textTransform: "uppercase",
            color: "#f0f0f5da",
            fontSize: { xs: 19, md: 20, lg: 25 },
          }}
        >
          Hälsoprofilen
        </Typography>
        {isMobile ? (
          <Box sx={{ marginLeft: "auto", marginRight: 2 }}>
            <MenuIcon />
          </Box>
        ) : (
          <>
            <Box sx={{ flexGrow: 1, display: "flex" }}>
              {links.map((link) => (
                <MenuItem
                  key={link.label}
                  disableRipple
                  sx={{ padding: 0, minWidth: "auto" }}
                >
                  <div
                    style={{
                      position: "relative",
                      display: "inline-block",
                      paddingBottom: 6,
                    }}
                  >
                    <NavLink
                      to={link.to}
                      end
                      style={{ textDecoration: "none" }}
                    >
                      {({ isActive }: { isActive: boolean }) => (
                        <div
                          style={{
                            cursor: "pointer",
                            textDecoration: "none",
                            textAlign: "center",
                            color: isActive ? "#00f0ff" : "#f0f0f5da",
                            transition: "color 0.2s ease",
                            padding: "8px 12px",
                            display: "inline-block",
                          }}
                        >
                          {link.label}
                          {isActive && (
                            <motion.div
                              layoutId="nav-underline"
                              style={{
                                position: "absolute",
                                left: 0,
                                right: 0,
                                bottom: 0,
                                height: 3,
                                borderRadius: 999,
                                background: "#00f0ff",
                              }}
                              transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 30,
                              }}
                            />
                          )}
                        </div>
                      )}
                    </NavLink>
                  </div>
                </MenuItem>
              ))}
            </Box>
            {user ? (
              <StyledSignUpButton
                component={NavLink}
                onClick={() => Logout()}
                size="medium"
                variant="contained"
              >
                Logga ut
              </StyledSignUpButton>
            ) : (
              <React.Fragment>
                <StyledLoginButton component={NavLink} to="/login">
                  Logga in
                </StyledLoginButton>
                <StyledSignUpButton
                  component={NavLink}
                  to="/register"
                  size="medium"
                  variant="contained"
                >
                  Börja här
                </StyledSignUpButton>
              </React.Fragment>
            )}
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;

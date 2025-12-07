import { createTheme } from "@mui/material/styles";

// Define the custom black, gray, and white theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#000000", // Black (Primary)
    },
    secondary: {
      main: "#424242", // Dark Gray (Secondary)
    },
    background: {
      default: "#F5F5F5", // Light Gray background
      paper: "#212121", // Dark Gray surface (for cards, modals, etc.)
    },
    text: {
      primary: "#FFFFFF", // White text on dark background
      secondary: "#717182", // Light Gray text for less emphasis
    },
    divider: "#BDBDBD", // Light Gray divider lines
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: "2rem",
    },
    h2: {
      fontWeight: 500,
      fontSize: "1.5rem",
    },
    body1: {
      fontSize: "1rem",
      color: "#FFFFFF", // White text for body content
    },
    button: {
      textTransform: "none", // Avoid capitalized button text
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: "#000000", // Black button background
          color: "#FFFFFF", // White text on buttons
          "&:hover": {
            backgroundColor: "#333333", // Dark gray on hover
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#212121", // Dark gray background for paper elements
          color: "#FFFFFF", // White text on dark paper
        },
      },
    },
  },
});

export default theme;

import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import {
  AppBar,
  Box,
  Container,
  CssBaseline,
  IconButton,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
  useMediaQuery,
} from "@mui/material";
import { FC, ReactNode, useMemo, useState } from "react";
import { useLanguage } from "../hooks/useLanguage";
import { LanguageSelector } from "./LanguageSelector";
import { NavMenu } from "./NavMenu";

interface LayoutProps {
  children: ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children }) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [darkMode, setDarkMode] = useState(prefersDarkMode);
  const { t, isRTL } = useLanguage();

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          primary: {
            main: "#2196f3",
          },
          secondary: {
            main: "#f50057",
          },
        },
        components: {
          MuiCard: {
            styleOverrides: {
              root: {
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                borderRadius: 8,
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                textTransform: "none",
              },
            },
          },
        },
        direction: isRTL ? "rtl" : "ltr",
      }),
    [darkMode, isRTL]
  );

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          width: "100%",
        }}
      >
        <AppBar position="static">
          <Toolbar
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row", md: "row" },
              gap: { xs: 2, sm: 2, md: 2 },
            }}
          >
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {t("appName")}
            </Typography>
            <NavMenu />
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LanguageSelector />
              <IconButton color="inherit" onClick={toggleDarkMode}>
                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        <Container
          maxWidth={false}
          sx={{
            mt: { xs: 2, sm: 3, md: 4 },
            mb: { xs: 2, sm: 3, md: 4 },
            flex: 1,
            display: "flex",
            flexDirection: "column",
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: { sm: "100%", md: "1200px" },
              mx: "auto",
            }}
          >
            {children}
          </Box>
        </Container>
        <Box
          component="footer"
          sx={{
            py: 3,
            bgcolor: "background.paper",
            borderTop: 1,
            borderColor: "divider",
          }}
        >
          <Container maxWidth={false}>
            <Typography variant="body2" color="text.secondary" align="center">
              {t("footer.rightsReserved", { year: new Date().getFullYear() })}
            </Typography>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

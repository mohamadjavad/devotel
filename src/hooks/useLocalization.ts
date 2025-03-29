import { createTheme, PaletteMode } from "@mui/material/styles";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import i18n, { isRTL } from "../i18n";

export const useLocalization = () => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<PaletteMode>("light");
  const [currentLang, setCurrentLang] = useState(i18n.language || "en");

  // Get the current language direction from the translation file
  const direction = useMemo(() => {
    return t("direction", {
      defaultValue: isRTL(currentLang) ? "rtl" : "ltr",
    }) as "ltr" | "rtl";
  }, [t, currentLang]);

  // Track language changes
  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      console.log(`useLocalization: Language changed to ${lng}`);
      setCurrentLang(lng);

      // Set the document direction and language
      document.documentElement.dir = i18n.dir(lng);
      document.documentElement.lang = lng;
    };

    i18n.on("languageChanged", handleLanguageChanged);

    return () => {
      i18n.off("languageChanged", handleLanguageChanged);
    };
  }, []);

  // Update the document direction and language attributes on init
  useEffect(() => {
    if (i18n.isInitialized) {
      // Set the document direction
      document.documentElement.dir = direction;
      // Set the document language
      document.documentElement.lang = i18n.language;
      console.log(
        `useLocalization: Initial setup - lang: ${i18n.language}, dir: ${direction}`
      );
    }
  }, [direction]);

  // Load stored theme preference
  useEffect(() => {
    const storedMode = localStorage.getItem("themeMode");
    if (storedMode === "dark" || storedMode === "light") {
      setMode(storedMode as PaletteMode);
    } else {
      // Check for system preference
      const prefersDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setMode(prefersDarkMode ? "dark" : "light");
    }
  }, []);

  // Create Material-UI theme with the correct direction and color scheme
  const theme = useMemo(() => {
    console.log(`Creating theme with direction: ${direction}, mode: ${mode}`);

    // Define font families for different languages
    const rtlFontFamily =
      currentLang === "fa"
        ? '"Vazirmatn", "Sahel", "IRANSans", "Tahoma", "Arial", sans-serif'
        : '"Amiri", "Scheherazade New", "Noto Sans Arabic", "Tahoma", "Arial", sans-serif';

    const ltrFontFamily = 'Roboto, "Helvetica Neue", Arial, sans-serif';

    const fontFamily = direction === "rtl" ? rtlFontFamily : ltrFontFamily;

    return createTheme({
      direction,
      palette: {
        mode,
        primary: {
          main: "#2196f3",
        },
        secondary: {
          main: "#f50057",
        },
      },
      typography: {
        fontFamily,
        // Apply font weights for better rendering
        h1: { fontWeight: direction === "rtl" ? 700 : 600 },
        h2: { fontWeight: direction === "rtl" ? 700 : 600 },
        h3: { fontWeight: direction === "rtl" ? 700 : 600 },
        h4: { fontWeight: direction === "rtl" ? 700 : 500 },
        h5: { fontWeight: direction === "rtl" ? 700 : 500 },
        h6: { fontWeight: direction === "rtl" ? 700 : 500 },
        subtitle1: { fontWeight: direction === "rtl" ? 600 : 400 },
        subtitle2: { fontWeight: direction === "rtl" ? 600 : 400 },
        body1: { fontWeight: direction === "rtl" ? 400 : 400 },
        body2: { fontWeight: direction === "rtl" ? 400 : 400 },
        button: { fontWeight: direction === "rtl" ? 500 : 500 },
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              direction,
              fontFamily,
            },
          },
        },
        // Apply font-family to all input components
        MuiInputBase: {
          styleOverrides: {
            root: {
              fontFamily,
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 8,
              textTransform: "none",
              fontFamily,
            },
          },
        },
        MuiTypography: {
          styleOverrides: {
            root: {
              fontFamily,
            },
          },
        },
        MuiFormLabel: {
          styleOverrides: {
            root: {
              fontFamily,
            },
          },
        },
        MuiInputLabel: {
          styleOverrides: {
            root: {
              fontFamily,
            },
          },
        },
        MuiMenuItem: {
          styleOverrides: {
            root: {
              fontFamily,
            },
          },
        },
        MuiListItemText: {
          styleOverrides: {
            root: {
              fontFamily,
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              borderRadius: 8,
              fontFamily,
            },
          },
        },
      },
    });
  }, [direction, mode, currentLang]);

  // Function to toggle between languages
  const toggleLanguage = () => {
    let newLanguage;
    switch (currentLang) {
      case "en":
        newLanguage = "ar";
        break;
      case "ar":
        newLanguage = "fa";
        break;
      default:
        newLanguage = "en";
    }

    console.log(
      `useLocalization: Toggling language from ${currentLang} to ${newLanguage}`
    );
    i18n.changeLanguage(newLanguage).then(() => {
      window.location.reload();
    });
  };

  // Function to toggle dark/light mode
  const toggleColorMode = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("themeMode", newMode);
  };

  return {
    direction,
    theme,
    toggleLanguage,
    currentLanguage: currentLang,
    colorMode: mode,
    toggleColorMode,
    t,
    i18n,
  };
};

export default useLocalization;

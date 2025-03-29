import LanguageIcon from "@mui/icons-material/Language";
import { Button, ButtonGroup, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import i18next from "../i18n";

const LanguageSwitcher: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language || "en");

  // Track language changes
  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      console.log(`Language changed event: ${lng}`);
      setCurrentLang(lng);
    };

    // Use the i18next instance directly from the import
    i18next.on("languageChanged", handleLanguageChanged);

    return () => {
      i18next.off("languageChanged", handleLanguageChanged);
    };
  }, []);

  const changeLanguage = (lng: string) => {
    console.log(`Attempting to change language to: ${lng}`);
    if (lng === currentLang) {
      console.log("Already using this language, skipping change");
      return;
    }

    try {
      // First set the document direction manually to avoid flicker
      document.documentElement.dir = lng === "fa" ? "rtl" : "ltr";
      document.documentElement.lang = lng;

      console.log("About to change language to:", lng);

      // Use the imported i18next instance directly
      i18next
        .changeLanguage(lng)
        .then(() => {
          console.log(`Language successfully changed to: ${lng}`);
        })
        .catch((err) => {
          console.error(`Error changing language: ${err}`);
        });
    } catch (error) {
      console.error(`Exception when changing language: ${error}`);
    }
  };

  return (
    <Tooltip title={t("common.changeLanguage", "Change language")}>
      <ButtonGroup
        variant="outlined"
        size="small"
        aria-label="language selector"
        sx={{ mx: 1 }}
      >
        <Button
          startIcon={<LanguageIcon />}
          onClick={() => changeLanguage("en")}
          variant={currentLang === "en" ? "contained" : "outlined"}
          color="inherit"
        >
          {t("language.en", "English")}
        </Button>
        <Button
          onClick={() => changeLanguage("fa")}
          variant={currentLang === "fa" ? "contained" : "outlined"}
          color="inherit"
        >
          {t("language.fa", "فارسی")}
        </Button>
      </ButtonGroup>
    </Tooltip>
  );
};

export default LanguageSwitcher;

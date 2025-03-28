import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";

export function useLanguage() {
  const { i18n, t } = useTranslation();

  // Set document direction based on language
  useEffect(() => {
    const dir = i18n.language === "fa" ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const changeLanguage = useCallback(
    (language: string) => {
      i18n.changeLanguage(language);
    },
    [i18n]
  );

  return {
    currentLanguage: i18n.language,
    changeLanguage,
    t,
    isRTL: i18n.language === "fa",
  };
}

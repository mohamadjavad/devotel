import { Box, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { FC } from "react";
import { useLanguage } from "../hooks/useLanguage";

export const LanguageSelector: FC = () => {
  const { currentLanguage, changeLanguage, t } = useLanguage();

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    const language = event.target.value;
    changeLanguage(language);
  };

  return (
    <Box sx={{ minWidth: 80 }}>
      <Select
        value={currentLanguage}
        onChange={handleLanguageChange}
        size="small"
        variant="outlined"
        sx={{
          color: "inherit",
          ".MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(255, 255, 255, 0.5)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(255, 255, 255, 0.7)",
          },
          "& .MuiSvgIcon-root": {
            color: "inherit",
          },
        }}
      >
        <MenuItem value="en">{t("languageSelector.english")}</MenuItem>
        <MenuItem value="fa">{t("languageSelector.farsi")}</MenuItem>
      </Select>
    </Box>
  );
};

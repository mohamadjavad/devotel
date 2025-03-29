import AddIcon from "@mui/icons-material/Add";
import ListIcon from "@mui/icons-material/List";
import { Box, Button, ButtonGroup } from "@mui/material";
import { FC } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";

export const NavMenu: FC = () => {
  const location = useLocation();
  const { t, isRTL } = useLanguage();

  return (
    <Box sx={{ display: "flex", direction: isRTL ? "rtl" : "ltr" }}>
      <ButtonGroup
        variant="contained"
        color="primary"
        sx={{
          mr: isRTL ? 0 : 2,
          ml: isRTL ? 2 : 0,
          "& .MuiButton-root": {
            fontWeight: 500,
            textShadow: "0px 0px 1px rgba(0,0,0,0.3)",
            "&.MuiButton-outlined": {
              color: (theme) =>
                theme.palette.mode === "light"
                  ? theme.palette.primary.dark
                  : undefined,
            },
          },
        }}
      >
        <Button
          component={Link}
          to="/new-application"
          startIcon={<AddIcon />}
          variant={
            location.pathname === "/new-application" ? "contained" : "outlined"
          }
        >
          {t("navigation.newApplication")}
        </Button>
        <Button
          component={Link}
          to="/my-applications"
          startIcon={<ListIcon />}
          variant={
            location.pathname === "/my-applications" ? "contained" : "outlined"
          }
        >
          {t("navigation.myApplications")}
        </Button>
      </ButtonGroup>
    </Box>
  );
};

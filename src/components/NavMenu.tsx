import AddIcon from "@mui/icons-material/Add";
import ListIcon from "@mui/icons-material/List";
import { Button, ButtonGroup } from "@mui/material";
import { FC } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";

export const NavMenu: FC = () => {
  const location = useLocation();
  const { t } = useLanguage();

  return (
    <ButtonGroup variant="contained" color="primary" sx={{ mr: 2 }}>
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
      {/* <Button
        component={Link}
        to="/examples/country-state"
        startIcon={<CodeIcon />}
        variant={
          location.pathname === "/examples/country-state"
            ? "contained"
            : "outlined"
        }
      >
        Country-State Example
      </Button> */}
    </ButtonGroup>
  );
};

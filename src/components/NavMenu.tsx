import AddIcon from "@mui/icons-material/Add";
import ListIcon from "@mui/icons-material/List";
import { Button, ButtonGroup } from "@mui/material";
import { FC } from "react";
import { Link, useLocation } from "react-router-dom";

export const NavMenu: FC = () => {
  const location = useLocation();

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
        New Application
      </Button>
      <Button
        component={Link}
        to="/my-applications"
        startIcon={<ListIcon />}
        variant={
          location.pathname === "/my-applications" ? "contained" : "outlined"
        }
      >
        My Applications
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

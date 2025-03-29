import { Box, Typography } from "@mui/material";
import { FC } from "react";
import { useLanguage } from "../hooks/useLanguage";
import { SubmissionListView } from "./SubmissionListView";

export const ApplicationsListPage: FC = () => {
  const { t } = useLanguage();

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {t("navigation.myApplications")}
      </Typography>
      <Typography variant="body1" paragraph>
        {t(
          "applications.description",
          "View and manage all your insurance applications in one place. You can filter, sort, and customize which columns to display using the controls above the table."
        )}
      </Typography>

      <SubmissionListView />
    </Box>
  );
};

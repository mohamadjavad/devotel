import { Box, Typography } from "@mui/material";
import { FC } from "react";
import { SubmissionListView } from "./SubmissionListView";

export const ApplicationsListPage: FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        My Insurance Applications
      </Typography>
      <Typography variant="body1" paragraph>
        View and manage all your insurance applications in one place. You can
        filter, sort, and customize which columns to display using the controls
        above the table.
      </Typography>

      <SubmissionListView />
    </Box>
  );
};

import { Alert, Box, Paper, Tab, Tabs } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useFormStructure } from "../hooks/useFormStructure";
import { DynamicForm } from "./DynamicForm";

const INSURANCE_TYPES = [
  { id: "health_insurance_application", label: "Health Insurance" },
  { id: "home_insurance_application", label: "Home Insurance" },
  { id: "car_insurance_application", label: "Car Insurance" },
];

export const InsuranceFormPage: FC = () => {
  const [selectedType, setSelectedType] = useState(INSURANCE_TYPES[0].id);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [draftKey, setDraftKey] = useState(`form_draft_${selectedType}`);

  const { formStructure, isLoading } = useFormStructure({
    formType: selectedType,
  });

  useEffect(() => {
    // Update the draft key when the form type changes
    setDraftKey(`form_draft_${selectedType}`);
  }, [selectedType]);

  const handleTypeChange = (_: React.SyntheticEvent, newValue: string) => {
    setSelectedType(newValue);
    setSubmissionSuccess(false);
  };

  const handleSubmitSuccess = () => {
    setSubmissionSuccess(true);
    // Clear the form or redirect after success
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 500);
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {submissionSuccess && (
        <Alert
          severity="success"
          sx={{
            mb: 3,
            width: "100%",
            maxWidth: "100%",
          }}
        >
          Your application was submitted successfully!
        </Alert>
      )}

      <Paper
        sx={{
          mb: 3,
          width: "100%",
          maxWidth: "100%",
        }}
      >
        <Tabs
          value={selectedType}
          onChange={handleTypeChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="insurance type tabs"
          sx={{
            width: "100%",
          }}
        >
          {INSURANCE_TYPES.map((type) => (
            <Tab key={type.id} label={type.label} value={type.id} />
          ))}
        </Tabs>
      </Paper>

      <Box sx={{ width: "100%" }}>
        <DynamicForm
          formStructure={formStructure}
          isLoading={isLoading}
          onSubmitSuccess={handleSubmitSuccess}
          enableAutosave={true}
          draftKey={draftKey}
        />
      </Box>
    </Box>
  );
};

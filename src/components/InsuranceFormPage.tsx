import { Alert, Box, CircularProgress, Paper, Tab, Tabs } from "@mui/material";
import { FC, useEffect, useMemo, useState } from "react";
import { useFormStructure } from "../hooks/useFormStructure";
import { useLanguage } from "../hooks/useLanguage";
import { DynamicForm } from "./DynamicForm";

export const InsuranceFormPage: FC = () => {
  const { t } = useLanguage();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [draftKey, setDraftKey] = useState<string | null>(null);

  // Fetch form structures with a single API call
  const { formStructures, getSelectedFormStructure, isLoading } =
    useFormStructure();

  // Get the selected form structure without making additional API requests
  const formStructure = useMemo(
    () => getSelectedFormStructure(selectedType || undefined),
    [getSelectedFormStructure, selectedType]
  );

  // Initialize the selected type once form structures are loaded
  useEffect(() => {
    if (formStructures.length > 0 && !selectedType) {
      setSelectedType(formStructures[0].formId);
    }
  }, [formStructures, selectedType]);

  // Update the draft key when the form type changes
  useEffect(() => {
    if (selectedType) {
      setDraftKey(`form_draft_${selectedType}`);
    }
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

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (formStructures.length === 0) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="warning">{t("messages.noFormStructure")}</Alert>
      </Box>
    );
  }

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
          {t("messages.submissionSuccess")}
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
          {formStructures.map((form) => (
            <Tab
              key={form.formId}
              label={t(`form.titles.${form.formId}`, {
                defaultValue: form.title,
              })}
              value={form.formId}
            />
          ))}
        </Tabs>
      </Paper>

      <Box sx={{ width: "100%" }}>
        <DynamicForm
          formStructure={formStructure}
          isLoading={!formStructure}
          onSubmitSuccess={handleSubmitSuccess}
          enableAutosave={true}
          draftKey={draftKey || undefined}
        />
      </Box>
    </Box>
  );
};

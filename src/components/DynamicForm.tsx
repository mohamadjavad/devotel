import AutorenewIcon from "@mui/icons-material/Autorenew";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useDynamicForm } from "../hooks/useDynamicForm";
import { FormStructure } from "../types/form";
import { DynamicField } from "./DynamicField";

interface DynamicFormProps {
  formStructure: FormStructure | undefined;
  isLoading: boolean;
  onSubmitSuccess?: (result: { success: boolean; id: string }) => void;
  enableAutosave?: boolean;
  draftKey?: string;
}

export const DynamicForm: FC<DynamicFormProps> = ({
  formStructure,
  isLoading,
  onSubmitSuccess,
  enableAutosave = false,
  draftKey,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    formik,
    visibleFormStructure,
    getFieldOptions,
    lastSaved,
    formReady,
    clearSavedDraft,
  } = useDynamicForm({
    formStructure,
    onSubmitSuccess: (result) => {
      setSubmitSuccess(true);
      if (onSubmitSuccess) {
        onSubmitSuccess(result);
      }
    },
    enableAutosave,
    draftKey:
      draftKey ||
      (formStructure ? `form_draft_${formStructure.formId}` : undefined),
  });

  useEffect(() => {
    if (submitSuccess) {
      const timer = setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [submitSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await formik.submitForm();
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    // Manually trigger a form values update to save to localStorage
    formik.handleSubmit();
  };

  const handleClearDraft = () => {
    if (window.confirm("Are you sure you want to clear your saved draft?")) {
      clearSavedDraft();
      // Reset the form to initial empty values
      formik.resetForm();
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!formStructure || !formReady) {
    return (
      <Box sx={{ textAlign: "center", p: 4 }}>
        <Typography variant="body1">No form structure available.</Typography>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            {formStructure.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Please fill out all required fields below.
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          {visibleFormStructure.fields.map((field, index) => (
            <Box key={field.id}>
              <DynamicField
                field={field}
                formik={formik}
                getFieldOptions={getFieldOptions}
              />
              {index < visibleFormStructure.fields.length - 1 &&
                field.type === "group" && <Divider sx={{ my: 2 }} />}
            </Box>
          ))}
        </CardContent>
      </Card>

      <Box
        sx={{
          mt: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          {enableAutosave && lastSaved && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                <AutorenewIcon
                  fontSize="small"
                  sx={{ verticalAlign: "middle", mr: 0.5 }}
                />
                Last autosaved: {lastSaved.toLocaleTimeString()}
              </Typography>
              <Tooltip title="Clear saved draft">
                <IconButton
                  size="small"
                  color="default"
                  onClick={handleClearDraft}
                  aria-label="Clear draft"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            type="button"
            variant="outlined"
            startIcon={<SaveIcon />}
            onClick={handleSaveDraft}
            disabled={submitting || !formik.isValid || !formik.dirty}
          >
            Save Draft
          </Button>
          <Button
            type="submit"
            variant="contained"
            color={submitSuccess ? "success" : "primary"}
            disabled={submitting || !formik.isValid}
            startIcon={submitSuccess ? <CheckCircleIcon /> : undefined}
          >
            {submitting ? (
              <>
                <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                Submitting...
              </>
            ) : submitSuccess ? (
              "Submitted!"
            ) : (
              "Submit Application"
            )}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

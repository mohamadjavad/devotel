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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useDynamicForm } from "../hooks/useDynamicForm";
import { useLanguage } from "../hooks/useLanguage";
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
  const { t } = useLanguage();
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
      <Box
        sx={{ display: "flex", justifyContent: "center", p: 4, width: "100%" }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!formStructure || !formReady) {
    return (
      <Box sx={{ textAlign: "center", p: 4, width: "100%" }}>
        <Typography variant="body1">{t("form.loading")}</Typography>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
      <Card sx={{ mb: 3, width: "100%" }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            {formStructure.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Please fill out all required fields below.
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3, width: "100%" }}>
        <CardContent>
          {visibleFormStructure.fields.map((field, index) => (
            <Box key={field.id} sx={{ width: "100%" }}>
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
          flexDirection: isMobile ? "column" : "row",
          gap: 2,
          width: "100%",
        }}
      >
        <Box sx={{ width: isMobile ? "100%" : "auto" }}>
          {enableAutosave && lastSaved && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                width: "100%",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                <AutorenewIcon
                  fontSize="small"
                  sx={{ verticalAlign: "middle", mr: 0.5 }}
                />
                {t("form.autosaved")}: {lastSaved.toLocaleTimeString()}
              </Typography>
              <Tooltip title={t("form.cancel")}>
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
        <Box
          sx={{
            display: "flex",
            gap: 2,
            width: isMobile ? "100%" : "auto",
            justifyContent: isMobile ? "center" : "flex-end",
          }}
        >
          <Button
            type="button"
            variant="outlined"
            startIcon={<SaveIcon />}
            onClick={handleSaveDraft}
            disabled={submitting || !formik.isValid || !formik.dirty}
            fullWidth={isMobile}
          >
            {t("form.save")}
          </Button>
          <Button
            type="submit"
            variant="contained"
            color={submitSuccess ? "success" : "primary"}
            disabled={submitting || !formik.isValid}
            startIcon={submitSuccess ? <CheckCircleIcon /> : undefined}
            fullWidth={isMobile}
          >
            {submitting ? (
              <>
                <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                {t("form.loading")}
              </>
            ) : submitSuccess ? (
              t("form.autosaved")
            ) : (
              t("form.submit")
            )}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

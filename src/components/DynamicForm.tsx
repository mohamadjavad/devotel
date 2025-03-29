import AutorenewIcon from "@mui/icons-material/Autorenew";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import SaveIcon from "@mui/icons-material/Save";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Collapse,
  Divider,
  IconButton,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDynamicForm } from "../hooks/useDynamicForm";
import { useLanguage } from "../hooks/useLanguage";
import { FormStructure } from "../types/form";
import { ConfirmationDialog } from "./ConfirmationDialog";
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
  const { t: t_i18n } = useTranslation();
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [showClearDraftConfirmation, setShowClearDraftConfirmation] =
    useState(false);
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

    // Validate all form fields and show all errors
    const errors = await formik.validateForm();
    formik.setTouched(
      Object.keys(formik.values).reduce((touched, field) => {
        touched[field] = true;
        return touched;
      }, {} as { [key: string]: boolean })
    );

    // Only proceed with submission if form is valid
    if (Object.keys(errors).length === 0) {
      setShowValidationErrors(false);
      setSubmitting(true);
      try {
        await formik.submitForm();
      } catch (error) {
        console.error(t_i18n("form.autosaveFailed"), error);
      } finally {
        setSubmitting(false);
      }
    } else {
      // Show validation error summary
      setShowValidationErrors(true);
      // Auto-scroll to the first error
      setTimeout(() => {
        const errorElement = document.querySelector(".Mui-error");
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }
  };

  const handleSaveDraft = () => {
    // Manually trigger a form values update to save to localStorage
    formik.handleSubmit();
  };

  const handleClearDraft = () => {
    setShowClearDraftConfirmation(true);
  };

  const handleConfirmClearDraft = () => {
    clearSavedDraft();
    // Reset the form to initial empty values
    formik.resetForm();
    setShowClearDraftConfirmation(false);
  };

  const handleCancelClearDraft = () => {
    setShowClearDraftConfirmation(false);
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
  console.log(formik.isValid);

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
      <Card sx={{ mb: 3, width: "100%" }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            {t(`form.titles.${formStructure.formId}`, {
              defaultValue: formStructure.title,
            })}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {t("messages.fillRequired")}
          </Typography>

          {/* Validation error summary */}
          <Collapse in={showValidationErrors}>
            <Alert
              severity="error"
              sx={{ mt: 2 }}
              icon={<ErrorOutlineIcon />}
              onClose={() => setShowValidationErrors(false)}
            >
              {t("validation.formHasErrors")}
            </Alert>
          </Collapse>
        </CardContent>
      </Card>

      <Card
        sx={{
          mb: 3,
          width: "100%",
          direction: "ltr",
          bgcolor: (theme) =>
            theme.palette.mode === "light" ? "#ffffff" : undefined,
          boxShadow: (theme) =>
            theme.palette.mode === "light"
              ? "0 2px 12px rgba(0, 0, 0, 0.08)"
              : undefined,
        }}
      >
        <CardContent
          sx={{
            width: "100%",
            direction: "ltr",
            p: { xs: 2, sm: 3 },
          }}
        >
          {visibleFormStructure.fields.map((field, index) => (
            <Box key={field.id} sx={{ width: "100%", direction: "ltr" }}>
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

      <Card
        sx={{
          mt: 3,
          mb: 3,
          width: "100%",
        }}
      >
        <CardContent>
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
                <Tooltip title={t("form.clearDraft")}>
                  <IconButton
                    size="small"
                    color="default"
                    onClick={handleClearDraft}
                    aria-label={t_i18n("form.clearDraft")}
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
              disabled={submitting || !formik.dirty}
              fullWidth={isMobile}
            >
              {t("form.saveDraft")}
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
                  {t("form.submitting")}
                </>
              ) : submitSuccess ? (
                t("form.submitted")
              ) : (
                t("form.submit")
              )}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={showClearDraftConfirmation}
        title={t("form.clearDraft")}
        message={t("messages.clearDraftConfirmation")}
        onConfirm={handleConfirmClearDraft}
        onCancel={handleCancelClearDraft}
      />
    </Box>
  );
};

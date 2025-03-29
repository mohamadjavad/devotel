import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { FormikProps } from "formik";
import { FC } from "react";
import { useLanguage } from "../hooks/useLanguage";
import { FormData, FormField, FormFieldOption } from "../types/form";

// Common styles to prevent RTL effects
const ltrStyles = {
  "& .MuiInputBase-root": {
    direction: "ltr !important",
    fontFamily: "inherit",
  },
  "& .MuiInputLabel-root": {
    left: "14px !important",
    right: "auto !important",
    transformOrigin: "top left !important",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    textAlign: "left !important",
  },
  "& .MuiFormLabel-root": {
    left: "0 !important",
    right: "auto !important",
  },
};

// Common error styles
const errorStyles = {
  "& .MuiFormHelperText-root.Mui-error": {
    fontSize: "0.75rem",
    marginTop: "3px",
    fontWeight: "500",
  },
  "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline": {
    borderWidth: "2px",
  },
};

interface DynamicFieldProps {
  field: FormField;
  formik: FormikProps<FormData>;
  getFieldOptions: (field: FormField) => FormFieldOption[];
}

export const DynamicField: FC<DynamicFieldProps> = ({
  field,
  formik,
  getFieldOptions,
}) => {
  const { t } = useLanguage();
  const { errors, values, handleChange, handleBlur, setFieldValue } = formik;
  const fieldError = errors[field.id] ? String(errors[field.id]) : "";

  // Function to get translated field labels based on field ID
  const getFieldLabel = (fieldId: string, defaultLabel: string) => {
    // Check for special fields like country/state
    if (fieldId.toLowerCase().includes("country")) {
      return t("formFields.country");
    } else if (
      fieldId.toLowerCase().includes("state") ||
      fieldId.toLowerCase().includes("province")
    ) {
      return t("formFields.state");
    }
    // For other fields, use the default label
    return defaultLabel;
  };

  // Function to translate option labels if they match common patterns
  const getOptionLabel = (option: FormFieldOption) => {
    if (!option.label) return "";

    // Try to translate common option values
    const translationKey = `options.${option.value}`;
    const translation = t(translationKey, { defaultValue: option.label });
    return translation;
  };

  const renderTextInput = () => (
    <TextField
      fullWidth
      id={field.id}
      name={field.id}
      label={getFieldLabel(field.id, field.label)}
      value={values[field.id] || ""}
      onChange={handleChange}
      onBlur={handleBlur}
      error={Boolean(fieldError)}
      helperText={fieldError}
      margin="normal"
      required={field.required}
      sx={{
        ...ltrStyles,
        textAlign: "left",
        ...errorStyles,
      }}
    />
  );

  const renderNumberInput = () => {
    // Create a numeric input with min/max constraints
    return (
      <TextField
        fullWidth
        id={field.id}
        name={field.id}
        label={getFieldLabel(field.id, field.label)}
        type="number"
        value={values[field.id] || ""}
        onChange={handleChange}
        onBlur={handleBlur}
        error={Boolean(fieldError)}
        helperText={fieldError}
        margin="normal"
        required={field.required}
        sx={{
          ...ltrStyles,
          textAlign: "left",
          ...errorStyles,
        }}
        slotProps={{
          htmlInput: field.validation
            ? {
                min: field.validation.min,
                max: field.validation.max,
              }
            : {},
        }}
      />
    );
  };

  const renderDateInput = () => (
    <TextField
      fullWidth
      id={field.id}
      name={field.id}
      label={getFieldLabel(field.id, field.label)}
      type="date"
      value={values[field.id] || ""}
      onChange={handleChange}
      onBlur={handleBlur}
      error={Boolean(fieldError)}
      helperText={fieldError}
      margin="normal"
      required={field.required}
      sx={{
        ...ltrStyles,
        textAlign: "left",
        ...errorStyles,
      }}
      slotProps={{
        inputLabel: {
          shrink: true,
        },
      }}
    />
  );

  const renderCheckboxGroup = () => {
    const checkboxOptions = getFieldOptions(field);
    return (
      <FormControl
        component="fieldset"
        error={Boolean(fieldError)}
        fullWidth
        margin="normal"
        sx={{
          textAlign: "left",
          "& .MuiFormGroup-root": {
            flexDirection: "column",
          },
        }}
      >
        <FormLabel component="legend">
          {getFieldLabel(field.id, field.label)}
        </FormLabel>
        <Box sx={{ display: "flex", flexDirection: "column", mt: 1 }}>
          {checkboxOptions.map((option) => (
            <FormControlLabel
              key={String(option.value || "")}
              control={
                <Checkbox
                  checked={
                    Array.isArray(values[field.id]) &&
                    Array.isArray(values[field.id]) &&
                    (values[field.id] as string[]).includes(
                      String(option.value || "")
                    )
                  }
                  onChange={(e) => {
                    const currentValues = Array.isArray(values[field.id])
                      ? [...(values[field.id] as string[])]
                      : [];

                    if (e.target.checked) {
                      setFieldValue(field.id, [
                        ...currentValues,
                        String(option.value || ""),
                      ]);
                    } else {
                      setFieldValue(
                        field.id,
                        currentValues.filter(
                          (val) => val !== String(option.value || "")
                        )
                      );
                    }
                  }}
                  name={`${field.id}[${option.value}]`}
                />
              }
              label={getOptionLabel(option)}
              sx={{ margin: "0", textAlign: "inherit" }}
            />
          ))}
        </Box>
        {fieldError && <FormHelperText>{fieldError}</FormHelperText>}
      </FormControl>
    );
  };

  const renderRadioGroup = () => {
    const radioOptions = getFieldOptions(field);
    return (
      <FormControl
        component="fieldset"
        error={Boolean(fieldError)}
        margin="normal"
        fullWidth
        sx={{
          textAlign: "left",
          "& .MuiFormGroup-root": {
            flexDirection: "column",
          },
        }}
      >
        <FormLabel
          component="legend"
          sx={{ left: "0 !important", right: "auto !important" }}
        >
          {getFieldLabel(field.id, field.label)}
        </FormLabel>
        <RadioGroup
          aria-label={getFieldLabel(field.id, field.label)}
          name={field.id}
          value={values[field.id] || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          sx={{ textAlign: "left" }}
        >
          {radioOptions.map((option) => (
            <FormControlLabel
              key={String(option.value || "")}
              value={option.value}
              control={<Radio />}
              label={getOptionLabel(option)}
              sx={{ margin: "0", textAlign: "inherit" }}
            />
          ))}
        </RadioGroup>
        {fieldError && <FormHelperText>{fieldError}</FormHelperText>}
      </FormControl>
    );
  };

  const renderSelect = () => {
    const selectOptions = getFieldOptions(field);
    return (
      <FormControl
        fullWidth
        margin="normal"
        error={Boolean(fieldError)}
        required={field.required}
        sx={{
          ...ltrStyles,
          textAlign: "left",
          ...errorStyles,
        }}
      >
        <InputLabel
          id={`${field.id}-label`}
          sx={{ left: "14px !important", right: "auto !important" }}
        >
          {getFieldLabel(field.id, field.label)}
        </InputLabel>
        <Select
          labelId={`${field.id}-label`}
          id={field.id}
          name={field.id}
          value={values[field.id] || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          label={getFieldLabel(field.id, field.label)}
          sx={{
            textAlign: "left",
            direction: "ltr !important",
            fontFamily: "inherit",
          }}
        >
          {selectOptions.map((option) => (
            <MenuItem
              key={String(option.value || "")}
              value={String(option.value || "")}
            >
              {getOptionLabel(option)}
            </MenuItem>
          ))}
        </Select>
        {fieldError && <FormHelperText>{fieldError}</FormHelperText>}
      </FormControl>
    );
  };

  // Don't render group type fields since they're just containers
  if (field.type === "group") {
    return (
      <Box sx={{ mt: 3, mb: 2 }}>
        <Typography variant="h6" component="h3" gutterBottom>
          {getFieldLabel(field.id, field.label)}
        </Typography>
      </Box>
    );
  }

  // Render appropriate field based on type
  switch (field.type) {
    case "text":
      return renderTextInput();
    case "number":
      return renderNumberInput();
    case "date":
      return renderDateInput();
    case "checkbox":
      return renderCheckboxGroup();
    case "radio":
      return renderRadioGroup();
    case "select":
      return renderSelect();
    default:
      return (
        <Box sx={{ mb: 2 }}>
          <Typography color="error">
            {t("common.fieldTypes.unknown")}: {field.type}
          </Typography>
        </Box>
      );
  }
};

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

// Common styles to prevent RTL effects for LTR input content
const ltrStyles = {
  "& .MuiInputBase-root": {
    direction: "ltr !important",
    fontFamily: "inherit",
  },
  "& .MuiInputLabel-root": {
    transformOrigin: "top left !important",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    textAlign: "left !important",
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
  const { t, isRTL } = useLanguage();
  const { errors, values, handleChange, handleBlur, setFieldValue } = formik;
  const fieldError = errors[field.id] ? String(errors[field.id]) : "";

  // Function to get translated field labels based on field ID
  const getFieldLabel = (fieldId: string, defaultLabel: string) => {
    // First try to get a direct translation for this specific field ID
    const specificFieldKey = `formFields.${fieldId}`;
    const specificTranslation = t(specificFieldKey, { defaultValue: "" });

    if (specificTranslation) {
      return specificTranslation;
    }

    // Check for special fields like country/state
    if (fieldId.toLowerCase().includes("country")) {
      return t("formFields.country");
    } else if (
      fieldId.toLowerCase().includes("state") ||
      fieldId.toLowerCase().includes("province")
    ) {
      return t("formFields.state");
    } else if (fieldId.toLowerCase().includes("first_name")) {
      return t("formFields.firstName");
    } else if (fieldId.toLowerCase().includes("last_name")) {
      return t("formFields.lastName");
    } else if (fieldId.toLowerCase().includes("city")) {
      return t("formFields.city");
    } else if (
      fieldId.toLowerCase().includes("zip") ||
      fieldId.toLowerCase().includes("postal")
    ) {
      return t("formFields.zipCode");
    } else if (
      fieldId.toLowerCase().includes("dob") ||
      fieldId.toLowerCase().includes("birth")
    ) {
      return t("formFields.birthDate");
    }

    // For other fields, use the default label
    return defaultLabel;
  };

  // Enhanced function to translate option labels with multiple fallback approaches
  const getOptionLabel = (option: FormFieldOption) => {
    if (!option.label) return "";

    // Try multiple translation approaches in order:

    // 1. Direct translation for the specific field.option combination
    const fieldOptionKey = `options.${field.id}.${option.value}`;
    const fieldOptionTranslation = t(fieldOptionKey, { defaultValue: "" });
    if (fieldOptionTranslation) {
      return fieldOptionTranslation;
    }

    // 2. Try to translate using just the option value (common values like yes/no/male/female)
    const valueKey = `options.${option.value}`;
    const valueTranslation = t(valueKey, { defaultValue: "" });
    if (valueTranslation) {
      return valueTranslation;
    }

    // 3. Try to translate using the option label (for country names, etc.)
    if (typeof option.label === "string") {
      const labelKey = `options.${option.label.replace(/\s+/g, "")}`;
      const labelTranslation = t(labelKey, { defaultValue: "" });
      if (labelTranslation) {
        return labelTranslation;
      }
    }

    // 4. Try using common patterns in the option label
    if (typeof option.label === "string") {
      // Try specifically for boolean values shown as text
      if (
        option.label.toLowerCase() === "yes" ||
        option.label.toLowerCase() === "true"
      ) {
        return t("options.yes");
      }
      if (
        option.label.toLowerCase() === "no" ||
        option.label.toLowerCase() === "false"
      ) {
        return t("options.no");
      }

      // Try for gender options
      if (option.label.toLowerCase() === "male") {
        return t("options.male");
      }
      if (option.label.toLowerCase() === "female") {
        return t("options.female");
      }

      // Try for coverage types
      if (option.label.toLowerCase().includes("basic")) {
        return t("options.Basic");
      }
      if (option.label.toLowerCase().includes("standard")) {
        return t("options.standard");
      }
      if (option.label.toLowerCase().includes("premium")) {
        return t("options.premium");
      }
      if (option.label.toLowerCase().includes("comprehensive")) {
        return t("options.Comprehensive");
      }
    }

    // 5. Fallback to the original label
    return option.label;
  };

  const renderTextInput = () => (
    <TextField
      variant="standard"
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
        textAlign: isRTL ? "right" : "left",
        "& .MuiFormLabel-root": {
          left: isRTL ? "auto" : "0 !important",
          right: isRTL ? "0 !important" : "auto",
        },
        ...errorStyles,
      }}
    />
  );

  const renderNumberInput = () => {
    // Create a numeric input with min/max constraints
    return (
      <TextField
        variant="standard"
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
          textAlign: isRTL ? "right" : "left",
          "& .MuiFormLabel-root": {
            left: isRTL ? "auto" : "0 !important",
            right: isRTL ? "0 !important" : "auto",
          },
          ...errorStyles,
        }}
        slotProps={{
          htmlInput: field.validation
            ? {
                min: field.validation.min,
                max: field.validation.max,
              }
            : { min: 0 },
        }}
      />
    );
  };

  const renderDateInput = () => (
    <TextField
      variant="standard"
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
        textAlign: isRTL ? "right" : "left",
        "& .MuiFormLabel-root": {
          left: isRTL ? "auto" : "0 !important",
          right: isRTL ? "0 !important" : "auto",
        },
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
        variant="standard"
        component="fieldset"
        error={Boolean(fieldError)}
        fullWidth
        margin="normal"
        sx={{
          textAlign: isRTL ? "right" : "left",
          "& .MuiFormGroup-root": {
            flexDirection: "column",
          },
        }}
      >
        <FormLabel
          component="legend"
          sx={{
            textAlign: isRTL ? "right" : "left",
            width: "100%",
          }}
        >
          {getFieldLabel(field.id, field.label)}
        </FormLabel>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            mt: 1,
            alignItems: isRTL ? "flex-end" : "flex-start",
          }}
        >
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
              sx={{
                margin: "0",
                textAlign: "inherit",
                flexDirection: isRTL ? "row-reverse" : "row",
              }}
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
        variant="standard"
        component="fieldset"
        error={Boolean(fieldError)}
        margin="normal"
        fullWidth
        sx={{
          textAlign: isRTL ? "right" : "left",
          "& .MuiFormGroup-root": {
            flexDirection: "column",
          },
        }}
      >
        <FormLabel
          component="legend"
          sx={{
            textAlign: isRTL ? "right" : "left",
            width: "100%",
          }}
        >
          {getFieldLabel(field.id, field.label)}
        </FormLabel>
        <RadioGroup
          aria-label={getFieldLabel(field.id, field.label)}
          name={field.id}
          value={values[field.id] || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          sx={{
            textAlign: isRTL ? "right" : "left",
            alignItems: isRTL ? "flex-end" : "flex-start",
          }}
        >
          {radioOptions.map((option) => (
            <FormControlLabel
              key={String(option.value || "")}
              value={option.value}
              control={<Radio />}
              label={getOptionLabel(option)}
              sx={{
                margin: "0",
                textAlign: "inherit",
                flexDirection: isRTL ? "row-reverse" : "row",
              }}
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
        variant="standard"
        fullWidth
        margin="normal"
        error={Boolean(fieldError)}
        required={field.required}
        sx={{
          ...ltrStyles,
          textAlign: isRTL ? "right" : "left",
          "& .MuiFormLabel-root": {
            left: isRTL ? "auto !important" : "14px !important",
            right: isRTL ? "14px !important" : "auto !important",
          },
          ...errorStyles,
        }}
      >
        <InputLabel id={`${field.id}-label`}>
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
            textAlign: isRTL ? "right" : "left",
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
        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          sx={{ textAlign: isRTL ? "right" : "left" }}
        >
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

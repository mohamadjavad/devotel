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
import { FormData, FormField, FormFieldOption } from "../types/form";

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
  const { errors, touched, values, handleChange, handleBlur, setFieldValue } =
    formik;
  const fieldError =
    touched[field.id] && errors[field.id] ? String(errors[field.id]) : "";

  // Don't render group type fields since they're just containers
  if (field.type === "group") {
    return (
      <Box sx={{ mt: 3, mb: 2 }}>
        <Typography variant="h6" component="h3" gutterBottom>
          {field.label}
        </Typography>
      </Box>
    );
  }

  const renderTextInput = () => (
    <TextField
      fullWidth
      id={field.id}
      name={field.id}
      label={field.label}
      value={values[field.id] || ""}
      onChange={handleChange}
      onBlur={handleBlur}
      error={Boolean(fieldError)}
      helperText={fieldError}
      margin="normal"
    />
  );

  const renderNumberInput = () => (
    <TextField
      fullWidth
      id={field.id}
      name={field.id}
      label={field.label}
      type="number"
      value={values[field.id] || ""}
      onChange={handleChange}
      onBlur={handleBlur}
      error={Boolean(fieldError)}
      helperText={fieldError}
      margin="normal"
      inputProps={{
        min: field.validation?.min,
        max: field.validation?.max,
      }}
    />
  );

  const renderDateInput = () => (
    <TextField
      fullWidth
      id={field.id}
      name={field.id}
      label={field.label}
      type="date"
      value={values[field.id] || ""}
      onChange={handleChange}
      onBlur={handleBlur}
      error={Boolean(fieldError)}
      helperText={fieldError}
      margin="normal"
      InputLabelProps={{
        shrink: true,
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
      >
        <FormLabel component="legend">{field.label}</FormLabel>
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
              label={option.label || ""}
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
      >
        <FormLabel component="legend">{field.label}</FormLabel>
        <RadioGroup
          aria-label={field.label}
          name={field.id}
          value={values[field.id] || ""}
          onChange={handleChange}
          onBlur={handleBlur}
        >
          {radioOptions.map((option) => (
            <FormControlLabel
              key={String(option.value || "")}
              value={option.value}
              control={<Radio />}
              label={option.label || ""}
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
      <FormControl fullWidth margin="normal" error={Boolean(fieldError)}>
        <InputLabel id={`${field.id}-label`}>{field.label}</InputLabel>
        <Select
          labelId={`${field.id}-label`}
          id={field.id}
          name={field.id}
          value={values[field.id] || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          label={field.label}
        >
          {selectOptions.map((option) => (
            <MenuItem
              key={String(option.value || "")}
              value={String(option.value || "")}
            >
              {option.label || ""}
            </MenuItem>
          ))}
        </Select>
        {fieldError && <FormHelperText>{fieldError}</FormHelperText>}
      </FormControl>
    );
  };

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
      return <div>Unsupported field type: {field.type}</div>;
  }
};

import { useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { getStates, submitForm } from "../services/api";
import { FormData, FormField, FormStructure, Visibility } from "../types/form";

interface UseDynamicFormProps {
  formStructure: FormStructure | undefined;
  initialValues?: FormData;
  onSubmitSuccess?: (result: { success: boolean; id: string }) => void;
  enableAutosave?: boolean;
  autosaveInterval?: number;
  draftKey?: string;
}

export const useDynamicForm = ({
  formStructure,
  initialValues = {},
  onSubmitSuccess,
  enableAutosave = false,
  autosaveInterval = 30000, // 30 seconds
  draftKey = "form_draft",
}: UseDynamicFormProps) => {
  const [dynamicOptions, setDynamicOptions] = useState<
    Record<string, { label: string; value: string }[]>
  >({});
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [validationSchema, setValidationSchema] = useState<
    Record<string, Yup.Schema>
  >({});
  const [countryStateFields, setCountryStateFields] = useState<{
    countryField?: string;
    stateField?: string;
  }>({});

  // Function to retrieve saved draft from localStorage
  const getSavedDraft = (): FormData => {
    try {
      const savedDraft = localStorage.getItem(draftKey);
      return savedDraft ? JSON.parse(savedDraft) : {};
    } catch (error) {
      console.error("Error retrieving draft from localStorage:", error);
      return {};
    }
  };

  // Function to save draft to localStorage
  const saveDraft = (values: FormData): void => {
    try {
      localStorage.setItem(draftKey, JSON.stringify(values));
      setLastSaved(new Date());
    } catch (error) {
      console.error("Error saving draft to localStorage:", error);
    }
  };

  // Initialize with saved draft if available and no initialValues provided
  const mergedInitialValues =
    Object.keys(initialValues).length > 0 ? initialValues : getSavedDraft();

  // Detect country-state field pairs when the form structure changes
  useEffect(() => {
    if (!formStructure || !formStructure.fields) return;

    const findFieldsByType = (
      fields: FormField[],
      targetType: string
    ): string[] => {
      const result: string[] = [];

      const processField = (field: FormField) => {
        if (field.type === targetType) {
          result.push(field.id);
        }

        if (field.type === "group" && field.fields) {
          field.fields.forEach(processField);
        }
      };

      fields.forEach(processField);
      return result;
    };

    const detectCountryStateFields = () => {
      const countryFields = findFieldsByType(
        formStructure.fields || [],
        "select"
      ).filter(
        (id) =>
          id.toLowerCase().includes("country") ||
          Boolean(
            formStructure.fields.find((f) => f.id === id && f.isCountryField)
          )
      );

      const stateFields = findFieldsByType(
        formStructure.fields || [],
        "select"
      ).filter(
        (id) =>
          id.toLowerCase().includes("state") ||
          id.toLowerCase().includes("province") ||
          Boolean(
            formStructure.fields.find((f) => f.id === id && f.isStateField)
          )
      );

      if (countryFields.length > 0 && stateFields.length > 0) {
        setCountryStateFields({
          countryField: countryFields[0],
          stateField: stateFields[0],
        });
      }
    };

    detectCountryStateFields();
  }, [formStructure]);

  // Function to check if a field should be visible based on its dependencies
  const isFieldVisible = (field: FormField, values: FormData): boolean => {
    if (!field.visibility) return true;

    const {
      dependsOn,
      condition,
      value: expectedValue,
    } = field.visibility as Visibility;
    const actualValue = values[dependsOn];

    if (actualValue === undefined) return false;

    switch (condition) {
      case "equals":
        if (Array.isArray(expectedValue)) {
          return expectedValue.includes(
            actualValue as string | number | boolean
          );
        }
        return actualValue === expectedValue;
      case "notEquals":
        if (Array.isArray(expectedValue)) {
          return !expectedValue.includes(
            actualValue as string | number | boolean
          );
        }
        return actualValue !== expectedValue;
      case "contains":
        // Handle array value types
        if (Array.isArray(actualValue)) {
          if (typeof expectedValue === "string") {
            return (actualValue as unknown as string[]).includes(expectedValue);
          } else if (typeof expectedValue === "number") {
            return (actualValue as unknown as number[]).includes(expectedValue);
          } else if (typeof expectedValue === "boolean") {
            return (actualValue as unknown as boolean[]).includes(
              expectedValue
            );
          }
        }
        return false;
      case "greaterThan":
        if (
          typeof actualValue === "number" &&
          typeof expectedValue === "number"
        ) {
          return actualValue > expectedValue;
        }
        return false;
      case "lessThan":
        if (
          typeof actualValue === "number" &&
          typeof expectedValue === "number"
        ) {
          return actualValue < expectedValue;
        }
        return false;
      default:
        return false;
    }
  };

  // Recursively process fields to build validation schema
  const processFields = (
    fields: FormField[],
    schema: Record<string, Yup.Schema>
  ) => {
    fields.forEach((field) => {
      if (field.type === "group" && field.fields) {
        // Process nested fields
        processFields(field.fields, schema);
      } else {
        let fieldSchema: Yup.Schema;

        // Set up base schema based on field type
        switch (field.type) {
          case "text":
            fieldSchema = Yup.string();

            // Add pattern validation if specified
            if (field.validation?.pattern) {
              fieldSchema = (fieldSchema as Yup.StringSchema).matches(
                new RegExp(field.validation.pattern),
                field.validation.message || "Invalid format"
              );
            }
            break;
          case "number":
            fieldSchema = Yup.number();
            if (field.validation?.min !== undefined) {
              fieldSchema = (fieldSchema as Yup.NumberSchema).min(
                field.validation.min,
                field.validation.message ||
                  `Must be at least ${field.validation.min}`
              );
            }
            if (field.validation?.max !== undefined) {
              fieldSchema = (fieldSchema as Yup.NumberSchema).max(
                field.validation.max,
                field.validation.message ||
                  `Must be at most ${field.validation.max}`
              );
            }
            break;
          case "date":
            fieldSchema = Yup.date();
            break;
          case "checkbox":
            fieldSchema = Yup.array().of(Yup.string());
            break;
          case "select":
          case "radio":
            fieldSchema = Yup.string();
            break;
          default:
            fieldSchema = Yup.string();
        }

        // Add required validation if field is required
        if (field.required) {
          if (fieldSchema.type === "string") {
            fieldSchema = (fieldSchema as Yup.StringSchema).required(
              "This field is required"
            );
          } else if (fieldSchema.type === "number") {
            fieldSchema = (fieldSchema as Yup.NumberSchema).required(
              "This field is required"
            );
          } else if (fieldSchema.type === "date") {
            fieldSchema = (fieldSchema as Yup.DateSchema).required(
              "This field is required"
            );
          } else if (fieldSchema.type === "array") {
            // Instead of type casting, modify the schema and assign it back
            fieldSchema = fieldSchema.required("This field is required");
            // We need this with a ts-expect-error because Yup typing is complex
            // @ts-expect-error: min exists on array schema
            fieldSchema = fieldSchema.min(
              1,
              "Please select at least one option"
            );
          } else {
            fieldSchema = fieldSchema.required("This field is required");
          }
        }

        schema[field.id] = fieldSchema;
      }
    });
  };

  // Build validation schema from form structure
  const buildValidationSchema = () => {
    if (!formStructure || !formStructure.fields) return {};

    const schema: Record<string, Yup.Schema> = {};
    processFields(formStructure.fields, schema);
    return schema;
  };

  useEffect(() => {
    if (formStructure) {
      setValidationSchema(buildValidationSchema());
    }
  }, [formStructure]);

  // Initialize formik
  const formik = useFormik({
    initialValues: mergedInitialValues,
    validationSchema: Yup.object().shape(validationSchema),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      try {
        // Clear the draft when successfully submitted
        localStorage.removeItem(draftKey);
        const result = await submitForm(values);
        if (onSubmitSuccess) {
          onSubmitSuccess(result);
        }
        return result;
      } catch (error) {
        console.error("Form submission error:", error);
        throw error;
      }
    },
    enableReinitialize: true,
  });

  // Fetch states when country field changes
  useEffect(() => {
    const fetchStateOptions = async () => {
      if (
        !formStructure ||
        !countryStateFields.countryField ||
        !countryStateFields.stateField
      )
        return;

      const countryValue = formik.values[countryStateFields.countryField];

      if (countryValue && typeof countryValue === "string") {
        try {
          const states = await getStates(countryValue);
          if (states.length > 0) {
            setDynamicOptions((prev) => ({
              ...prev,
              [countryStateFields.stateField!]: states,
            }));

            // If the current state value is not in the new states list, clear it
            const currentStateValue =
              formik.values[countryStateFields.stateField];
            if (currentStateValue) {
              const isValidState = states.some(
                (state) => state.value === currentStateValue
              );

              if (!isValidState) {
                formik.setFieldValue(countryStateFields.stateField, "");
              }
            }
          }
        } catch (error) {
          console.error(
            `Error fetching states for country ${countryValue}:`,
            error
          );
        }
      }
    };

    fetchStateOptions();
  }, [formStructure, formik.values, countryStateFields]);

  // Auto-save form data periodically to localStorage
  useEffect(() => {
    if (!enableAutosave || !formStructure) return;

    // Save form data immediately when values change
    if (Object.keys(formik.values).length > 0 && formik.dirty) {
      saveDraft(formik.values);
    }

    // Set up interval for periodic saves
    const timer = setInterval(() => {
      if (formik.dirty) {
        saveDraft(formik.values);
      }
    }, autosaveInterval);

    return () => {
      clearInterval(timer);
      // Save on unmount if there are unsaved changes
      if (formik.dirty) {
        saveDraft(formik.values);
      }
    };
  }, [enableAutosave, formik.values, autosaveInterval, formik.dirty]);

  // Function to flatten the form structure for rendering
  const flattenFormFields = (fields: FormField[] = []): FormField[] => {
    const result: FormField[] = [];
    fields.forEach((field) => {
      if (field.type === "group" && field.fields) {
        // Add the group field as a section header
        result.push({
          ...field,
          type: "group",
          fields: undefined,
        });
        // Recursively add child fields
        result.push(...flattenFormFields(field.fields));
      } else {
        result.push(field);
      }
    });
    return result;
  };

  // Get visible fields based on current form values
  const getVisibleFields = () => {
    if (!formStructure || !formStructure.fields)
      return { formId: "", title: "", fields: [] };

    const allFields = flattenFormFields(formStructure.fields);
    const visibleFields = allFields.filter((field) =>
      isFieldVisible(field, formik.values)
    );

    return {
      ...formStructure,
      fields: visibleFields,
    };
  };

  const getFieldOptions = (field: FormField) => {
    // Check if field has dynamic options from country-state relationship
    if (field.id === countryStateFields.stateField) {
      return dynamicOptions[field.id] || [];
    }

    if (!field.options) {
      return [];
    }

    // Convert string options to { label, value } format
    return field.options.map((option) => {
      if (typeof option === "string") {
        return { label: option, value: option };
      }
      return option;
    });
  };

  // Function to manually clear saved draft
  const clearSavedDraft = () => {
    localStorage.removeItem(draftKey);
    setLastSaved(null);
  };

  return {
    formik,
    visibleFormStructure: getVisibleFields(),
    isFieldVisible: (field: FormField) => isFieldVisible(field, formik.values),
    getFieldOptions,
    lastSaved,
    formReady: !!formStructure,
    clearSavedDraft,
  };
};

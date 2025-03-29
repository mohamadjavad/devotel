import { useQuery } from "@tanstack/react-query";
import { getFormStructure } from "../services/api";
import { FormStructure } from "../types/form";

export const useFormStructure = () => {
  // Make a single API call to fetch all form structures
  const { data, isLoading, error } = useQuery({
    queryKey: ["allFormStructures"],
    queryFn: () => getFormStructure(),
  });

  // Function to get the selected form structure without additional API calls
  const getSelectedFormStructure = (
    formType?: string
  ): FormStructure | undefined => {
    if (!data || !data.allForms || data.allForms.length === 0) {
      return undefined;
    }

    if (!formType) {
      return data.allForms[0];
    }

    return (
      data.allForms.find((form) => form.formId === formType) || data.allForms[0]
    );
  };

  return {
    formStructures: data?.allForms || [],
    getSelectedFormStructure,
    isLoading,
    error,
  };
};

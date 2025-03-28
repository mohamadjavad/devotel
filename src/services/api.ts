import axios from "axios";
import { FormData, FormStructure, TableResponse } from "../types/form";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://assignment.devotel.io/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getFormStructure = async (
  formType?: string
): Promise<FormStructure> => {
  try {
    const response = await api.get("/insurance/forms");
    // Find the specific form type or return the first one if no type specified
    if (formType) {
      const form = response.data.find(
        (form: FormStructure) => form.formId === formType
      );
      return form || response.data[0];
    }
    return response.data[0];
  } catch (error) {
    console.error("Error fetching form structure:", error);
    throw error;
  }
};

export const submitForm = async (
  formData: FormData
): Promise<{ success: boolean; id: string }> => {
  const response = await api.post("/insurance/forms/submit", formData);
  return response.data;
};

/**
 * Get submissions data
 * @returns Table data with columns and rows
 */
export const getSubmissions = async (): Promise<TableResponse> => {
  try {
    const response = await api.get("/insurance/forms/submissions");
    return response.data;
  } catch (error) {
    console.error("Error fetching submissions:", error);
    throw error;
  }
};

/**
 * Get states for a specific country
 * @param country - The country code (e.g., "USA")
 * @returns List of states as objects with label and value properties
 */
export const getStates = async (
  country: string
): Promise<{ label: string; value: string }[]> => {
  try {
    const response = await api.get(
      `/getStates?country=${encodeURIComponent(country)}`
    );

    // Transform the API response into the format expected by our form components
    if (response.data && Array.isArray(response.data.states)) {
      return response.data.states.map((state: string) => ({
        label: state,
        value: state,
      }));
    }

    return [];
  } catch (error) {
    console.error(`Error fetching states for country ${country}:`, error);
    return [];
  }
};

// export const saveDraft = async (
//   formData: FormData
// ): Promise<{ success: boolean; id: string }> => {
//   const response = await api.post("/forms/drafts", formData);
//   return response.data;
// };

// export const getDraft = async (id: string): Promise<FormData> => {
//   const response = await api.get(`/forms/drafts/${id}`);
//   return response.data;
// };

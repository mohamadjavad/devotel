import { useQuery } from "@tanstack/react-query";
import { getFormStructure } from "../services/api";
import { FormStructure } from "../types/form";

interface UseFormStructureProps {
  formType?: string;
}

export const useFormStructure = ({ formType }: UseFormStructureProps = {}) => {
  const { data, isLoading, error, refetch } = useQuery<FormStructure>({
    queryKey: ["formStructure", formType],
    queryFn: () => getFormStructure(formType),
  });

  return {
    formStructure: data,
    isLoading,
    error,
    refetch,
  };
};

export interface FormFieldOption {
  label?: string;
  value?: string | number | boolean;
}

export interface Visibility {
  dependsOn: string;
  condition: "equals" | "notEquals" | "contains" | "greaterThan" | "lessThan";
  value: string | number | boolean | (string | number | boolean)[];
}

export interface Validation {
  min?: number;
  max?: number;
  pattern?: string;
  message?: string;
}

export interface FormField {
  id: string;
  label: string;
  type: "text" | "number" | "select" | "radio" | "checkbox" | "date" | "group";
  required?: boolean;
  options?: (string | FormFieldOption)[];
  visibility?: Visibility;
  validation?: Validation;
  fields?: FormField[];
  isCountryField?: boolean;
  isStateField?: boolean;
}

export interface FormSection {
  id: string;
  title: string;
  fields: FormField[];
}

export interface FormStructure {
  formId: string;
  title: string;
  fields: FormField[];
}

export interface FormData {
  [key: string]: string | number | boolean | string[] | number[] | FormData;
}

export interface FormSubmission {
  id: string;
  type: string;
  applicantName: string;
  applicantAge?: number;
  status: "Pending" | "Approved" | "Rejected";
  city?: string;
  submittedAt: string;
  data: FormData;
  [key: string]: string | number | boolean | FormData | undefined;
}

export interface ColumnDefinition {
  id: string;
  label: string;
  accessor: string;
  sortable?: boolean;
  filterable?: boolean;
}

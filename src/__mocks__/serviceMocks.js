// Mock API services
export const getFormStructure = jest.fn(() =>
  Promise.resolve({
    formId: "test-form",
    title: "Test Form",
    fields: [
      {
        id: "fullName",
        type: "text",
        label: "Full Name",
        required: true,
      },
      {
        id: "email",
        type: "email",
        label: "Email Address",
        required: true,
      },
    ],
  })
);

export const getStates = jest.fn(() =>
  Promise.resolve([
    { value: "CA", label: "California" },
    { value: "NY", label: "New York" },
    { value: "TX", label: "Texas" },
  ])
);

export const submitForm = jest.fn(() =>
  Promise.resolve({
    success: true,
    id: "123456",
  })
);

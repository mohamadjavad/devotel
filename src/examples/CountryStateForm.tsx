import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { FC, useEffect, useState } from "react";
import * as Yup from "yup";
import { getStates } from "../services/api";

interface FormValues {
  country: string;
  state: string;
}

const countries = [
  { label: "United States", value: "USA" },
  { label: "Canada", value: "CAN" },
  { label: "Mexico", value: "MEX" },
  { label: "United Kingdom", value: "GBR" },
];

export const CountryStateForm: FC = () => {
  const [states, setStates] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const formik = useFormik<FormValues>({
    initialValues: {
      country: "",
      state: "",
    },
    validationSchema: Yup.object({
      country: Yup.string().required("Country is required"),
      state: Yup.string().when("country", {
        is: (country: string) => Boolean(country),
        then: (schema) => schema.required("State is required"),
        otherwise: (schema) => schema,
      }),
    }),
    onSubmit: (values) => {
      console.log("Form submitted:", values);
      alert(
        `Form submitted with Country: ${values.country}, State: ${values.state}`
      );
    },
  });

  // Fetch states when country changes
  useEffect(() => {
    const fetchStates = async () => {
      if (!formik.values.country) {
        setStates([]);
        return;
      }

      setLoading(true);
      try {
        const stateOptions = await getStates(formik.values.country);
        setStates(stateOptions);

        // Clear state selection if current selection is not in the new list
        if (
          formik.values.state &&
          !stateOptions.some((s) => s.value === formik.values.state)
        ) {
          formik.setFieldValue("state", "");
        }
      } catch (error) {
        console.error("Error fetching states:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStates();
  }, [formik.values.country]);

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 2 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Country and State Selection Example
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            This form demonstrates dynamic loading of states based on country
            selection.
          </Typography>

          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            noValidate
            sx={{ mt: 3 }}
          >
            <FormControl
              fullWidth
              margin="normal"
              error={Boolean(formik.touched.country && formik.errors.country)}
            >
              <InputLabel id="country-label">Country</InputLabel>
              <Select
                labelId="country-label"
                id="country"
                name="country"
                value={formik.values.country}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                label="Country"
              >
                {countries.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.country && formik.errors.country && (
                <Typography variant="caption" color="error">
                  {formik.errors.country}
                </Typography>
              )}
            </FormControl>

            <FormControl
              fullWidth
              margin="normal"
              error={Boolean(formik.touched.state && formik.errors.state)}
              disabled={!formik.values.country || loading}
            >
              <InputLabel id="state-label">State/Province</InputLabel>
              <Select
                labelId="state-label"
                id="state"
                name="state"
                value={formik.values.state}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                label="State/Province"
                endAdornment={
                  loading ? <CircularProgress size={20} sx={{ mr: 2 }} /> : null
                }
              >
                {states.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.state && formik.errors.state && (
                <Typography variant="caption" color="error">
                  {formik.errors.state}
                </Typography>
              )}
            </FormControl>

            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="submit"
                variant="contained"
                disabled={!formik.isValid || formik.isSubmitting}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

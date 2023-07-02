import * as yup from 'yup';

export const fileValidationSchema = yup.object().shape({
  name: yup.string().required(),
  content: yup.string().required(),
  header: yup.string().required(),
  delimiter: yup.string().required(),
  company_id: yup.string().nullable(),
});

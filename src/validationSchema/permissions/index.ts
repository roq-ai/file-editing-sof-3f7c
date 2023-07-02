import * as yup from 'yup';

export const permissionValidationSchema = yup.object().shape({
  can_edit: yup.boolean().required(),
  user_id: yup.string().nullable(),
  file_id: yup.string().nullable(),
});

import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getPermissionById, updatePermissionById } from 'apiSdk/permissions';
import { Error } from 'components/error';
import { permissionValidationSchema } from 'validationSchema/permissions';
import { PermissionInterface } from 'interfaces/permission';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { FileInterface } from 'interfaces/file';
import { getUsers } from 'apiSdk/users';
import { getFiles } from 'apiSdk/files';

function PermissionEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<PermissionInterface>(
    () => (id ? `/permissions/${id}` : null),
    () => getPermissionById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: PermissionInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updatePermissionById(id, values);
      mutate(updated);
      resetForm();
      router.push('/permissions');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<PermissionInterface>({
    initialValues: data,
    validationSchema: permissionValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Permission
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="can_edit" display="flex" alignItems="center" mb="4" isInvalid={!!formik.errors?.can_edit}>
              <FormLabel htmlFor="switch-can_edit">Can Edit</FormLabel>
              <Switch
                id="switch-can_edit"
                name="can_edit"
                onChange={formik.handleChange}
                value={formik.values?.can_edit ? 1 : 0}
              />
              {formik.errors?.can_edit && <FormErrorMessage>{formik.errors?.can_edit}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'user_id'}
              label={'Select User'}
              placeholder={'Select User'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.email}
                </option>
              )}
            />
            <AsyncSelect<FileInterface>
              formik={formik}
              name={'file_id'}
              label={'Select File'}
              placeholder={'Select File'}
              fetcher={getFiles}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'permission',
    operation: AccessOperationEnum.UPDATE,
  }),
)(PermissionEditPage);

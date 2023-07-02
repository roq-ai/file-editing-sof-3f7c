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
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createFile } from 'apiSdk/files';
import { Error } from 'components/error';
import { fileValidationSchema } from 'validationSchema/files';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { CompanyInterface } from 'interfaces/company';
import { getCompanies } from 'apiSdk/companies';
import { FileInterface } from 'interfaces/file';

function FileCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: FileInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createFile(values);
      resetForm();
      router.push('/files');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<FileInterface>({
    initialValues: {
      name: '',
      content: '',
      header: '',
      delimiter: '',
      company_id: (router.query.company_id as string) ?? null,
    },
    validationSchema: fileValidationSchema,
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
            Create File
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="name" mb="4" isInvalid={!!formik.errors?.name}>
            <FormLabel>Name</FormLabel>
            <Input type="text" name="name" value={formik.values?.name} onChange={formik.handleChange} />
            {formik.errors.name && <FormErrorMessage>{formik.errors?.name}</FormErrorMessage>}
          </FormControl>
          <FormControl id="content" mb="4" isInvalid={!!formik.errors?.content}>
            <FormLabel>Content</FormLabel>
            <Input type="text" name="content" value={formik.values?.content} onChange={formik.handleChange} />
            {formik.errors.content && <FormErrorMessage>{formik.errors?.content}</FormErrorMessage>}
          </FormControl>
          <FormControl id="header" mb="4" isInvalid={!!formik.errors?.header}>
            <FormLabel>Header</FormLabel>
            <Input type="text" name="header" value={formik.values?.header} onChange={formik.handleChange} />
            {formik.errors.header && <FormErrorMessage>{formik.errors?.header}</FormErrorMessage>}
          </FormControl>
          <FormControl id="delimiter" mb="4" isInvalid={!!formik.errors?.delimiter}>
            <FormLabel>Delimiter</FormLabel>
            <Input type="text" name="delimiter" value={formik.values?.delimiter} onChange={formik.handleChange} />
            {formik.errors.delimiter && <FormErrorMessage>{formik.errors?.delimiter}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<CompanyInterface>
            formik={formik}
            name={'company_id'}
            label={'Select Company'}
            placeholder={'Select Company'}
            fetcher={getCompanies}
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
    entity: 'file',
    operation: AccessOperationEnum.CREATE,
  }),
)(FileCreatePage);

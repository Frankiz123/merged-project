import * as yup from 'yup';

export const SGIN_UP_INIT_VALUES_VALIDATION_SCHEMA = yup.object({
  name: yup.string().required('Full Name is required').min(5, 'Full Name is not valid'),
  email: yup.string().email('Email must bs a valid email address').required('Email is required'),
  password: yup
    .string()
    .min(7, 'Password must be at least 7 characters')
    .matches(/(.*[0-9].*)|([!@#$%^&*])/, 'One number or special Character')
    .required('Password is required'),
});

export const SGIN_IN_INIT_VALUES_VALIDATION_SCHEMA = yup.object({
  email: yup.string().email('Email must bs a valid email address').required('Email is required'),
  password: yup
    .string()
    .min(7, 'Password must be at least 7 characters')
    .matches(/(.*[0-9].*)|([!@#$%^&*])/, 'One number or special Character')
    .required('Password is required'),
});

export const FORGOT_PASSWORD_INIT_VALUES_VALIDATION_SCHEMA = yup.object({
  email: yup.string().email('Email must bs a valid email address').required('Email is required'),
});

export const AUTHORISATION_INIT_VALUES_SCHEMA = yup.object({
  optNumbers: yup.string().required('Code is required'),
});

export const USER_DETAILS_INFORMATION_PAYMENT_SCHEMA = yup.object({
  addressLine: yup.string().required('Address Line is required'),
  address: yup.string(),
  country: yup.string().required('Country is required'),
  city: yup.string().required('City is required'),
  postalCode: yup.string().required('Zip/Postal code is required'),
  organizationName: yup.string().required('Organization Name is required'),
  vat: yup.string(),
});

export const USER_PAYMENNT_METHOD_INFORMATION_SCHEMA = yup.object({
  paymentMethod: yup.string(),
  cardNumber: yup.string().required('Card Number is required'),
  cvcNumber: yup.string().required('CVC Number is required'),
});

export const USER_PAYMENNT_SCHEDULE_INFORMATION_SCHEMA = yup.object({
  annually: yup.string(),
  monthly: yup.string(),
});

export const CREATE_LINK_FORM_SCHEMA = yup.object({
  title: yup.string(),
  domain: yup.string().required('Domain is required'),
  shortHandle: yup
    .string()
    .test('space-text', 'Short Handle cannot contains space or special characters', value => {
      const pattern = /[^a-zA-Z0-9]/;
      if (value?.includes(' ') || pattern.test(value || '')) {
        return false;
      }
      return true;
    })
    .test('length-text', 'Short Handle should be more than 3 characters', value => {
      if (!value) {
        return true;
      }
      return value.length > 3;
    }),
  webUrl: yup.string().matches(/^$|^(https:\/\/)?([\w]+\.)?\w+\.\w{2,3}(?:\.\w{2})?(\/.*)?$/, 'Please enter a valid application link'),
  source: yup.string(),
  medium: yup.string(),
  campaign: yup.string(),
  term: yup.string(),
  content: yup.string(),
  utmTagPreview: yup.string(),
  iOSMobile: yup
    .string()
    .nullable()
    .when(['webUrl', 'iOSTablet', 'androidMobile', 'androidTablet', 'huaweiMobile', 'huaweiTablet'], {
      is: (webUrl: string, iOSTablet: string, androidMobile: string, androidTablet: string, huaweiMobile: string, huaweiTablet: string) =>
        !webUrl && !iOSTablet && !androidMobile && !androidTablet && !huaweiMobile && !huaweiTablet,
      then: yup.string().required('Please fill at least one of the field'),
      otherwise: yup.string().nullable(),
    })
    .matches(/^$|^(https:\/\/)?([\w]+\.)?\w+\.\w{2,3}(?:\.\w{2})?(\/.*)?$/, 'Please enter a valid application link'),
  iOSTablet: yup
    .string()
    .nullable()
    .matches(/^$|^(https:\/\/)?([\w]+\.)?\w+\.\w{2,3}(?:\.\w{2})?(\/.*)?$/, 'Please enter a valid application link'),
  androidMobile: yup
    .string()
    .nullable()
    .matches(/^$|^(https:\/\/)?([\w]+\.)?\w+\.\w{2,3}(?:\.\w{2})?(\/.*)?$/, 'Please enter a valid application link'),
  androidTablet: yup
    .string()
    .nullable()
    .matches(/^$|^(https:\/\/)?([\w]+\.)?\w+\.\w{2,3}(?:\.\w{2})?(\/.*)?$/, 'Please enter a valid application link'),
  huaweiMobile: yup
    .string()
    .nullable()
    .matches(/^$|^(https:\/\/)?([\w]+\.)?\w+\.\w{2,3}(?:\.\w{2})?(\/.*)?$/, 'Please enter a valid application link'),
  huaweiTablet: yup
    .string()
    .nullable()
    .matches(/^$|^(https:\/\/)?([\w]+\.)?\w+\.\w{2,3}(?:\.\w{2})?(\/.*)?$/, 'Please enter a valid application link'),
  customUrl: yup.string(),
  logo: yup.string(),
  triggerWebUrlInBrowser: yup.boolean(),
});

export const ADD_LINK_SCHEMA = yup.object({
  url: yup
    .string()
    .required('Url is required')
    .matches(/^$|^(https:\/\/)?([\w]+\.)?\w+\.\w{2,3}(?:\.\w{2})?(\/.*)?$/, 'Please enter a valid application link'),
});

export const ADD_CAMPAIGN_SCHEMA = yup.object({
  id: yup.string(),
  folderName: yup.string().required('Folder Name is required'),
  links: yup.array().of(yup.string()).min(1, 'At least one link is required').required('At least one link is required'),
});

export const ACCOUNT_SETTING_SCHEMA = yup.object({
  email: yup.string().email('Email must bs a valid email address').required('Email is required'),
  fullName: yup.string().required('Full Name is required'),
  accountLanguage: yup.string().required('Language is required'),
  // additionalAdress: yup.string().required('Additional Adress is required'),
  // organizationName: yup.string().required('Organization Name is required'),
  // zip: yup.string().required('zip is required'),
  // vat: yup.string().required('vat is required'),
  // city: yup.string().required('City is required'),
  // adress: yup.string().required('Adress is required'),
  // country: yup.string().required('Country is required'),
});

export const ADD_DOMAIN_SCHEMA = yup.object({
  name: yup.string().required('Domain name is required'),
});

export const EDIT_CAMPAIGN_SCHEMA = yup.object({
  folderName: yup.string().required('Folder Name is required'),
  links: yup.array().of(yup.string()).min(1, 'At least one link is required').required('At least one link is required'),
  userId: yup.string(),
});

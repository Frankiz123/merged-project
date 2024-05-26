import React, { useEffect, useState, ChangeEventHandler } from 'react';

import { TextField } from '@mui/material';
import { FormikErrors } from 'formik';
import { styled } from '@mui/material/styles';

import styles from './textField.module.scss';
import Text from '@components/Text';

const MuiTextField = styled(TextField)(() => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#FAFAFC',
    '&.Mui-focused fieldset': {
      borderColor: '#CBCBCB',
    },
    '&.Mui-error fieldset': {
      borderColor: '#ec321f',
    },
  },
}));

interface TextFieldBoxProps {
  name: string;
  label: string;
  value: string | undefined;
  disabled: boolean;
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  error?: boolean;
  fullWidth?: boolean;
  helperText?: string | string[] | FormikErrors<unknown> | Array<FormikErrors<unknown>> | undefined;
  id?: string;
  InputProps?: {
    endAdornment?: React.ReactNode;
    startAdornment?: React.ReactNode;
  };
  multiline?: boolean;
  rows?: number;
  type?: string;
  autoFocus?: boolean;
  autoComplete?: string;
  placeholder?: string;
  labelCheck?: boolean;
  className?: string;
  textFieldLarge?: boolean;
}

const TextFieldBox: React.FC<TextFieldBoxProps> = ({
  name,
  label,
  value,
  disabled,
  onChange,
  error = false,
  className = '',
  fullWidth = true,
  helperText = undefined,
  id = '',
  InputProps = {},
  multiline = false,
  rows = 1,
  type = 'text',
  autoFocus = false,
  autoComplete = 'off',
  labelCheck = true,
  placeholder = '',
  textFieldLarge = false,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (helperText !== undefined) {
      if (Array.isArray(helperText)) {
        setErrorMessage(JSON.stringify(helperText[0]));
      } else if (typeof helperText === 'string') {
        setErrorMessage(helperText);
      }
    } else {
      setErrorMessage(undefined);
    }
  }, [helperText]);

  return (
    <>
      {labelCheck ? <Text text={label} variant='subtitle1' className={styles.labelTextField} /> : <></>}
      <MuiTextField
        autoFocus={autoFocus}
        className={[textFieldLarge ? styles.inputTextFieldLarge : styles.inputTextField, className].join(' ')}
        rows={rows}
        fullWidth={fullWidth}
        name={name}
        placeholder={placeholder}
        value={value}
        error={error}
        id={id || name}
        disabled={disabled}
        onChange={onChange}
        multiline={multiline}
        helperText={errorMessage}
        inputProps={{
          autoComplete: 'off',
          form: {
            autoComplete: 'off',
          },
        }}
        InputProps={value ? InputProps : {}}
        type={type}
        autoComplete={autoComplete}
      />
    </>
  );
};

export default TextFieldBox;

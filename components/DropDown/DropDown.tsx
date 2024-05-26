import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import { FormikErrors } from 'formik';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { FormControl, FormHelperText, InputLabel, MenuItem } from '@mui/material';

import Text from '@components/Text';

import styles from './DropDown.module.scss';

const ArrowDown = '/images/arrowdown2.svg';

interface DropDownComponentProps {
  defaultLabel?: string;
  label?: string;
  selectedValue: string;
  placeHolder?: string;
  className?: string;
  fullWidth?: boolean;
  error?: boolean;
  helperText?: string | string[] | FormikErrors<unknown> | Array<FormikErrors<unknown>> | undefined;
  startIcon?: string;
  data: Array<{ id: number; label: string; value: string }>;
  loading?: boolean;
  handleChangeValue: (event: unknown) => void;
}

const DropDownComponent: React.FC<DropDownComponentProps> = ({
  defaultLabel = '',
  helperText = undefined,
  error = false,
  label = '',
  selectedValue = '',
  className = '',
  fullWidth = true,
  startIcon = '',
  placeHolder = '',
  data = [{ id: 1, label: '', value: '' }],
  loading = false,
  handleChangeValue = (_e: SelectChangeEvent) => {},
}) => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [icon, setIcon] = useState(startIcon);
  const [labelDisplay, setLabelDisplay] = useState(true);

  const handleChange = (event: SelectChangeEvent): void => {
    handleChangeValue(JSON.parse(event.target.value));
    setIcon(ArrowDown);
  };

  const renderValue = (): React.ReactElement | string => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const d: any = data.find(i => {
      return i.value === selectedValue;
    })?.label;

    if (!selectedValue) {
      return <Text variant={'subtitle1'} text={defaultLabel} />;
    }
    return d;
  };

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

  const onBlur = (): void => {
    setLabelDisplay(true);
  };

  const onFocus = (): void => {
    setLabelDisplay(false);
  };

  return (
    <Box className={[styles.container, className].join(' ')}>
      <Text text={label} variant='subtitle1' className={styles.labelTextField} />
      <FormControl fullWidth={fullWidth}>
        {labelDisplay && <InputLabel className={styles.placeHolderStyles}>{placeHolder}</InputLabel>}
        <Select
          disabled={loading}
          onBlur={onBlur}
          onFocus={onFocus}
          className={[styles.select, errorMessage ? styles.borderColorOnError : ''].join(' ')}
          value={selectedValue}
          onChange={handleChange}
          renderValue={renderValue}
          error={error}
          displayEmpty
          IconComponent={() => (icon ? <img src={icon} /> : <img src={ArrowDown} />)}
          inputProps={{ 'aria-label': 'Without label' }}>
          {data?.map(value => (
            <MenuItem key={value.id} value={`${JSON.stringify(value)}`}>
              <Text variant={'subtitle1'} text={value.label} />
            </MenuItem>
          ))}
        </Select>
        <FormHelperText className={styles.error}>{errorMessage}</FormHelperText>
      </FormControl>
    </Box>
  );
};

export default DropDownComponent;

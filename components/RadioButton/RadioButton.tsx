import React from 'react';

import { FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material';

import styles from './RadioButton.module.scss';

interface RadioButtonProps {
  value: string;
  data: Array<{ value: string; label: string }>;
  onChange: (event: string) => void;
}

const RadioButton: React.FC<RadioButtonProps> = ({ value = '', data = [{ value: '', label: '' }], onChange = () => {} }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    onChange((event.target as HTMLInputElement).value);
  };

  return (
    <FormControl>
      <RadioGroup row defaultValue={'annually'} onChange={handleChange} value={value} color='secondary' name='row-radio-buttons-group'>
        {data.map((val, index) => (
          <FormControlLabel
            key={index}
            value={val.value}
            color='secondary'
            className={styles.radioText}
            control={<Radio color={'secondary'} />}
            label={val.label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default RadioButton;

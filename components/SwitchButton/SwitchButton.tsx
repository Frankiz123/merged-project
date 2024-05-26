import React from 'react';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import { Lens } from '@mui/icons-material';

interface SwitchButtonComponentInterface {
  labelName?: string;
  checked: boolean;
  className?: string;
  onChange: (checked: boolean) => void;
}

const CustomSwitch = styled(Switch)(({ theme }) => ({
  padding: 0,
  paddingLeft: 5,
  width: 40,
  height: 20,
  marginRight: 20,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(19px)',
      '& + .MuiSwitch-track': {
        backgroundColor: '#3AE17E',
        opacity: 1,
        border: 0,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    width: 18,
    height: 18,
    boxShadow: 'none',
  },
  '& .MuiSwitch-track': {
    borderRadius: 20 / 2,
    backgroundColor: '#C4C4C4',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: theme.transitions.duration.shortest,
    }),
  },
}));

const SwitchButtonComponent: React.FC<SwitchButtonComponentInterface> = ({
  labelName = '',
  checked = false,
  className = '',
  onChange = () => {},
}) => {
  const onHandleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    onChange(event.target.checked);
  };

  return (
    <FormGroup className={className}>
      <FormControlLabel
        control={
          <CustomSwitch
            color='success'
            size='small'
            value={checked}
            checked={checked}
            onChange={onHandleChange}
            icon={<Lens style={{ fontSize: 18, color: '#ffff' }} />}
            checkedIcon={<Lens style={{ fontSize: 18, color: '#ffff' }} />}
          />
        }
        label={labelName}
      />
    </FormGroup>
  );
};

export default SwitchButtonComponent;

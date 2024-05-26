import React, { useState } from 'react';

import { Grid, ListItemButton, ListItemAvatar, ListItemText } from '@mui/material';

import styles from './countcard.module.scss';

interface Buttonprops {
  data?: Array<{ label: string; icon: string; value: string }>;
  setSelectedClicks: (value: string) => void;
}

const ListButton: React.FC<Buttonprops> = ({ data, setSelectedClicks }) => {
  const [selected, setSelected] = useState(1);

  return (
    <Grid className={styles.container}>
      {data?.map((item, i) => (
        <ListItemButton
          key={i + 1}
          className={styles.btnContainer}
          selected={selected === i + 1}
          onClick={() => {
            setSelectedClicks(item.value);
            setSelected(i + 1);
          }}>
          <ListItemAvatar className={styles.listIconContainer}>
            <img src={item.icon} />
          </ListItemAvatar>
          <ListItemText primary={item.label} />
        </ListItemButton>
      ))}
    </Grid>
  );
};

export default ListButton;

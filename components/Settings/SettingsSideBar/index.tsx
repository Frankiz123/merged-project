import React, { useEffect, useState } from 'react';

import { List, ListItemText, ListItemButton, ListItemAvatar } from '@mui/material';

import { settingData } from '@utils/settings';
import { settingSideBarStyles as styles } from '@components/Settings';
import { useAuth } from '@context/AuthContext';

interface SettingsSideBarProps {
  currentTab: (val: string) => void;
  selectedTab: number;
}

const SettingsSideBar: React.FC<SettingsSideBarProps> = ({ currentTab, selectedTab }) => {
  const [selected, setSelected] = useState(1);
  const { isMobile, handleAppBar, open } = useAuth();

  useEffect(() => {
    if (selectedTab) setSelected(selectedTab + 1);
  }, [selectedTab]);

  return (
    <List className={styles.listWrapper}>
      {settingData.map((v, i) => (
        <ListItemButton
          key={i + 1}
          className={[styles.listItemButton, 'settingList'].join(' ')}
          selected={selected === i + 1}
          onClick={() => {
            currentTab(v.name);
            setSelected(i + 1);
            if (isMobile) handleAppBar(!open);
          }}>
          {!isMobile && (
            <ListItemAvatar className={styles.listIconContainer}>
              <img src={v.icon} />
            </ListItemAvatar>
          )}
          <ListItemText className={styles.listItem} primary={v.title} secondary={v.description} />
        </ListItemButton>
      ))}
    </List>
  );
};

export default SettingsSideBar;

import React, { useEffect } from 'react';

import { usePathname } from 'next/navigation';
import { styled } from '@mui/material/styles';
import {
  Box,
  List as MUIList,
  ListItem as MUIListItem,
  ListItemButton as MUIListItemButton,
  ListItemText as MUIListItemText,
} from '@mui/material';
import Router, { useRouter } from 'next/router';

import { DrawerBoxProps, ListItemButtonProps, ListItemType, SideBarItemProps, SidebarProps } from '@interfaces/drawer';
import { LIST_ITEMS } from '@utils/routes';
import { useAuth } from '@context/AuthContext';
import { settingData } from '@utils/settings';
import { useProtected } from '@context/ProtectedContext';
import { SettingsSideBar } from '@components/Settings';
import TrialPeriod from '@components/TrialPeriod';

const DrawerBox = styled(Box, {
  shouldForwardProp: prop => prop !== 'open',
})<DrawerBoxProps>(({ open }) => ({
  height: '100%',
  backgroundColor: '#F8F8F8',
  transitionDuration: '0.3s',
  padding: open ? '0px 50px' : '0px 20px',
  '@media (max-width: 1370px)': {
    padding: open ? '0px 25px' : '0px 20px',
    height: '100%',
  },
}));

const List = styled(MUIList)(() => ({}));

const ListItem = styled(MUIListItem)(() => ({
  marginTop: '20px',
}));

const ListItemButton = styled(MUIListItemButton, {
  shouldForwardProp: prop => prop !== 'isActive',
})<ListItemButtonProps>(({ isActive, open }) => ({
  backgroundColor: isActive ? '#232323' : 'transparent',
  borderRadius: '10px',
  minHeight: 48,
  width: open ? 'auto' : '48px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  '&:hover': {
    backgroundColor: isActive ? '#232323' : 'transparent',
  },
  '@media (max-width: 899px)': {
    maxWidth: 196,
    border: 'none',
    backgroundColor: isActive ? '#F4F4F4' : 'transparent',
    position: 'relative',
    '::after': {
      content: "''",
      position: 'absolute',
      left: 0,
      top: 14,
      bottom: 14,
      width: 4,
      backgroundColor: 'black',
      transform: 'translateX(-50%)',
      opacity: isActive ? 1 : 0,
      transition: 'opacity 0.3s ease',
      borderTopRightRadius: '10px',
      borderBottomRightRadius: '10px',
    },
    '&:hover': {
      backgroundColor: isActive && '#F4F4F4',
    },
  },
}));

const ListItemIcon = styled('img')<{ isActive: boolean; open: boolean }>(({ isActive, open }) => ({
  marginRight: open ? '15px' : '0px',
  filter: isActive
    ? 'invert(99%) sepia(100%) saturate(0%) hue-rotate(261deg) brightness(105%) contrast(100%)'
    : 'invert(11%) sepia(4%) saturate(0%) hue-rotate(349deg) brightness(100%) contrast(92%)',
  '&:hover': {
    filter: isActive
      ? 'invert(99%) sepia(100%) saturate(0%) hue-rotate(261deg) brightness(105%) contrast(100%)'
      : 'invert(11%) sepia(4%) saturate(0%) hue-rotate(349deg) brightness(100%) contrast(92%)',
  },
  '@media (max-width: 899px)': {
    filter: isActive && 'invert(11%) sepia(4%) saturate(0%) hue-rotate(349deg) brightness(100%) contrast(92%)',
    '&:hover': {
      filter: isActive && 'none',
    },
  },
}));

const ListItemText = styled(MUIListItemText, {
  shouldForwardProp: prop => prop !== 'isActive',
})<{ isActive: boolean }>(({ isActive }) => ({
  color: isActive ? '#FFFFFF' : '#232323',
  '&:hover': {
    color: isActive ? '#FFFFFF' : '#232323',
  },
  '@media (max-width: 899px)': {
    color: isActive ? '#232323' : '#232323',
    '&:hover': {
      color: isActive && '#232323',
    },
  },
}));

const Sidebar: React.FC<SidebarProps> = ({ open = false }) => {
  const pathname = usePathname();
  const { tab } = Router.query;
  const { isMobile, trialDays } = useAuth();
  const { handleCurrentTab, currentTab } = useProtected();

  const val = pathname.substring(1);
  const isSettingsActive = val === 'settings';

  useEffect(() => {
    if (tab) {
      handleCurrentTab(String(tab));
    }
  }, [tab]);

  const selectedIndex = settingData.findIndex(obj => obj.name === String(currentTab));

  return (
    <DrawerBox open={open} sx={{ marginLeft: '0px' }}>
      <List>
        {LIST_ITEMS.map((item: ListItemType) => (
          <SideBarItem key={item.id.toString()} open={open} {...item} />
        ))}
      </List>
      {isMobile && isSettingsActive && (
        <Box sx={{ paddingBottom: '100px' }}>
          <SettingsSideBar currentTab={handleCurrentTab} selectedTab={selectedIndex <= 0 ? 0 : selectedIndex} />
        </Box>
      )}
      {trialDays > 0 && (
        <Box
          sx={{
            paddingBottom: isMobile ? '40px' : '0px',
          }}>
          {' '}
          <TrialPeriod days={trialDays} open={open} />
        </Box>
      )}
    </DrawerBox>
  );
};

const SideBarItem: React.FC<SideBarItemProps> = ({ id, label, image, route }) => {
  const { pathname } = useRouter();
  const { isMobile, open, handleAppBar } = useAuth();

  const onItemClick = (): void => {
    const isSettingsActive = route === '/settings';
    void Router.push(route);
    if (!isSettingsActive) {
      if (isMobile) {
        handleAppBar(!open);
      }
    }
  };

  return (
    <ListItem key={id} disablePadding>
      <ListItemButton onClick={onItemClick} isActive={pathname === route} open={open}>
        {!isMobile && <ListItemIcon src={image} isActive={pathname === route} open={!!open} />}
        {open ? (
          <>
            {isMobile && <ListItemIcon src={image} isActive={pathname === route} open={!!open} />}
            <ListItemText primary={label} isActive={pathname === route} />
          </>
        ) : (
          <></>
        )}
      </ListItemButton>
    </ListItem>
  );
};

export default React.memo(Sidebar);

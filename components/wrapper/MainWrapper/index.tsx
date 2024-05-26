import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

import { styled, Theme, CSSObject } from '@mui/material/styles';
import { Box, Popover, Toolbar, IconButton, Drawer as MuiDrawer, AppBar as MuiAppBar } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import MenuIcon from '@mui/icons-material/Menu';
import useMediaQuery from '@mui/material/useMediaQuery';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-toastify';

import Text from '@components/Text';
import Sidebar from '@components/Sidebar';
import ActionButton from '@components/ActionButton';
import { AppBarProps as MuiAppBarProps, DrawerBoxProps } from '@interfaces/drawer';
import { useAuth } from '@context/AuthContext';
import { useProtected } from '@context/ProtectedContext';
import { PROTECTED_ROUTES } from '@utils/routes';
import styles from './mainwrapper.module.scss';
import { MERGE_LINKS } from '@utils/mergeLinks';
import NotificationBar from '@components/NotificationBar';

const CreateLinkForm = dynamic(async () => await import('../../Links/CreateLinkForm/CreateLinkForm'));

const UserIcon = '/images/user.svg';
const LogoutIcon = '/images/log-out.svg';
const GiftIcon = '/images/gift.svg';
const FileIcon = '/images/file-text.svg';
const UserDarkIcon = '/images/userDark.svg';
const CancelIcon = '/images/cancel.svg';

const drawerWidth = 350;
const drawerCloseWidth = 98;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  backgroundColor: '#F8F8F8',
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  '@media (max-width: 1370px)': {
    width: 240,
  },
  '@media (max-width: 899px)': {
    position: 'fixed',
    zIndex: 99,
    width: 304,
    border: 'none',
  },
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `${drawerCloseWidth}px`,
});

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: '#FFFFFF',
  boxShadow: 'none',
  borderBottomColor: '#CBCBCB',
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  minHeight: '77px',
  ...(open
    ? {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
      }
    : {
        marginLeft: `${drawerCloseWidth}px`,
        width: `calc(100% - ${drawerCloseWidth}px)`,
      }),
  '@media (max-width: 1370px)': {
    ...(open
      ? {
          marginLeft: 240,
          width: `calc(100% - ${240}px)`,
        }
      : {
          marginLeft: `${drawerCloseWidth}px`,
          width: `calc(100% - ${drawerCloseWidth}px)`,
        }),
  },
}));

const DrawerIconButton = styled(IconButton)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 100,
  position: 'absolute',
  top: '68%',
  left: '-23px',
  backgroundColor: '#F8F8F8',
  border: 'solid 2px #FFFFFF',
  borderRadius: '8px',
  transitionDuration: '0.3s',
  '&:focus': {
    backgroundColor: '#F8F8F8',
  },
  '&:active': {
    backgroundColor: '#F8F8F8',
  },
  '&:hover': {
    backgroundColor: '#F8F8F8',
  },
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: prop => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  border: 'none',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

const DrawerHeader = styled('div', {
  shouldForwardProp: prop => prop !== 'open',
})<DrawerBoxProps>(({ open }) => ({
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  padding: open ? '0px 70px 1px 0px' : '0px 5px 10px 0px',
  '@media (max-width: 1370px)': {
    padding: open ? '0px 40px 1px 00px' : '0px 5px 5px 0px',
  },
  backgroundColor: '#F8F8F8',
  height: '122px',
  transitionDuration: '0.3s',
  border: 'none',
}));

const DrawerImage = styled('img')(() => ({
  transitionDuration: '0.3s',
}));

const HeaderImage = styled('img')(() => ({
  transitionDuration: '0.3s',
  marginTop: -1,
}));

const MainWrapper: React.FC = ({ children }) => {
  const router = useRouter();

  const isDesktop = useMediaQuery('(min-width:900px)');

  const { logOut, user, userActivePlan, isMobile, open, handleAppBar, trialDays, userPlan, handleTrialDays } = useAuth();

  const { isAllowedLinks, openModal, handleModal } = useProtected();
  const ref = useRef<HTMLDivElement | null>(null);

  const [isDropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const [showNotification, setShowNotification] = useState<boolean>(true);
  useEffect(() => {
    localStorage.setItem('drawerState', open ? 'open' : 'closed');
  }, [open]);

  const handleDrawer = (): void => {
    handleAppBar(!open);
  };

  const handleOpen = (): void => {
    if (isMobile) handleAppBar(false);
    if (isAllowedLinks) {
      handleModal();
      return;
    }
    toast('You have consumed all of your available links. Please upgrade your package if you want to create more', {
      type: 'error',
      autoClose: 3000,
    });
  };

  const handleClose = (): void => {
    handleModal();
  };

  const handleDropdownOpen = (): void => {
    setDropdownOpen(true);
  };

  const handleDropdownClose = (): void => {
    setDropdownOpen(false);
  };

  const handleLogout = (): void => {
    void (async (): Promise<void> => {
      await logOut();
    })();
    localStorage.removeItem('notificationBar');
  };

  const onUpgrade = (): void => {
    void router.push(PROTECTED_ROUTES.plans);
  };

  const handleCloseNotification = (): void => {
    setShowNotification(false);
    localStorage.setItem('notificationBar', 'hide');
  };

  const showNotificationBar = localStorage.getItem('notificationBar');

  const handleUpgrade = (): void => {
    void router.push(PROTECTED_ROUTES.plans);
  };

  let daysDifference = 0;
  const currentDate: Date = new Date();

  useEffect(() => {
    if (userPlan?.trial_ended) {
      const endDate: Date = userPlan?.trial_ended.toDate();
      const timeDifferenceMilliseconds: number = endDate.getTime() - currentDate.getTime();
      daysDifference = Math.ceil(timeDifferenceMilliseconds / (1000 * 60 * 60 * 24));
      handleTrialDays(daysDifference);
    }
  }, [trialDays]);

  return (
    <>
      {trialDays > 0 && showNotification && isMobile && showNotificationBar !== 'hide' && (
        <NotificationBar
          text={`Your free trial ends in ${trialDays} days.`}
          handleUpgrade={handleUpgrade}
          handleCloseNotification={handleCloseNotification}
        />
      )}
      <Box className={styles.main_wrapper}>
        <AppBar
          open={open}
          className={[
            styles.app_bar,
            trialDays > 0 && isMobile && showNotification && showNotificationBar !== 'hide' && styles.trialDaysMobile,
          ].join(' ')}>
          {trialDays > 0 && showNotification && !isMobile && showNotificationBar !== 'hide' && (
            <NotificationBar
              text={`Your free trial ends in ${trialDays} days. Are you happy? Nice!`}
              handleUpgrade={handleUpgrade}
              handleCloseNotification={handleCloseNotification}
            />
          )}
          <Toolbar
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
            }}>
            {isDesktop && (
              <DrawerIconButton onClick={handleDrawer}>
                <HeaderImage src={`/images/${open ? 'chevronsLeft' : 'chevronsRight'}.svg`} alt={'chevron-icon'} />
              </DrawerIconButton>
            )}
            <IconButton color='inherit' aria-label='Open drawer' onClick={handleDrawer} className={isMobile ? styles.menuButton : ''}>
              {open && isMobile ? <img src={CancelIcon} /> : <MenuIcon />}
            </IconButton>

            <div className={styles.navItems}>
              <ActionButton
                loading={false}
                startIcon={<AddCircleOutlineIcon />}
                isFull={true}
                type={'submit'}
                buttonLabel={'Add link'}
                className={styles.addLink}
                onClick={handleOpen}
              />
              <Image className={styles.mobileMainLogo} src={`/images/mainLogo.svg`} alt={'merged-to-logo'} width={100} height={37} />
              <Link className={styles.help} href={MERGE_LINKS.support} target='_blank' rel='noopener noreferrer'>
                <HelpOutlineIcon />
              </Link>
              <div className={styles.dropdownWrapper} onClick={handleDropdownOpen}>
                <div ref={ref} className={styles.circularBtnContainer}>
                  {user && user.photo ? (
                    <Image className={styles.userImage} src={user?.photo} width={45} height={45} alt='user profile image' />
                  ) : (
                    <Image src={UserIcon} width={19} height={19} alt='user profile image' />
                  )}
                </div>
              </div>
            </div>
          </Toolbar>
        </AppBar>
        {open && isMobile && (
          <Drawer variant='permanent' open={open} className={styles.drawer}>
            <ActionButton
              loading={false}
              startIcon={<AddCircleOutlineIcon />}
              isFull={false}
              type={'submit'}
              buttonLabel={'Add link'}
              className={[
                styles.addLinkMobile,
                trialDays > 0 && showNotification && showNotificationBar !== 'hide' && styles.addLinkTrialDaysMargin,
              ].join(' ')}
              onClick={handleOpen}
            />
            <Sidebar open={open} />
          </Drawer>
        )}
        {isDesktop && (
          <Drawer variant='permanent' open={open} className={styles.drawer}>
            <DrawerHeader open={open}>
              <DrawerImage
                src={`/images/${open ? 'mainLogo' : 'miniLogo'}.svg`}
                alt={'merged-to-logo'}
                className={trialDays > 0 && showNotification && showNotificationBar !== 'hide' ? styles.drawerImage : ''}
              />
            </DrawerHeader>
            <Sidebar open={open} />
          </Drawer>
        )}
        <Box
          className={[styles.main, trialDays > 0 && showNotification && showNotificationBar !== 'hide' && styles.mainTrialDaysMargin].join(
            ' '
          )}>
          {children}
        </Box>
      </Box>
      <CreateLinkForm open={openModal} handleClose={handleClose} />
      <Popover
        anchorEl={ref.current}
        onClose={handleDropdownClose}
        open={isDropdownOpen}
        style={{ top: '50px', right: '0px' }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{ style: { borderRadius: 8 } }}>
        <Box className={styles.box}>
          <Text variant={'subtitle1'} className={styles.title} text={user?.fullName ?? ''} />
          <Text variant={'subtitle1'} className={styles.email} text={user?.email ?? ''} />
          <Link className={[styles.row, styles.marginBottom].join(' ')} href={{ pathname: '/plans' }}>
            <Image src={UserDarkIcon} width={19} height={19} alt='account-icon' />
            <Box>
              <Text variant={'subtitle1'} className={styles.mainOption} text={'Account'} />
              <Box className={styles.row}>
                <Text variant={'subtitle1'} className={styles.accountType} text={userActivePlan?.planName ?? ''} />
                <Text onClick={onUpgrade} variant={'subtitle1'} className={styles.accontBadge} text={'Upgrade'} />
              </Box>
            </Box>
          </Link>
          <Link className={[styles.row, styles.marginBottom].join(' ')} href={{ pathname: '/settings', query: { tab: 'Payments' } }}>
            <Image src={FileIcon} width={19} height={19} alt='billing-and-invoices-icon' />
            <Text variant={'subtitle1'} className={styles.mainOption} text={'Billing & Invoices'} />
          </Link>
          <Link className={[styles.row, styles.marginBottom].join(' ')} href={{ pathname: '/settings', query: { tab: 'ReferAndEarn' } }}>
            <Image src={GiftIcon} width={19} height={19} alt='refer-and-earn-icon' />
            <Text variant={'subtitle1'} className={styles.mainOption} text={'Refer & Earn'} />
          </Link>
          <Box className={[styles.row, styles.marginBottom].join(' ')} onClick={handleLogout}>
            <Image src={LogoutIcon} width={19} height={19} alt='logout-icon' />
            <Text variant={'subtitle1'} className={styles.mainOption} text={'Logout'} />
          </Box>
        </Box>
      </Popover>
    </>
  );
};

export default MainWrapper;

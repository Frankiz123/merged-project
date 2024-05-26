import { BoxProps } from '@mui/material/Box';
import { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { ListItemButtonBaseProps } from '@mui/material';

export interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

export interface DrawerBoxProps extends BoxProps {
  open?: boolean;
}

export interface ListItemType {
  id: number;
  label: string;
  image: string;
  route: string;
}

export interface SidebarProps {
  open?: boolean;
}

export interface SideBarItemProps extends ListItemType, SidebarProps {}

export interface ListItemButtonProps extends ListItemButtonBaseProps, SidebarProps {
  isActive?: boolean;
}

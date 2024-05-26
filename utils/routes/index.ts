import { ListItemType } from '@interfaces/drawer';

export const AUTH_ROUTES = {
  root: '/',
  login: '/login',
  signup: '/signup',
  forgotPassword: '/forgot-password',
  helpCenter: '/help-center',
  invitation: '/invitation/[rid]',
};

export const PROTECTED_ROUTES = {
  signUpPayment: '/signup/payment',
  dashboard: '/dashboard',
  links: '/links',
  domains: '/domains',
  plans: '/plans',
  campaigns: '/groups',
  settings: '/settings',
  authorisation: '/authorisation',
  helpCenter: '/help-center',
};

export const LIST_ITEMS: ListItemType[] = [
  {
    id: 1,
    label: 'Dashboard',
    image: '/images/sidebar/dashboard.svg',
    route: PROTECTED_ROUTES.dashboard,
  },
  {
    id: 2,
    label: 'Links',
    image: '/images/sidebar/links.svg',
    route: PROTECTED_ROUTES.links,
  },
  {
    id: 5,
    label: 'Groups',
    image: '/images/sidebar/campaigns.svg',
    route: PROTECTED_ROUTES.campaigns,
  },
  // {
  //   id: 3,
  //   label: 'Domains',
  //   image: '/images/sidebar/domains.svg',
  //   route: PROTECTED_ROUTES.domains,
  // },
  {
    id: 4,
    label: 'Plans',
    image: '/images/sidebar/plans.svg',
    route: PROTECTED_ROUTES.plans,
  },

  {
    id: 6,
    label: 'Settings',
    image: '/images/sidebar/settings.svg',
    route: PROTECTED_ROUTES.settings,
  },
];

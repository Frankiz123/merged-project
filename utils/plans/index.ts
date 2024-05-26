export const FEATURES = [
  {
    value: 'QR-Code',
  },
  {
    value: 'Custom back-halves',
  },
  {
    value: 'Link click statistics',
  },
  {
    value: 'UTM Parameter',
  },
];

export const WORKSPACE = [
  {
    value: 'Up to 3 links',
  },
  {
    value: 'Up to 500 clicks/month',
  },
  {
    value: '1 User',
  },
];

export const WORKSPACE1 = [
  {
    value: 'Up to 3 links',
  },
  {
    value: '1 User',
  },
];

export const CardsInformationObjects = [
  {
    price: 0,
    disabled: true,
    recommend: true,
    title: 'Basic',
    time: 'forever',
    access: 'Access to:',
    workspace: 'Workspace',
    buttonLabel: 'Your Plan',
    workspaceItems: WORKSPACE,
    features: FEATURES,
    discription: 'For anyone to get started, free qr-code included',
  },
  {
    price: 9,
    disabled: false,
    recommend: true,
    title: 'Plus',
    time: 'month',
    access: 'Everything in Basic, and:',
    workspace: 'Workspace',
    buttonLabel: 'Upgrade',
    workspaceItems: WORKSPACE1,
    features: FEATURES,
    discription: 'For individuals and startups for promoting their apps',
  },

  {
    price: 29,
    disabled: false,
    recommend: false,
    title: 'Business',
    time: 'month',
    access: 'Everything in Plus, and:',
    workspace: 'Workspace',
    buttonLabel: 'Upgrade',
    workspaceItems: WORKSPACE,
    features: FEATURES,
    discription: 'For companies who need advanced marketing features',
  },
  {
    price: 99,
    disabled: false,
    recommend: true,
    title: 'Scale',
    time: 'month',
    access: 'Everything in Business, and:',
    workspace: 'Workspace',
    buttonLabel: 'Upgrade',
    workspaceItems: WORKSPACE,
    features: FEATURES,
    discription: 'For companies who need unlimited power.',
  },
];

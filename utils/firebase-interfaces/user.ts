import { Timestamp } from 'firebase/firestore';

export interface MergeUser {
  id: string;
  createdAt: Timestamp;
  email: string;
  fullName: string;
  accessToken?: string;
  emailVerified: boolean;
  zip?: string;
  vat?: string;
  city?: string;
  adress?: string;
  country?: string;
  accountLanguage?: string;
  additionalAdress?: string;
  organizationName?: string;
  photo?: string;
  twoFactorEmail?: boolean;
  userPlanId: string;
  invitationLink?: string;
  paymentTries: number;
  weeklyReport: boolean;
  monthlyReport: boolean;
  customer?: PaddleCustomer;
}

export interface PaddleCustomer {
  address: PaddleAddress;
  email: string;
  id: string;
}

export interface PaddleAddress {
  city: string;
  country_code: string;
  first_line: string;
  id: string;
  postal_code: string;
  region: string;
}

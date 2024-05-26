import { Timestamp } from 'firebase/firestore';

export interface MergeInvitation {
  createdAt: Timestamp;
  referralToken: string;
  referredID: string;
  userID: string;
  planPurchased: boolean;
  isPaid: boolean;
  id: string;
}

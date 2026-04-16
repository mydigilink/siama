export type CouponType = 'percentage' | 'flat';

export interface ICoupon {
  _id?: string;
  code: string;
  type: CouponType;
  value: number;
  maxDiscount?: number;
  minCartValue?: number;
  usageLimit?: number;
  usedCount?: number;
  perUserLimit?: number;
  validFrom?: string;
  validTill?: string;
  isActive: boolean;
  applicableServices?: string[];
  userType?: 'all' | 'new' | 'existing';
  firstOrderOnly?: boolean;
  stackable?: boolean;
}
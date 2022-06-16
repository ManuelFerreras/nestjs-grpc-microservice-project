import { Prop } from "@nestjs/mongoose";

export class CreateDiscountCouponDTO {
  readonly id: number;
  readonly amount: number;
  readonly active: boolean;
  readonly code: string;
  readonly last_updated: Date;
}
 
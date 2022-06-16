import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type DiscountCouponDocument = DiscountCoupon & Document;

@Schema()
export class DiscountCoupon {

  @Prop()
  id: number;

  @Prop()
  amount: number;
  
  @Prop()
  active: boolean;

  @Prop()
  code: string;

  @Prop()
  last_updated: Date;

}

export const DiscountCouponSchema =
  SchemaFactory.createForClass(DiscountCoupon);
 

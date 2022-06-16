import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { grpcClientOptions } from '../grpc-client.options';
import { CouponController } from './coupon.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { DiscountCouponSchema } from "src/schemas/discountCoupon.schema";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'COUPON_PACKAGE',
        ...grpcClientOptions,
      },
    ]),
    MongooseModule.forFeature([{ name: "DiscountCoupon", schema: DiscountCouponSchema }]),
  ],
  controllers: [CouponController],
})
export class CouponModule {}
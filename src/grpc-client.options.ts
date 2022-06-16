import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const grpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'coupon', // ['coupon', 'coupon2']
    protoPath: join(__dirname, './coupon/coupon.proto'), // ['./coupon/coupon.proto', './coupon/coupon2.proto']
  },
};
import { Controller, Get, Inject, OnModuleInit, Param, Post } from '@nestjs/common';
import {
  ClientGrpc,
  GrpcMethod,
  GrpcStreamMethod,
} from '@nestjs/microservices';
import { Observable, Subject } from 'rxjs';
import { CouponByCode } from './interfaces/coupon-by-id.interface';
import { Coupon } from './interfaces/coupon.interface';

import { InjectModel } from '@nestjs/mongoose';
import { DiscountCoupon, DiscountCouponDocument } from "src/schemas/discountCoupon.schema";
import { Model } from "mongoose";

interface CouponService {
  findOne(data: CouponByCode): Observable<Coupon>;
  findMany(upstream: Observable<CouponByCode>): Observable<Coupon>;
}

@Controller('coupon')
export class CouponController implements OnModuleInit {
  constructor(
    @Inject('COUPON_PACKAGE') private readonly client: ClientGrpc,
    @InjectModel("DiscountCoupon") private readonly discountCouponModel: Model<DiscountCouponDocument>
  ) {}


  private items: Coupon[];
  private couponService: CouponService;


  async onModuleInit() {
    this.items = await this.discountCouponModel.find({ active: true });
    this.couponService = this.client.getService<CouponService>('CouponService');

  }

  @Get('getCoupon/:code')
  getById(@Param('code') code: string): Observable<Coupon> {
    const coupon = this.couponService.findOne({ code: code });
    console.log(coupon);

    return coupon;
    
  }

  @Post('create/:amount/:code')
  async createDiscountCoupon(
    @Param('amount') amount: string,
    @Param('code') code: string,
  ) {

    const coupon = {
      amount: amount,
      active: true,
      code: code,
      last_updated: new Date(),
    }

    const newCoupon = await new this.discountCouponModel(coupon).save();
    this.items = await this.discountCouponModel.find({ active: true });
    console.log(this.items);
    

    return newCoupon;
  }

  @GrpcMethod('CouponService')
  findOne(data: CouponByCode): Coupon {
    const coupon = this.items.find(({ code }) => code === data.code);

    if (!coupon) return { amount: "0", code: "", message: "Error: No Coupon Found"}; else coupon.message = "OK";
    return coupon;
    
  }

  @GrpcStreamMethod('CouponService')
  findMany(data$: Observable<CouponByCode>): Observable<Coupon> {
    const coupon$ = new Subject<Coupon>();

    const onNext = (couponByCode: CouponByCode) => {
      const item = this.items.find(({ code }) => code === couponByCode.code);
      coupon$.next(item);
    };
    const onComplete = () => coupon$.complete();
    data$.subscribe({
      next: onNext,
      complete: onComplete,
    });

    return coupon$.asObservable();
  }
}
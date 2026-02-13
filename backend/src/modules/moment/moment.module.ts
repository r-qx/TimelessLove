import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MomentController } from './moment.controller';
import { MomentService } from './moment.service';
import { Moment, MomentSchema } from './schemas/moment.schema';
import { CoupleModule } from '../couple/couple.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Moment.name, schema: MomentSchema }]),
    CoupleModule,
  ],
  controllers: [MomentController],
  providers: [MomentService],
  exports: [MomentService],
})
export class MomentModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoupleController } from './couple.controller';
import { CoupleService } from './couple.service';
import { Couple, CoupleSchema } from './schemas/couple.schema';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Couple.name, schema: CoupleSchema }]),
    UserModule,
  ],
  controllers: [CoupleController],
  providers: [CoupleService],
  exports: [CoupleService],
})
export class CoupleModule {}

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { CoupleModule } from './modules/couple/couple.module';
import { TaskModule } from './modules/task/task.module';
import { ChatModule } from './modules/chat/chat.module';
import { MomentModule } from './modules/moment/moment.module';
import { RewardModule } from './modules/reward/reward.module';
import { AchievementModule } from './modules/achievement/achievement.module';
import { CommunityModule } from './modules/community/community.module';
import { UploadModule } from './modules/upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),

    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

    AuthModule,
    UserModule,
    CoupleModule,
    TaskModule,
    ChatModule,
    MomentModule,
    RewardModule,
    AchievementModule,
    CommunityModule,
    UploadModule,
  ],
})
export class AppModule {}

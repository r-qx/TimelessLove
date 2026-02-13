import { IsString, IsNotEmpty } from 'class-validator';

export class JoinCoupleDto {
  @IsString()
  @IsNotEmpty()
  inviteCode: string;
}

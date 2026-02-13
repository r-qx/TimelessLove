import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

class Intimacy {
  @Prop({ type: Number, default: 0 })
  communication: number;

  @Prop({ type: Number, default: 0 })
  cooperation: number;

  @Prop({ type: Number, default: 0 })
  romance: number;

  @Prop({ type: Number, default: 0 })
  understanding: number;

  @Prop({ type: Number, default: 0 })
  growth: number;
}

@Schema({ timestamps: false })
export class Couple extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user1_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user2_id: Types.ObjectId;

  @Prop({ type: Number })
  anniversary: number;

  @Prop({ type: Number, default: 1 })
  level: number;

  @Prop({ type: Number, default: 0 })
  love_points: number;

  @Prop({ type: Number, default: 0 })
  love_coins: number;

  @Prop({ type: Intimacy, default: {} })
  intimacy: Intimacy;

  @Prop({ type: String, enum: ['pending', 'active', 'cooling', 'disbanded'], default: 'pending' })
  status: string;

  @Prop({ type: String })
  invite_code: string;

  @Prop({ type: Number, default: () => Date.now() })
  created_at: number;

  @Prop({ type: Number, default: () => Date.now() })
  updated_at: number;
}

export const CoupleSchema = SchemaFactory.createForClass(Couple);

// 更新时自动设置 updated_at
CoupleSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

CoupleSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updated_at: Date.now() });
  next();
});

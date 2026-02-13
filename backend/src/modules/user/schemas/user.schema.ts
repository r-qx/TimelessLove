import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: false })
export class User extends Document {
  @Prop({ required: true, unique: true })
  openid: string;

  @Prop({ required: true })
  nickname: string;

  @Prop()
  avatar: string;

  @Prop({ type: Number, default: 0 })
  gender: number;

  @Prop({ type: Number })
  birthday: number;

  @Prop({ type: Types.ObjectId, ref: 'Couple' })
  couple_id: Types.ObjectId;

  @Prop({ type: Number, default: () => Date.now() })
  created_at: number;

  @Prop({ type: Number, default: () => Date.now() })
  updated_at: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

// 更新时自动设置 updated_at
UserSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

UserSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updated_at: Date.now() });
  next();
});

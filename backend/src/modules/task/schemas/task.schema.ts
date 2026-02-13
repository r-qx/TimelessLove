import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

class Proof {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  user_id: Types.ObjectId;

  @Prop()
  content: string;

  @Prop({ type: [String] })
  media: string[];

  @Prop({ type: Number })
  submitted_at: number;
}

class Punishment {
  @Prop()
  type: string;

  @Prop()
  description: string;
}

@Schema({ timestamps: false })
export class Task extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Couple', required: true })
  couple_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  creator_id: Types.ObjectId;

  @Prop({ type: String, enum: ['personal', 'cooperation', 'periodic', 'challenge'], required: true })
  type: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ type: Number, min: 1, max: 5, default: 1 })
  difficulty: number;

  @Prop({ type: Number, default: 10 })
  reward_points: number;

  @Prop({ type: Number, default: 5 })
  reward_coins: number;

  @Prop({ type: Number })
  deadline: number;

  @Prop({ type: [String], default: ['text'] })
  proof_type: string[];

  @Prop({ type: Punishment })
  punishment: Punishment;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: String, enum: ['pending', 'approved', 'in_progress', 'completed', 'verified', 'failed'], default: 'pending' })
  status: string;

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  participants: Types.ObjectId[];

  @Prop({ type: Proof })
  proof: Proof;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  verified_by: Types.ObjectId;

  @Prop({ type: Number })
  verified_at: number;

  @Prop({ type: Number, default: () => Date.now() })
  created_at: number;

  @Prop({ type: Number, default: () => Date.now() })
  updated_at: number;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

// 更新时自动设置 updated_at
TaskSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

TaskSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updated_at: Date.now() });
  next();
});

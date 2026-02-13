import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: false })
export class Message extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Couple', required: true })
  couple_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sender_id: Types.ObjectId;

  @Prop({ type: String, enum: ['text', 'image', 'voice', 'video', 'task', 'system'], default: 'text' })
  type: string;

  @Prop()
  content: string;

  @Prop()
  media_url: string;

  @Prop()
  emotion: string;

  @Prop({ type: Types.ObjectId, ref: 'Task' })
  related_task_id: Types.ObjectId;

  @Prop({ type: Boolean, default: false })
  is_read: boolean;

  @Prop({ type: Number, default: () => Date.now() })
  created_at: number;

  @Prop({ type: Number, default: () => Date.now() })
  updated_at: number;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

// 更新时自动设置 updated_at
MessageSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

MessageSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updated_at: Date.now() });
  next();
});

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

class Media {
  @Prop({ type: String, enum: ['image', 'video'] })
  type: string;

  @Prop()
  url: string;
}

class Location {
  @Prop()
  name: string;

  @Prop({ type: Number })
  latitude: number;

  @Prop({ type: Number })
  longitude: number;
}

@Schema({ timestamps: false })
export class Moment extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Couple', required: true })
  couple_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Task' })
  task_id: Types.ObjectId;

  @Prop()
  content: string;

  @Prop({ type: [Media], default: [] })
  media: Media[];

  @Prop()
  mood: string;

  @Prop({ type: Location })
  location: Location;

  @Prop({ type: Number, default: 0 })
  likes: number;

  @Prop({ type: Number, default: () => Date.now() })
  created_at: number;

  @Prop({ type: Number, default: () => Date.now() })
  updated_at: number;
}

export const MomentSchema = SchemaFactory.createForClass(Moment);

// 更新时自动设置 updated_at
MomentSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

MomentSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updated_at: Date.now() });
  next();
});

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ required: true, type: Number })
  price!: number;

  @Prop({ required: true, default: 0 })
  stock!: number;

  @Prop({ required: true })
  category!: string;

  @Prop([String])
  images!: string[];

  @Prop([String])
  tags!: string[];

  @Prop({ default: true })
  isActive!: boolean;

  @Prop()
  brand?: string;

  @Prop({ type: Object })
  specifications?: Record<string, any>;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
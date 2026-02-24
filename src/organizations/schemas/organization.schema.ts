import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrganizationDocument = Organization & Document;

@Schema({ _id: false })
export class Address {
  @Prop()
  line1?: string;
  @Prop()
  line2?: string;
  @Prop()
  city?: string;
  @Prop()
  state?: string;
  @Prop()
  pincode?: string;
  @Prop()
  country?: string;
}
const AddressSchema = SchemaFactory.createForClass(Address);

@Schema({ _id: false })
export class BillingDetails {
  @Prop()
  companyName?: string;
  @Prop()
  billingEmail?: string;
  @Prop({ type: Object })
  billingAddress?: Record<string, unknown>;
  @Prop()
  notes?: string;
}
const BillingDetailsSchema = SchemaFactory.createForClass(BillingDetails);

@Schema({ timestamps: true })
export class Organization {
  @Prop({ required: true })
  name: string;

  @Prop()
  gstNumber?: string;

  @Prop({ type: AddressSchema })
  address?: Address;

  @Prop({ required: true })
  contactPersonName: string;

  @Prop({ required: true })
  contactPersonNumber: string;

  @Prop({ type: BillingDetailsSchema })
  billingDetails?: BillingDetails;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);

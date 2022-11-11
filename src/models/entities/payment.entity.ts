import {model, Schema} from 'mongoose';
import {Product} from './product.entity';
import {PaymentStatus} from '../payment-status.enum';

export interface Payment {
    _id: Schema.Types.ObjectId;
    deliveryAddress: string;
    product: Product;
    amountInWei: string;
    status: PaymentStatus;
}

const paymentSchema = new Schema<Payment>({
    deliveryAddress: {type: String, required: true},
    product: {type: Schema.Types.ObjectId, ref: 'Product', required: true},
    amountInWei: {type: String, required: true},
    status: {type: Number, enum: PaymentStatus, default: PaymentStatus.NEW},
});

export const PaymentEntity = model<Payment>('Payment', paymentSchema);

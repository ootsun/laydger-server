import {model, Schema} from 'mongoose';

export interface Product {
    _id: Schema.Types.ObjectId;
    name: string;
    description: string;
    imageUrl: string;
    amountInWei: string;
}

const productSchema = new Schema<Product>({
    name: {type: String, required: true},
    description: {type: String, required: true},
    imageUrl: {type: String, required: true},
    amountInWei: {type: String, required: true},
});

export const ProductEntity = model<Product>('Product', productSchema);

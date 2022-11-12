import {ProductDto} from './product.dto';
import {PaymentStatus} from '../payment-status.enum';

export class PaymentDto {
    constructor(public _id: string,
                public deliveryAddress: string,
                public product: ProductDto,
                public status: PaymentStatus) {
    }
}

import {ProductEntity} from '../models/entities/product.entity';
import {Service} from 'typedi';
import {ProductDto} from '../models/dtos/product.dto';

@Service()
export class ProductsController {

    async getAllProducts(): Promise<ProductDto[]> {
        const products = await ProductEntity.find();
        return products.map(product => new ProductDto(
            product._id.toString(),
            product.name,
            product.description,
            product.imageUrl,
            product.amountInWei,
        ))
    }
}

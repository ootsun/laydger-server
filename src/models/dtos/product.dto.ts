export class ProductDto {
    constructor(public _id: string,
                public name: string,
                public description: string,
                public imageUrl: string,
                public amountInWei: string) {
    }
}

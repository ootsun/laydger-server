export class InitDLayPayPaymentDto {
    constructor(public paymentId: string,
                public merchantId: string,
                public amountInWei: string,
                public callbackUrl: string,
                public addressToCredit: string) {
    }
}

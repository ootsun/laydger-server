import axios from 'axios';
import {Container, Service} from 'typedi';
import {Provider} from 'zksync-web3';
import {BigNumber, ethers} from 'ethers';
import {CreatePaymentCommand} from '../models/commands/create-payment.command';
import {Payment, PaymentEntity} from '../models/entities/payment.entity';
import {ProductEntity} from '../models/entities/product.entity';
import {InitDLayPayPaymentDto} from '../models/dtos/init-dlay-pay-payment.dto';
import {PaymentStatus} from '../models/payment-status.enum';
import {UpdatePaymentCommand} from '../models/commands/update-payment.command';

@Service()
export class PaymentsController {

    private readonly provider: Provider;

    constructor() {
        this.provider = Container.get(Provider);
    }

    async createPayment(command: CreatePaymentCommand): Promise<string> {
        const product = await ProductEntity.findById(command.productId);
        if(!product) {
            throw new Error('Product not found');
        }

        const payment = new PaymentEntity({
            deliveryAddress: command.deliveryAddress,
            product: product,
            bumpedAmount: product.amountInWei
        });
        await payment.save();

        const redirectUrl = await this.initDLayPayPayment(payment);

        payment.status = PaymentStatus.PROCESSING;
        await payment.save();

        return redirectUrl;
    }

    async updatePayment(command: UpdatePaymentCommand) {
        const payment = await PaymentEntity.findById(command.paymentId);
        if(!payment) {
            throw new Error('Payment not found');
        }

        if(!await this.transactionIsValid(command.zkSyncTransactionHash, payment)) {
            throw new Error('Transaction is invalid');
        }

        await PaymentEntity.updateOne({_id: command.paymentId}, {status: command.status});

        return this.generateRedirectUrl(command.paymentId);
    }

    private async initDLayPayPayment(payment: Payment): Promise<string> {
        const DLAY_PAY_INIT_URL = process.env.DLAY_PAY_INIT_URL;
        if(!DLAY_PAY_INIT_URL) {
            throw new Error('set DLAY_PAY_INIT_URL env variable');
        }
        const CALLBACK_URL = process.env.CALLBACK_URL;
        if(!CALLBACK_URL) {
            throw new Error('set CALLBACK_URL env variable');
        }
        const LAYDGER_ADDRESS = process.env.LAYDGER_ADDRESS;
        if(!LAYDGER_ADDRESS) {
            throw new Error('set LAYDGER_ADDRESS env variable');
        }

        const initDLayPayPaymentDto = new InitDLayPayPaymentDto(
            payment._id.toString(),
            "Laydger",
            payment.amountInWei,
            CALLBACK_URL.replace('${ID}', payment._id.toString()),
            LAYDGER_ADDRESS
        );
        const res = await axios.post(DLAY_PAY_INIT_URL, initDLayPayPaymentDto);
        return res.data;
    }

    private generateRedirectUrl(paymentId: string): string {
        const DLAY_PAY_REDIRECT_URL = process.env.DLAY_PAY_REDIRECT_URL;
        if(!DLAY_PAY_REDIRECT_URL) {
            throw new Error('set DLAY_PAY_REDIRECT_URL env variable');
        }
        return DLAY_PAY_REDIRECT_URL.replace('${ID}', paymentId);
    }

    private async transactionIsValid(transactionHash: string, payment: Payment): Promise<boolean> {
        const receipt = await this.provider.getTransactionReceipt(transactionHash);
        if(!receipt || receipt.status === 0) {
            return false;
        }

        const LAYDGER_ADDRESS = process.env.LAYDGER_ADDRESS;
        if(!LAYDGER_ADDRESS) {
            throw new Error('set LAYDGER_ADDRESS env variable');
        }
        if(receipt.to !== LAYDGER_ADDRESS) {
            return false;
        }

        if(!process.env.DLAY_PAY_FEE_IN_PERCENTAGE) {
            throw new Error('set DLAY_PAY_FEE_IN_PERCENTAGE env variable');
        }
        const DLAY_PAY_FEE_IN_PERCENTAGE = Number.parseFloat(process.env.DLAY_PAY_FEE_IN_PERCENTAGE);
        const expectedAmount = BigNumber.from(payment.amountInWei)
            .mul(100 - DLAY_PAY_FEE_IN_PERCENTAGE)
            .div(100);
        const transaction = await this.provider.getTransaction(transactionHash);
        const transactionValue = transaction.value;
        return transactionValue.gte(expectedAmount);
    }
}

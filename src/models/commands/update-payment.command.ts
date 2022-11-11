export interface UpdatePaymentCommand {
    paymentId: string;
    status: number;
    zkSyncTransactionHash: string;
}

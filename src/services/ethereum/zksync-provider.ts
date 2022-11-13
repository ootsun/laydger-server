import {Provider} from 'zksync-web3';
import {Service} from 'typedi';

@Service()
export class ZkSyncProvider {

  private readonly provider: Provider;

  constructor() {
    this.provider = new Provider("https://zksync2-testnet.zksync.dev");
  }

  getProvider(): Provider {
    return this.provider;
  }
}

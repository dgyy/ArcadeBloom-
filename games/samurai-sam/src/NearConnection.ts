import { SwordDataType } from './SwordDataType';
import { getConfig } from './nearConfig';

export const SERIES_ID_LIGHT_SABER = '497912';
export const SERIES_ID_HALO_SABER = '497913';
export const IPFS_BASE_PATH = 'https://ipfs.fleek.co/ipfs/';

export const lightSaberData: SwordDataType = {
  name: 'light-saber',
  isOwned: false,
  token_series_id: SERIES_ID_LIGHT_SABER,
  priceInYoctoNear: '150000000000000000000000',
  nearPrice: '0.1',
};

export const haloSaberData: SwordDataType = {
  name: 'light-saber',
  isOwned: false,
  token_series_id: SERIES_ID_HALO_SABER,
  priceInYoctoNear: '150000000000000000000000',
  nearPrice: '0.1',
};

export class NearConnection {
  walletConnection;
  contract;
  accountId;
  userName;
  ready; //promise
  nearConfig = getConfig();
  resolveContract;

  constructor() {
    this.ready = new Promise((resolve) => {
      this.resolveContract = resolve;
    });
  }

  isSignedIn() {
    return this && this.walletConnection && this.walletConnection['isSignedIn']();
  }

  // Initialize contract & set global variables
  async initContract() {
    // Initialize connection to the NEAR testnet
    const nearApi = (<any>window)['nearApi'];
    const keyStore = new nearApi['keyStores']['BrowserLocalStorageKeyStore']();
    const near = await nearApi['connect']({ ...this.nearConfig, ['keyStore']: keyStore });

    // Initializing Wallet based Account. It can work with NEAR testnet wallet that
    // is hosted at https://wallet.testnet.near.org
    this.walletConnection = new nearApi['WalletConnection'](near, 'sam');

    // Getting the Account ID. If still unauthorized, it's just empty string
    this.accountId = this.walletConnection['getAccountId']();

    // Initializing our contract APIs by contract name and configuration
    this.contract = await new nearApi['Contract'](this.walletConnection['account'](), this.nearConfig['contractName'], {
      // View methods are read only. They don't modify the state, but usually return some value.
      ['viewMethods']: ['nft_tokens_for_owner'],
      // Change methods can modify the state. But you don't receive the returned value when called.
      ['changeMethods']: ['nft_buy'],
    });
    this.resolveContract();
    return this.walletConnection;
  }

  logout() {
    this.walletConnection['signOut']();
    // reload page
  }
  login() {
    // Allow the current app to make calls to the specified contract on the
    // user's behalf.
    // This works by creating a new access key for the user's account and storing
    // the private key in localStorage.
    this.walletConnection['requestSignIn'](this.nearConfig['contractName']);
  }
  getAccountId = () => {
    // Getting the Account ID. If still unauthorized, it's just empty string
    return this.walletConnection['getAccountId']();
  };

  nftBuy({ token_series_id, priceInYoctoNear }) {
    return this.contract['nft_buy'](
      {
        ['owner_id']: this.getAccountId(),
        ['receiver_id']: this.getAccountId(),
        ['token_series_id']: token_series_id,
      },
      '300000000000000',
      priceInYoctoNear
    );
  }
  getNftTokensForOwner = (account_id?: string) => {
    if (!account_id) account_id = this.getAccountId();
    return this.contract['nft_tokens_for_owner']({ ['account_id']: account_id });
  };
}

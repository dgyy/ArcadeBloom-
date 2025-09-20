const CONTARCT_NAME_MAINNET = 'x.paras.near';
export let myKeyStore = '';
export function getConfig() {
  return {
    ['networkId']: 'mainnet',
    ['keyStore']: myKeyStore,
    ['nodeUrl']: 'https://rpc.mainnet.near.org',
    ['contractName']: CONTARCT_NAME_MAINNET,
    ['appName']: 'Paras Testnet',
    ['walletUrl']: 'https://wallet.near.org',
    ['helperUrl']: 'https://helper.mainnet.near.org',
    ['explorerUrl']: 'https://explorer.mainnet.near.org',
  };
}

export function setKeyStore(value) {
  myKeyStore = value;
}

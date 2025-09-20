import { storageGetNetworkId, storageKey, storageSetNetworkId } from './storage';

declare const nearApi: any;

const enum NearInstanceProperties {
    NetworkId,
    ContractName,
    Connection,
    Contract,
}

type Sale = {
    itemId: number;
    price: number;
    sellerId: string;
};

export type UserSale = { completed: false } | { completed: true; buyerId: string };
export type UserSales = Array<{ id: string; sale: Sale } & UserSale>;

export type NearInstance = {
    [NearInstanceProperties.NetworkId]: string;
    [NearInstanceProperties.ContractName]: string;
    [NearInstanceProperties.Connection]: {
        isSignedIn(): boolean;
        account(): object;
        getAccountId(): string;
        requestSignIn(contractName?: string, title?: string): void;
        signOut(): void;
    };
    [NearInstanceProperties.Contract]: {
        get_random_sales(_: { playerId: string }): Promise<Array<{ id: string; sale: Sale }>>;
        get_user_sales(_: { playerId: string }): Promise<UserSales>;
        sell(_: { saleId: string; itemId: number; price: number }): Promise<Sale>;
        buy(_: { saleId: string }): Promise<Sale>;
        collect_sale(_: { saleId: string }): Promise<Sale>;
        cancel_sale(_: { saleId: string }): Promise<Sale>;
    };
};

const nearCreate = async (networkId: string): Promise<NearInstance> => {
    const contractStorageKey = `${storageKey}-${networkId}`;
    const contractName = `duelo.${networkId === 'testnet' ? 'testnet' : 'near'}`;
    const nearConnection = await nearApi.connect({
        nodeUrl: `https://rpc.${networkId}.near.org`,
        walletUrl: `https://wallet.${networkId}.near.org`,
        helperUrl: `https://helper.${networkId}.near.org`,
        explorerUrl: `https://explorer.${networkId}.near.org`,
        networkId,
        keyStore: new nearApi.keyStores.BrowserLocalStorageKeyStore(localStorage, contractStorageKey),
    });

    const walletConnection = new nearApi.WalletConnection(nearConnection, contractStorageKey);

    const contract = ((window as any).contract = await new nearApi.Contract(walletConnection.account(), contractName, {
        viewMethods: ['get_random_sales', 'get_user_sales'],
        changeMethods:
            process.env.NODE_ENV !== 'production'
                ? ['sell', 'buy', 'collect_sale', 'cancel_sale', 'reset']
                : ['sell', 'buy', 'collect_sale', 'cancel_sale'],
        sender: walletConnection.getAccountId(),
    }));

    return {
        [NearInstanceProperties.NetworkId]: networkId,
        [NearInstanceProperties.ContractName]: contractName,
        [NearInstanceProperties.Connection]: walletConnection,
        [NearInstanceProperties.Contract]: contract,
    };
};

export const nearGetAccountId = (near: NearInstance) => near[NearInstanceProperties.Connection].getAccountId();
export const nearIsSignedIn = (near: NearInstance) => near[NearInstanceProperties.Connection].isSignedIn();

let getNearTest = () => nearCreate('testnet');
let getNearMain = () => nearCreate('mainnet');
let nearSignedIn: Promise<NearInstance>;

export const nearRequestSignIn = async (networkId: string) => {
    storageSetNetworkId(networkId);
    const near = await (networkId === 'testnet' ? getNearTest() : getNearMain());
    near[NearInstanceProperties.Connection].requestSignIn(near[NearInstanceProperties.ContractName], 'DUELO');
};

export const nearGetSignedIn = (): Promise<NearInstance> => {
    if (!nearSignedIn) {
        nearSignedIn = (async () => {
            const networkId = storageGetNetworkId();
            if (!networkId) {
                return null;
            }

            const near = await (networkId === 'testnet' ? getNearTest() : getNearMain());

            if (process.env.NODE_ENV !== 'production') {
                (window as any).near = near;
            }

            return nearIsSignedIn(near) ? near : null;
        })();
    }

    return nearSignedIn;
};

export const nearSignOut = async () => {
    (await nearGetSignedIn())[NearInstanceProperties.Connection].signOut();
    nearSignedIn = null;
    storageSetNetworkId(null);
};

export const nearGetNeworkId = (near: NearInstance) => near[NearInstanceProperties.NetworkId];

export const nearGetRandomSales = (near: NearInstance) => {
    return near[NearInstanceProperties.Contract].get_random_sales({ playerId: nearGetAccountId(near) });
};

export const nearGetUserSales = (near: NearInstance): Promise<UserSales> => {
    return near[NearInstanceProperties.Contract].get_user_sales({ playerId: nearGetAccountId(near) });
};

const rand = () => (Math.random() * 0x10000000000000).toString(16);

export const nearSell = (near: NearInstance, itemId: number, price: number) => {
    return near[NearInstanceProperties.Contract].sell({ saleId: rand() + rand(), itemId, price });
};

export const nearBuy = (near: NearInstance, saleId: string) => {
    return near[NearInstanceProperties.Contract].buy({ saleId });
};

export const nearCollectSale = (near: NearInstance, saleId: string) => {
    return near[NearInstanceProperties.Contract].collect_sale({ saleId });
};

export const nearCancelSale = (near: NearInstance, saleId: string) => {
    return near[NearInstanceProperties.Contract].cancel_sale({ saleId });
};

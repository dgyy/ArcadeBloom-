import { Worker, NearAccount } from 'near-workspaces';
import anyTest, { TestFn } from 'ava';

const test = anyTest as TestFn<{
    worker: Worker;
    accounts: Record<string, NearAccount>;
}>;

test.beforeEach(async t => {
    // Init the worker and start a Sandbox server
    const worker = await Worker.init();

    // Deploy contract
    const root = worker.rootAccount;
    const contract = await root.createSubAccount('test-account');
    // Get wasm file path from package.json test script in folder above
    await contract.deploy(process.argv[2]);

    // Save state for test runs, it is unique for each test
    t.context.worker = worker;
    t.context.accounts = { root, contract };
});

test.afterEach.always(async t => {
    // Stop Sandbox server
    await t.context.worker.tearDown().catch(error => {
        console.log('Failed to stop the Sandbox:', error);
    });
});

test('sales', async t => {
    const { root, contract } = t.context.accounts;
    const other = await root.createSubAccount('other');

    const sale = await root.call(contract, 'sell', { saleId: 'sale1', itemId: 123, price: 456 });
    t.deepEqual(sale, { itemId: 123, price: 456, sellerId: 'test.near' });

    const randomSalesFromOtherUser = await contract.view('get_random_sales', { playerId: 'other.near' });
    t.deepEqual(randomSalesFromOtherUser, { sale1: { itemId: 123, price: 456, sellerId: 'test.near' } });

    const randomSalesFromTestUser = await contract.view('get_random_sales', { playerId: 'test.near' });
    t.deepEqual(randomSalesFromTestUser, {});

    const pendingSalesFromTestUser = await contract.view('get_user_sales', { playerId: 'test.near' });
    t.deepEqual(pendingSalesFromTestUser, { sale1: { itemId: 123, price: 456, sellerId: 'test.near' } });

    const boughtSale = await other.call(contract, 'buy', { saleId: 'sale1' });
    t.deepEqual(boughtSale, { itemId: 123, price: 456, sellerId: 'test.near' });

    const pendingSalesFromTestUserAfterBuy = await contract.view('get_user_pending_sales', { playerId: 'test.near' });
    t.deepEqual(pendingSalesFromTestUserAfterBuy, {});

    const completedSalesFromTestUser = await contract.view('get_user_completed_sales', { playerId: 'test.near' });
    t.deepEqual(completedSalesFromTestUser, { sale1: { itemId: 123, price: 456, sellerId: 'test.near' } });

    const collectedSale = await root.call(contract, 'collect_sale', { saleId: 'sale1' });
    t.deepEqual(collectedSale, { itemId: 123, price: 456, sellerId: 'test.near' });

    const completedSalesFromTestUserAfterCollect = await contract.view('get_user_completed_sales', {
        playerId: 'test.near',
    });
    t.deepEqual(completedSalesFromTestUserAfterCollect, {});

    const randomSalesFromTestUserAfterCollect = await contract.view('get_random_sales', { playerId: 'test.near' });
    t.deepEqual(randomSalesFromTestUserAfterCollect, {});
});

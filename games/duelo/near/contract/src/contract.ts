import { NearBindgen, near, call, view } from 'near-sdk-js';

type Sale = {
    itemId: number;
    price: number;
    sellerId: string;
};

type UserSale = { completed: false } | { completed: true; buyerId: string };
type UserSales = {
    [userId: string]: {
        [saleId: string]: UserSale;
    };
};

@NearBindgen({})
export class DueloGame {
    pendingSales: { [saleId: string]: Sale } = {};
    completedSales: { [saleId: string]: Sale } = {};
    userSales: UserSales = {};

    @view({})
    get_random_sales({ playerId }: { playerId: string }): Array<{ id: string; sale: Sale }> {
        const maxSales = 50;

        const othersSales: Array<{ order: number; entry: { id: string; sale: Sale } }> = [];
        for (const saleId in this.pendingSales) {
            const sale = this.pendingSales[saleId];
            if (sale.sellerId !== playerId) {
                othersSales.push({ order: Math.random(), entry: { id: saleId, sale } });
            }

            if (othersSales.length >= maxSales) {
                break;
            }
        }

        othersSales.sort((a, b) => a.order - b.order);
        return othersSales.slice(0, 10).map(s => s.entry);
    }

    @view({})
    get_user_sales({ playerId }: { playerId: string }): Array<{ id: string; sale: Sale } & UserSale> {
        const userSales = this.userSales[playerId] || {};
        return Object.entries(userSales).map(([saleId, userSale]) => {
            const sale = userSale.completed ? this.completedSales[saleId] : this.pendingSales[saleId];

            return {
                id: saleId,
                sale,
                ...userSale,
            };
        });
    }

    @call({})
    sell({ saleId, itemId, price }: { saleId: string; itemId: number; price: number }): Sale {
        const userId = near.signerAccountId();

        if (price < 1 || price > 99999) {
            return;
        }

        if (itemId < 0 || itemId >= 30) {
            return;
        }

        // if user has more than 10 sales, don't allow
        if (this.userSales[userId] && Object.keys(this.userSales[userId]).length >= 10) {
            return;
        }

        // if sale already exists, don't allow
        if (this.pendingSales[saleId]) {
            return;
        }

        const sale = {
            itemId,
            price,
            sellerId: userId,
        };

        this.pendingSales[saleId] = sale;
        if (!this.userSales[userId]) {
            this.userSales[userId] = {};
        }
        this.userSales[userId][saleId] = { completed: false };

        return sale;
    }

    @call({})
    buy({ saleId }: { saleId: string }): Sale {
        const sale = this.pendingSales[saleId];
        if (sale === null) {
            return;
        }

        const sellerId = sale.sellerId;
        delete this.pendingSales[saleId];
        this.completedSales[saleId] = sale;
        this.userSales[sellerId][saleId] = { completed: true, buyerId: near.signerAccountId() };

        return sale;
    }

    @call({})
    collect_sale({ saleId }: { saleId: string }): Sale {
        const userId = near.signerAccountId();
        const sale = this.completedSales[saleId];
        if (sale === null || sale.sellerId !== userId) {
            return;
        }

        delete this.userSales[userId][saleId];
        delete this.completedSales[saleId];

        return sale;
    }

    @call({})
    cancel_sale({ saleId }: { saleId: string }): Sale {
        const userId = near.signerAccountId();
        const sale = this.pendingSales[saleId];
        if (sale === null || sale.sellerId !== userId) {
            return;
        }

        delete this.pendingSales[saleId];
        delete this.userSales[userId][saleId];

        return sale;
    }

    @call({})
    reset(): void {
        const userId = near.signerAccountId();
        if (userId !== 'duelo.near' && userId !== 'duelo.testnet') {
            return;
        }

        this.pendingSales = {};
        this.completedSales = {};
        this.userSales = {};
    }
}

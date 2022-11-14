export class CurrencySystem {
    setMongoURL(password: string, toLog?: boolean): void;
    buy(settings: BuyOptions): BuyData;
    addUserItem(settings: BuyOptions): BuyData;
    removeUserItem(settings: RemoveItemOptions): Promise<{
        error: boolean;
        type: string;
        inventory?: undefined | {};
        rawData?: undefined | any;
    }>;
    addItem(settings: AddItemOptions): Promise<{
        error: boolean;
        type: string;
        item?:
            | undefined
            | {
                  name: string;
                  price: number;
                  description: string;
              };
    }>;
    removeItem(settings: RemoveItemOptions): Promise<{
        error: boolean;
        type: string;
        inventory?: undefined | any;
    }>;
    setItems(settings: SetItemsOptions): Promise<{
        error: boolean;
        type: string;
    }>;
    transferItem(settings: TransferItemOptions): any;
}

export interface BuyOptions {
    guild?: string;
    user: string;
    amount?: string | number;
    item: string | number;
}

export interface AddItemOptions {
    guild?: string;
    user: string;
    inventory: {
        name: string;
        price: string;
        description?: string;
    };
}

export interface RemoveItemOptions {
    guild?: string;
    user: string;
    item: string | number;
}

export interface SetItemsOptions {
    guild: string;
    shop: { name: string; price: number }[];
}

export interface TransferItemOptions {
    guild?: string;
    user1: string;
    user2: string;
    item: string | number;
    amount: string;
}
export interface RemoveUserItemOptions {
    guild?: string;
    user: string;
    item: string | number;
    amount: number | "all";
}

type BuyData = Promise<{
    error: boolean;
    type: string;
    inventory?: undefined | any;
    price?: undefined;
    amount?: undefined;
}>;

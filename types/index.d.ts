export default class CurrencySystem {
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
    monthly(settings: MainOptions): MainData;
    daily(settings: MainOptions): MainData;
    yearly(settings: MainOptions): MainData;
    weekly(settings: MainOptions): MainData;
    quaterly(settings: MainOptions): MainData;
    hafly(settings: MainOptions): MainData;
    hourly(settings: MainOptions): MainData;
    beg(settings: BegOptions): Promise<{
        error: boolean;
        type: string;
        time: string | undefined;
        amount?: number | undefined;
    }>;
    rob(settings: RobOptions): Promise<any>;
}

export interface BuyOptions extends _Base {
    amount?: string | number;
    item: string | number;
}

export interface AddItemOptions {
    guild: string;
    inventory: {
        name: string;
        price: string;
        description?: string;
    };
}

export interface RemoveItemOptions {
    guild: string;
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
export interface RemoveUserItemOptions extends _Base {
    item: string | number;
    amount: number | "all";
}
export interface MainOptions extends _Base {
    amount: number;
}

export type MainData = Promise<{
    error: boolean;
    type: string;
    time: string | undefined;
    amount?: undefined | any;
    rawData?: undefined | any;
}>;

export interface BegOptions extends _Base {
    cooldown: string | number;
    minAmount: number;
    maxAmount: number;
}

export interface RobOptions extends _Base {
    user2: string;
    cooldown: number;
    minAmount: number;
    maxRob: number;
    successPercentage: number;
}
type BuyData = Promise<{
    error: boolean;
    type: string;
    inventory?: undefined | any;
    price?: undefined;
    amount?: undefined;
}>;

export interface _Base {
    guild?: string;
    user: string;
}

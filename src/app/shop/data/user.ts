import { Shop } from './shop';
import { Voucher } from './voucher';
import { Inventory } from './inventory';
import { Group } from './group';

export interface User {
    username: string;
    password: string;
    id: string;
    shopsList?: Shop[];
    vouchersList?: Voucher[];
    inventoriesList?: Inventory[];
    groupsList?: Group[];
}

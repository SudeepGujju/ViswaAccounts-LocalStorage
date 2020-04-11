import { Shop } from './shop';
import { Voucher } from './voucher';
import { Inventory } from './inventory';
import { Group } from './group';
import { GeneralVoucher } from './general-voucher';

export interface User {
    username: string;
    password: string;
    id: string;
    shopsList?: Shop[];
    vouchersList?: Voucher[];
    inventoriesList?: Inventory[];
    groupsList?: Group[];
    genVochuersList?: GeneralVoucher[];
}

export interface GeneralVoucher{
    No: string,
    date:string,
    vouchList: Voucher[],
    totDbAmt: string,
    totCrAmt: string
}

interface Voucher{
    code: string,
    desc: string,
    dbAmt: string,
    crAmt: string
}
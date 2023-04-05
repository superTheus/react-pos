export type TransactionInterface = {
  value: string;
  typePayment: 'debit' | 'credit' | 'voucher' | 'pix' | 'code';
  capture: boolean;
  portion: number;
}

export type ReturnPOSType = {
  type: "Error" | "Info" | "Success",
  message: string,
  data?: any,
}

export type InfoStoneCode = {
  merchantAddress: merchantAddress,
  merchantDocumentNumber: string,
  merchantName: string,
  saleAffiliationKey: string,
  stoneCode: string,
}

export type TrasactionsType = {
  acquirerTransactionKey?: string,
  actionCode: string,
  aid: string,
  amount: string,
  appLabel: string,
  arcq: string,
  authorizationCode?: string,
  balance?: string,
  cardBrandName?: string,
  cardExpireDate: string,
  cardHolderName?: string,
  cardHolderNumber: string,
  cardSequenceNumber: string,
  cne?: string,
  commandActionCode: string,
  cvm: string,
  cvv: string,
  date: string,
  emailSent?: string,
  entryMode: string,
  externalId: string,
  iccRelatedData: string,
  initiatorTransactionKey: string,
  instalmentTransaction: instalmentTransaction,
  instalmentType: string,
  isFallbackTransaction: boolean,
  messageFromAuthorizer?: string,
  pinpadUsed?: string,
  saleAffiliationKey: string,
  serviceCode: string,
  shortName?: string,
  subMerchantAddress?: string,
  subMerchantCategoryCode?: string,
  subMerchantCity?: string,
  subMerchantPostalAddress?: string,
  subMerchantRegisteredIdentifier?: string,
  subMerchantTaxIdentificationNumber?: string,
  time: string,
  timeToPassTransaction: string,
  transactionReference: string,
  transactionStatus: "UNKNOWN" | "APPROVED" | "DECLINED" | "DECLINED_BY_CARD" | "WITH_ERROR" | "PENDING" | "CANCELLED" | "PARTIAL_APPROVED" | "TECHNICAL_ERROR" | "REJECTED" | "REVERSED" | "PENDING_REVERSAL",
  typeOfTransactionEnum: "CREDIT" | "DEBIT",
  userModel: userModel,
}

type instalmentTransaction = {
  count: number,
  interest: boolean,
  name: string
}

type userModel = {
  merchantAddress: merchantAddress;
  merchantDocumentNumber: string,
  merchantName: string,
  saleAffiliationKey: string,
  stoneCode: string
}

type merchantAddress = {
  city: string,
  distric: string,
  doorNumber: string,
  neighborhood: string,
  street: string
}
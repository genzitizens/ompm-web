export type CreateBillHistoryDetailRequest = {
  amountCents: number;
};

export type CreateBillHistoryPayeeRequest = {
  payeeName: string;
  payeeMobileNo?: string;
  payeeTelegramChatId?: string;
  amountCents: number;
};

export type CreateBillHistoryImageRequest = {
  fileName: string;
  storageKey: string;
  mimeType: string;
  fileSizeBytes: number;
};

export type CreateBillHistoryRequest = {
  accountId: number;
  billCode: string;
  totalAmountCents: number;
  image?: CreateBillHistoryImageRequest;
  details: CreateBillHistoryDetailRequest[];
  payees: CreateBillHistoryPayeeRequest[];
};

export type BillHistoryDetailResponse = {
  id: number;
  amountCents: number;
  createdAt: string;
};

export type BillHistoryPayeeResponse = {
  id: number;
  payeeName: string;
  payeeMobileNo?: string;
  payeeTelegramChatId?: string;
  amountCents: number;
  createdAt: string;
  updatedAt: string;
};

export type BillHistoryImageResponse = {
  id: number;
  fileName: string;
  storageKey: string;
  mimeType: string;
  fileSizeBytes: number;
  createdAt: string;
};

export type BillHistoryResponse = {
  id: number;
  accountId: number;
  billCode: string;
  totalAmountCents: number;
  createdAt: string;
  updatedAt: string;
  image?: BillHistoryImageResponse;
  details: BillHistoryDetailResponse[];
  payees: BillHistoryPayeeResponse[];
};

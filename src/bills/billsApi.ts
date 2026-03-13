import { request } from "../api/http";
import type { CreateBillHistoryRequest, BillHistoryResponse } from "./types";

export function createBillHistory(payload: CreateBillHistoryRequest, token?: string) {
  return request<BillHistoryResponse>({
    method: "POST",
    path: "/api/v1/bill-histories",
    body: payload,
    token
  });
}

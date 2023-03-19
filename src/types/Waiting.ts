export interface WaitingResponse {
  id: string;
  waitingNumber: number;
  waitingTurn: number;
  adult: number;
  children: number;
}

export interface WaitingCountResponse {
  count: number;
}

export interface WaitingRequest {
  adult: number;
  children: number;
  phoneNumber: string;
}

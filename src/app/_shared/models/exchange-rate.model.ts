export class ExchangeRate {
  currency: string;
  rate: number;
  timestamp: Date;
}

export class ExchangeHistoryRate {
  rate: number;
  timestamp: string;
  date?: number;
}

export interface IFromTo {
  from: ExchangeRate;
  to: ExchangeRate;
}

export interface IExchangeStored {
  id?: number;
  username: string;
  amount: number;
  result: number;
  created: number;
  from: ExchangeRate;
  to: ExchangeRate;
}

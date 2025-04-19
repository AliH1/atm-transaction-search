export type Atm = {
  id: number;
  name: string;
  country: string;
  lt: number;
  ts: number;
}

export type Aid = {
  aid: string;
  country: string | null;
  descr: string | null;
  id: number;
  name: string;
  type: string | null;
  vendor: string | null;
}

export type Transaction = {
  id: number;
  descr: string | null;
  txt: string;
}

export type HostReponse = {
  id: number;
  descr: string;
  txt: string;
}


export type transactionsData = {
  date: string;
  atmId: string;
  customerPan: string;
  description: string[];
  code: string[];
}[];
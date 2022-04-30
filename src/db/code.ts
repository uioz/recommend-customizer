export interface CodeRequest {
  key: string;
  title: string;
  code: string;
  rank: number;
  resFreshDate: Date;
  createDate: Date;
}

export interface CodeResponse {
  key: string;
  weight: number;
}

export interface CodeInDb {
  code: string;
  weight: number;
  rank: number;
  resFreshDate: Date;
  createDate: Date;
}

export function Write() {}

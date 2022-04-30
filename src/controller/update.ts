import { CodeRequest } from "./types";

export interface UpdateRequest {
  code: string;
  title: string;
}

export interface UpdateResponse {
  update: string | null;
}

export default (data: Array<CodeRequest>) => {
  return new Promise<UpdateResponse>((resolve, reject) => {
    resolve({
      update: "error",
    });
  });
};

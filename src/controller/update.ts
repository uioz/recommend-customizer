import { CodeRequest } from "./types";

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

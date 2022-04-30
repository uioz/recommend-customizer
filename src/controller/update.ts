import { tokenilize } from "../lib/tokenizer";

export interface UpdateRequest {
  code: string;
  title: string;
}

export interface UpdateResponse {
  update: string | null;
}

export default async (
  data: Array<UpdateRequest> | UpdateRequest
): Promise<UpdateResponse> => {
  const keywords = [];

  if (!Array.isArray(data)) {
    data = [data];
  }

  // TODO: 演员直接在页面中提取, 在排序中尝试匹配

  await Promise.all(
    data.map(async ({ title }) => {
      keywords.push(await tokenilize(title));
    })
  );

  return {
    update: "error",
  };
};

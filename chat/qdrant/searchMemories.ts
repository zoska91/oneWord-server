import { OpenAIEmbeddings } from '@langchain/openai';

export interface IDocumentPayload {
  content: string;
  conversationId: string;
  id: string;
}

interface ISearchResp {
  result: {
    payload: IDocumentPayload;
  }[];
}

export const searchMemories = async (collectionName: string, query: string) => {
  const embeddings = new OpenAIEmbeddings({ maxConcurrency: 5 });
  const queryEmbedding = await embeddings.embedQuery(query);

  const collectionsResp = await fetch(`${process.env.QDRANT_URL}/collections`);
  const { result } = await collectionsResp.json();
  const isCollectionExist = result.collections?.find(
    (collection: { name: string }) => collection.name === collectionName
  );

  if (!isCollectionExist) return [];

  const searchResp = await fetch(
    `${process.env.QDRANT_URL}/collections/${collectionName}/points/search`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        vector: queryEmbedding,
        limit: 5,
        with_payload: true,
        // filter: {
        //   must: [
        //     {
        //       key: 'source',
        //       match: {
        //         value: collectionName,
        //       },
        //     },
        //   ],
        // },
      }),
    }
  );

  const search: ISearchResp = await searchResp.json();
  return search.result.map((s) => s.payload);
};

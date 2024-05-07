import { OpenAIEmbeddings } from '@langchain/openai';

export const searchMemories = async (collectionName: string, query: string) => {
  const embeddings = new OpenAIEmbeddings({ maxConcurrency: 5 });
  const queryEmbedding = await embeddings.embedQuery(query);

  const collectionsResp = await fetch(`${process.env.QDRANT_URL}/collections`);
  const { result } = await collectionsResp.json();
  console.log('!!!!!!!!!!!!!!!!!!!!');
  console.log(result.collections);
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
        filter: {
          must: [
            {
              key: 'source',
              match: {
                value: collectionName,
              },
            },
          ],
        },
      }),
    }
  );

  console.log({ searchResp });
  const search: any = await searchResp.json();
  console.log({ search });
  return search.result.map((s: any) => s.payload);
};

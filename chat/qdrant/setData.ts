import { OpenAIEmbeddings } from '@langchain/openai';
import { saveLog } from '../../logger';

interface IMemoriesMetadata {
  id: string;
  content: string;
  type: 'mistake' | 'summary';
}
interface IMemoriesPoint {
  id: string;
  payload: IMemoriesMetadata;
  vector: number[];
}

export const setDataToDbFromJson = async (
  collectionName: string,
  data: IMemoriesMetadata[]
) => {
  try {
    const embeddings = new OpenAIEmbeddings({ maxConcurrency: 5 });

    // get collecions
    const collectionsResp = await fetch(
      `${process.env.QDRANT_URL}/collections`
    );
    const collections: any = await collectionsResp.json();

    const isCollectionExist = collections.collections?.find(
      (collection: any) => collection.name === collectionName
    );

    // create collection if not exist
    if (!isCollectionExist) {
      console.log('no db');
      saveLog('error', 'POST', 'qdrnat / add data', 'no db', {
        collectionName,
      });
    }

    // Add metadata
    let documents = data.map((document) => {
      return {
        ...document,
        metadata: {
          id: document.id,
          content: document.content,
          type: document.type,
        },
      };
    });

    // Generate embeddings
    const points: IMemoriesPoint[] = [];
    for (const document of documents) {
      console.log(new Date().getSeconds());
      const documentJSON = JSON.stringify(document);
      const [embedding] = await embeddings.embedDocuments([documentJSON]);
      points.push({
        id: document.metadata.id,
        payload: document.metadata,
        vector: embedding,
      });
    }
    console.log(points[0]);
    // Index
    const upsertPointResp = await fetch(
      `${process.env.QDRANT_URL}/collections/${collectionName}/points`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wait: true,
          batch: {
            ids: points.map((point) => point.id),
            vectors: points.map((point) => point.vector),
            payloads: points.map((point) => point.payload),
          },
        }),
      }
    );

    console.log(upsertPointResp);

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

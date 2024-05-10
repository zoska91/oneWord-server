import { OpenAIEmbeddings } from '@langchain/openai';
import { saveLog } from '../../logger';
import { createCollection } from './createCollection';

interface IMemoriesMetadata {
  id: string;
  content: string;
  conversationId: string;
}
interface IMemoriesPoint {
  id: string;
  payload: IMemoriesMetadata;
  vector: number[];
}

export const saveMemory = async (
  collectionName: string,
  data: IMemoriesMetadata[]
) => {
  try {
    const embeddings = new OpenAIEmbeddings({ maxConcurrency: 5 });

    // create collection if not exist
    await createCollection(collectionName);

    // Add metadata
    let documents = data.map((document) => {
      return {
        ...document,
        metadata: {
          id: document.id,
          content: document.content,
          conversationId: document.conversationId,
        },
      };
    });

    // Generate embeddings
    const points: IMemoriesPoint[] = [];
    for (const document of documents) {
      const documentJSON = JSON.stringify(document);
      const [embedding] = await embeddings.embedDocuments([documentJSON]);

      points.push({
        id: document.metadata.id,
        payload: document.metadata,
        vector: embedding,
      });
    }
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
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

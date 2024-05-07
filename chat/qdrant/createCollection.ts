export const setDataToDbFromJson = async (collectionName: string) => {
  try {
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
      await fetch(`${process.env.QDRANT_URL}/collections/${collectionName}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vectors: { size: 1536, distance: 'Cosine', on_disk: true },
        }),
      });
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

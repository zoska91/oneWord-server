import { vi } from 'vitest';

vi.stubEnv('SECRET', 'abfewvsdvarebr');
vi.stubEnv('OPENAI_API_KEY', 'exampleApiKey');
vi.stubEnv('VAPID_SUBJECT', 'https://example.com');
vi.stubEnv(
  'VAPID_PUBLIC_KEY',
  'BCIe7SDmr3GVDJ1r4XjI1gCvM6OJ00phhj_ZN4iU4Kw5Kge6axA-qdAqMjN3TT5whczO0oBfXm9yBOY-C8X0H4c'
);
vi.stubEnv('VAPID_PRIVATE_KEY', '9Pc_WEOItkxTm32A7APZr2ZsSbUkxExfONWjBSi5TZg');

vi.mock('web-push', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    // @ts-ignore
    ...actual,
    setVapidDetails: vi
      .fn()
      .mockImplementation((subject, publicKey, privateKey) => {
        if (!subject || !publicKey || !privateKey) {
          throw new Error('Missing required parameters for setVapidDetails.');
        }
        return true;
      }),
  };
});

vi.mock('./ai', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    // @ts-ignore
    ...actual,
    getStandaloneQuestionForMemories: vi.fn().mockResolvedValue('mockQuestion'),
    rerank: vi.fn(),
  };
});

vi.mock('../chat/qdrant/searchMemories', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    // @ts-ignore
    ...actual,
    searchMemories: vi.fn(),
  };
});

vi.mock('../chat/qdrant/setData', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    // @ts-ignore
    ...actual,
    saveMemory: vi.fn(),
  };
});

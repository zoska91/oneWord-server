import yup from 'yup';

export const subscribeSchema = yup.object({
  body: yup.object({
    subscription: yup.object({
      endpoint: yup.string(),
      keys: yup.object({
        p256dh: yup.string(),
        auth: yup.string(),
      }),
    }),
  }),
});

import yup from 'yup';

export const loginSchema = yup.object({
  body: yup.object({
    username: yup.string().max(32).required(),
    password: yup.string().max(64).required(),
  }),
});

export const registerSchema = yup.object({
  body: yup.object({
    username: yup.string().max(32).required(),
    password: yup.string().max(64).required(),
  }),
});

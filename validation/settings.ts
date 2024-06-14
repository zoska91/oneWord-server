import yup from 'yup';

export const userSettingsSchema = yup.object({
  body: yup.object({
    breakDay: yup.number(),
    isBreak: yup.bool(),
    isSummary: yup.bool(),
    summaryDay: yup.number(),
    notifications: yup
      .array()
      .of(
        yup.object({
          time: yup.string(),
          type: yup.string(),
        })
      )
      .max(5),
    languageToLearn: yup.number(),
    baseLanguage: yup.number(),
  }),
});

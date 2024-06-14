import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';

import app from '../../testsApp';
import { IWord, WordModel } from '../../../models/word';
import { ILoggedUser } from '../../../models/user';
import { loginAndAddWords } from '../../helpers/words';
import { loginExtraUser } from '../../helpers/auth';

describe('DELETE /api/words/delete-one/:id Endpoint Tests', async () => {
  let user: ILoggedUser;
  let words: IWord & { _id: string };
  let anotherUser: ILoggedUser;

  beforeAll(async () => {
    user = await loginAndAddWords(app);
    anotherUser = await loginExtraUser(app);
    words = await WordModel.find({ userId: user.id }).lean();
  });

  it('should delete an existing word', async () => {
    const wordToDelete = words[0];

    const res = await request(app)
      .delete(`/api/words/delete-one/${wordToDelete._id.toString()}`)
      .set('Authorization', `Bearer ${user.token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeTruthy();

    const deletedWord = await WordModel.findById(wordToDelete._id);
    expect(deletedWord).toBeNull();
  });

  it('should return 404 if another user tries to update the word', async () => {
    const wordToUpdate = words[0];
    const updatedData = {
      basicWord: 'updatedWord',
      transWord: 'updatedTrans',
      addLang: 5,
      status: 1,
    };

    const res = await request(app)
      .delete(`/api/words/delete-one/${wordToUpdate._id}`)
      .set('Authorization', `Bearer ${anotherUser.token}`)
      .send(updatedData);

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'word not found');
  });

  it('should return 404 if word not found', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .delete(`/api/words/delete-one/${nonExistentId}`)
      .set('Authorization', `Bearer ${user.token}`);

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'word not found');
  });

  it('should return 401 if user is not logged in', async () => {
    const wordToDelete = words[0];

    const res = await request(app).delete(
      `/api/words/delete-one/${wordToDelete._id}`
    );

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'no logged user');
  });
});

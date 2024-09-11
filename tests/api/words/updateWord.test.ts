import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';

import app from '../../testsApp';
import { IWord, WordModel } from '../../../models/word';
import { MAX_LENGTH_TODAY_WORD } from '../../../validation/helpers';
import { ILoggedUser } from '../../../models/user';
import { loginAndAddWords } from '../../helpers/words';
import { loginExtraUser } from '../../helpers/auth';

describe('PUT /api/words/update-one/:id Endpoint Tests', async () => {
  let user: ILoggedUser;
  let words: IWord & { _id: string };
  let anotherUser: ILoggedUser;

  beforeAll(async () => {
    user = await loginAndAddWords(app);
    anotherUser = await loginExtraUser(app);
    words = await WordModel.find({ userId: user.id }).lean();
  });

  it('should update an existing word with valid data', async () => {
    const wordToUpdate = words[0];
    const updatedData = {
      basicWord: 'updatedWord',
      transWord: 'updatedTrans',
      addLang: 5,
      status: 1,
    };

    const res = await request(app)
      .put(`/api/words/update-one/${wordToUpdate._id.toString()}`)
      .set('Authorization', `Bearer ${user.token}`)
      .send(updatedData);

    expect(res.statusCode).toEqual(200);
    expect(res.body.basicWord).toEqual(updatedData.basicWord);
    expect(res.body.transWord).toEqual(updatedData.transWord);
    expect(res.body.addLang).toEqual(updatedData.addLang);
    expect(res.body.status).toEqual(updatedData.status);

    const updatedWord = await WordModel.findById(wordToUpdate._id);

    if (!updatedWord) throw Error('not updated');

    expect(updatedWord).toBeTruthy();
    expect(updatedWord.basicWord).toEqual(updatedData.basicWord);
    expect(updatedWord.transWord).toEqual(updatedData.transWord);
    expect(updatedWord.addLang).toEqual(updatedData.addLang);
    expect(updatedWord.status).toEqual(updatedData.status);
  });

  it('should return 404 if word not found', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .put(`/api/words/update-one/${nonExistentId}`)
      .set('Authorization', `Bearer ${user.token}`)
      .send({ basicWord: 'nonexistent', transWord: 'nonexistent', addLang: 1 });

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'word not found');
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
      .put(`/api/words/update-one/${wordToUpdate._id}`)
      .set('Authorization', `Bearer ${anotherUser.token}`)
      .send(updatedData);

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'word not found');
  });

  it('should return 400 if basicWord exceeds max length', async () => {
    const wordToUpdate = words[0];
    const longWord = 'a'.repeat(MAX_LENGTH_TODAY_WORD + 1);
    const res = await request(app)
      .put(`/api/words/update-one/${wordToUpdate._id}`)
      .set('Authorization', `Bearer ${user.token}`)
      .send({ basicWord: longWord, transWord: 'updatedTrans', addLang: 1 });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty(
      'message',
      `body.basicWord must be at most ${MAX_LENGTH_TODAY_WORD} characters`
    );
  });

  it('should return 400 if transWord exceeds max length', async () => {
    const wordToUpdate = words[0];
    const longWord = 'a'.repeat(MAX_LENGTH_TODAY_WORD + 1);
    const res = await request(app)
      .put(`/api/words/update-one/${wordToUpdate._id}`)
      .set('Authorization', `Bearer ${user.token}`)
      .send({ basicWord: 'updatedWord', transWord: longWord, addLang: 1 });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty(
      'message',
      `body.transWord must be at most ${MAX_LENGTH_TODAY_WORD} characters`
    );
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

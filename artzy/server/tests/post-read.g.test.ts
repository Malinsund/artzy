import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { app } from '../src/app';
import { MockDB, mockDB } from './mock';
import {
  expectPostListsToBeTheSame,
  expectPostsToBeTheSame,
} from './support/utils';

describe('Retrieving posts (GET)', () => {
  let db: MockDB;

  beforeEach(async () => {
    db = await mockDB();
  });

  it('should be possible to get all posts (200)', async () => {
    const response = await request(app).get('/api/posts');

    // Assert response is correct
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body.length).toBeDefined();

    // Assert post list is correct
    expectPostListsToBeTheSame(response.body, db.posts);
  });

  it('should be possible to get a specific post (200)', async () => {
    // Assert response is correct
    const response0 = await request(app).get('/api/posts/' + db.posts[0]._id);
    expect(response0.status).toBe(200);
    expect(response0.headers['content-type']).toMatch(/json/);
    expectPostsToBeTheSame(response0.body, db.posts[0]);

    // Assert response is correct
    const response3 = await request(app).get('/api/posts/' + db.posts[3]._id);
    expect(response3.status).toBe(200);
    expect(response3.headers['content-type']).toMatch(/json/);
    expectPostsToBeTheSame(response3.body, db.posts[3]);

    // Assert post list is correct
    const responseAll = await request(app).get('/api/posts');
    expectPostListsToBeTheSame(responseAll.body, db.posts);
  });

  it('should not be possible to get a post that does not exist (404)', async () => {
    const response = await request(app).get(
      '/api/posts/5f4dab42c36a6d0c34e00000'
    );

    // Assert response is correct
    expect(response.status).toBe(404);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body).toMatch(
      /5f4dab42c36a6d0c34e00000.*(not found|hittades inte)/i
    );

    // Assert post list is correct
    const responseAll = await request(app).get('/api/posts');
    expectPostListsToBeTheSame(responseAll.body, db.posts);
  });
});

import request, { SuperAgentTest } from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { app } from '../src/app';
import { MockDB, mockDB } from './mock';
import {
  expectPostListsToBeTheSame,
  expectPostsToBeTheSame,
  loginUser,
  sorted,
} from './support/utils';

describe('Deleting a post (DELETE)', () => {
  let db: MockDB;
  let agent: SuperAgentTest;

  beforeEach(async () => {
    db = await mockDB();
    agent = request.agent(app);
  });

  it('should be possible to delete a post (204)', async () => {
    await loginUser(agent);
    const post = db.posts[4];
    const response = await agent
      .delete('/api/posts/' + post._id)
      .set('content-type', 'application/json');

    // Assert response is correct
    expect(response.status).toBe(204);
    expect(response.headers['content-type']).toBeUndefined();

    // Assert post list is correct
    const responseAll = await agent.get('/api/posts');
    expect(responseAll.body.length).toBe(db.posts.length - 1);
    sorted(responseAll.body).forEach((post: any, index) => {
      const dbPost = db.posts.find((p: any) => p._id === post._id);
      expectPostsToBeTheSame(post, dbPost!);
    });
  });

  it('should not be possible to delete a post when not logged in (401)', async () => {
    const post = db.posts[4];
    let response = await agent
      .delete('/api/posts/' + post._id)
      .set('content-type', 'application/json');

    // Assert response is correct
    expect(response.status).toBe(401);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(typeof response.body).toBe('string');

    // Assert post list is correct
    const responseAll = await request(app).get('/api/posts');
    expectPostListsToBeTheSame(db.posts, responseAll.body);
  });

  it('should not be possible to delete a post that belongs to someone else (403)', async () => {
    await loginUser(agent);
    const post = db.posts[8];
    let response = await agent
      .delete('/api/posts/' + post._id)
      .set('content-type', 'application/json');

    // Assert response is correct
    expect(response.status).toBe(403);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(typeof response.body).toBe('string');

    // Assert post list is correct
    const responseAll = await request(app).get('/api/posts');
    expectPostListsToBeTheSame(db.posts, responseAll.body);
  });

  it('should not be possible to delete a post that does not exist (404)', async () => {
    await loginUser(agent);
    const response = await agent
      .delete('/api/posts/00000b42c36a600c34e00000')
      .set('content-type', 'application/json');

    // Assert response is correct
    expect(response.status).toBe(404);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body).toMatch(
      /00000b42c36a600c34e00000.*(not found|hittades inte)/i
    );

    // Assert post list is correct
    const responseAll = await agent.get('/api/posts');
    expectPostListsToBeTheSame(db.posts, responseAll.body);
  });
});

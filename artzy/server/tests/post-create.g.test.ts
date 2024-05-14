import request, { SuperAgentTest } from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { PostModel } from '../src';
import { app } from '../src/app';
import { MockDB, mockDB } from './mock';
import { getMockPost } from './mock/posts';
import { expectPostListsToBeTheSame, loginUser, sorted } from './support/utils';

describe('Creating a post (POST)', () => {
  let db: MockDB;
  let agent: SuperAgentTest;

  beforeEach(async () => {
    db = await mockDB();
    agent = request.agent(app);
  });

  it('should be possible to create a new post (201)', async () => {
    await loginUser(agent);
    const mockPost = getMockPost();

    const response = await agent
      .post('/api/posts')
      .set('content-type', 'application/json')
      .send(mockPost);

    // Assert response is correct
    expect(response.status).toBe(201);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body._id).toBeDefined();
    expect(response.body.title).toEqual(mockPost.title);
    expect(response.body.content).toEqual(mockPost.content);
    expect(response.body.author.toString()).toEqual(db.user._id.toString());

    // Assert post list is correct
    const allPosts = await PostModel.find({});
    expect(allPosts.length).toBe(db.posts.length + 1);
    sorted(allPosts).forEach((post: any, index) => {
      if (!post[index]) return;
      expect(post).toStrictEqual(db.posts[index]);
    });
  });

  it('should not be possible to create a post when not logged in (401)', async () => {
    const mockPost = getMockPost('test', 'Hello again...');
    let response = await agent
      .post('/api/posts')
      .set('content-type', 'application/json')
      .send(mockPost);

    // Assert response is correct
    expect(response.status).toBe(401);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(typeof response.body).toBe('string');

    // Assert post list is correct
    const responseAll = await request(app).get('/api/posts');
    expectPostListsToBeTheSame(db.posts, responseAll.body);
  });

  it('should not be possible to create a post with incorrect or missing values (400)', async () => {
    await loginUser(agent, 'admin@plugga.se');
    const post = getMockPost();

    // Incorrect values
    for (const key of Object.keys(post)) {
      const faultyPost = { ...post, [key]: {} };

      const response = await agent
        .post('/api/posts/')
        .set('content-type', 'application/json')
        .send(faultyPost);

      // Assert response is correct
      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toMatch(new RegExp(`${key}`, 'i'));

      // Assert post list is correct
      const responseAll = await agent.get('/api/posts');
      expectPostListsToBeTheSame(db.posts, responseAll.body);
    }

    // Missing values
    for (const key of Object.keys(post)) {
      const faultyPost: any = { ...post };
      delete faultyPost[key];

      const response = await agent
        .post('/api/posts/')
        .set('content-type', 'application/json')
        .send(faultyPost);

      // Assert response is correct
      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toMatch(new RegExp(`${key}`, 'i'));

      // Assert post list is correct
      const responseAll = await agent.get('/api/posts');
      expectPostListsToBeTheSame(db.posts, responseAll.body);
    }
  });
});

import request, { SuperAgentTest } from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { app } from "../src/app";
import { MockDB, mockDB } from "./mock";
import { getMockPost } from "./mock/posts";
import {
  expectPostListsToBeTheSame,
  expectPostsToBeTheSame,
  loginUser,
  sorted,
} from "./support/utils";

describe("Updating a post (PUT)", () => {
  let db: MockDB;
  let agent: SuperAgentTest;

  beforeEach(async () => {
    db = await mockDB();
    agent = request.agent(app);
  });

  it("should be possible to update a post (200)", async () => {
    await loginUser(agent);
    const post = db.posts[1];
    post.title = "New Title";
    post.content = "Updated content";
    const response = await agent
      .put("/api/posts/" + post._id)
      .set("content-type", "application/json")
      .send(post);

    // Assert response is correct
    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body.title).toEqual(post.title);
    expect(response.body.content).toEqual(post.content);

    // Assert post list is correct
    const responseAll = await agent.get("/api/posts");
    expect(responseAll.body.length).toBe(db.posts.length);
    sorted(responseAll.body).forEach((post: any, index) => {
      if (index === 1) return;
      expectPostsToBeTheSame(post, db.posts[index]);
    });
  });

  it("should not be possible to update a post when not logged in (401)", async () => {
    const post = db.posts[1];
    let response = await agent
      .put("/api/posts/" + post._id)
      .set("content-type", "application/json")
      .send(post);

    // Assert response is correct
    expect(response.status).toBe(401);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(typeof response.body).toBe("string");

    // Assert post list is correct
    const responseAll = await request(app).get("/api/posts");
    expectPostListsToBeTheSame(db.posts, responseAll.body);
  });

  it("should not be possible to update a post that belongs to someone else (403)", async () => {
    await loginUser(agent);
    const post = db.posts[8];
    let response = await agent
      .put("/api/posts/" + post._id)
      .set("content-type", "application/json")
      .send(post);

    // Assert response is correct
    expect(response.status).toBe(403);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(typeof response.body).toBe("string");

    // Assert post list is correct
    const responseAll = await request(app).get("/api/posts");
    expectPostListsToBeTheSame(db.posts, responseAll.body);
  });

  it("should not be possible to update a post that does not exist (404)", async () => {
    await loginUser(agent);
    const post = {
      _id: "00000b42c36a600c34e00000",
      ...getMockPost(),
    };
    const response = await agent
      .put("/api/posts/00000b42c36a600c34e00000")
      .set("content-type", "application/json")
      .send(post);

    // Assert response is correct
    expect(response.status).toBe(404);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body).toMatch(
      /00000b42c36a600c34e00000.*(not found|hittades inte)/i
    );

    // Assert post list is correct
    const responseAll = await agent.get("/api/posts");
    expectPostListsToBeTheSame(db.posts, responseAll.body);
  });

  it("should not be possible to update a post with incorrect or missing values (400)", async () => {
    await loginUser(agent);
    const post = { ...db.posts[1] };
    const keys = ["title", "content", "author"] as (keyof typeof post)[];

    // Incorrect values
    for (const key of keys) {
      const faultyPost = { ...post, [key]: {} };

      const response = await agent
        .put("/api/posts/" + faultyPost._id)
        .set("content-type", "application/json")
        .send(faultyPost);

      // Assert response is correct
      expect(response.status).toBe(400);
      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.body).toMatch(new RegExp(`${key}`, "i"));
    }

    // Missing values
    for (const key of keys) {
      const faultyPost = { ...post };
      delete faultyPost[key];

      const response = await agent
        .put("/api/posts/" + faultyPost._id)
        .set("content-type", "application/json")
        .send(faultyPost);

      // Assert response is correct
      expect(response.status).toBe(400);
      expect(response.headers["content-type"]).toMatch(/json/);
      expect(response.body).toMatch(new RegExp(`${key}`, "i"));

      // Assert post list is correct
      const responseAll = await agent.get("/api/posts");
      expectPostListsToBeTheSame(db.posts, responseAll.body);
    }
  });
});

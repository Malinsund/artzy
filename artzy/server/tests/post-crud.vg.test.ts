import request, { SuperAgentTest } from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { app } from "../src/app";
import { MockDB, mockDB } from "./mock";
import { expectPostsToBeTheSame, loginUser, sorted } from "./support/utils";

describe("Post CRUD operations as admin", () => {
  let db: MockDB;
  let agent: SuperAgentTest;

  beforeEach(async () => {
    db = await mockDB();
    agent = request.agent(app);
    await loginUser(agent, "admin@plugga.se");
  });

  it("should be possible to update a post that belongs to someone else as admin (200)", async () => {
    const post = db.posts[0];
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

  it("should be possible to delete a post that belongs to someone else as admin (204)", async () => {
    const post = db.posts[0];
    let response = await agent
      .delete("/api/posts/" + post._id)
      .set("content-type", "application/json");

    // Assert response is correct
    expect(response.status).toBe(204);
    expect(response.headers["content-type"]).toBeUndefined();

    // Assert post list is correct
    const responseAll = await agent.get("/api/posts");
    expect(responseAll.body.length).toBe(db.posts.length - 1);
    sorted(responseAll.body).forEach((post: any) => {
      const dbPost = db.posts.find((p: any) => p._id === post._id);
      expectPostsToBeTheSame(post, dbPost!);
    });
  });
});

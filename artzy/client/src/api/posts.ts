export async function getPosts() {
  const response = await fetch("/api/posts");
  return await response.json();
}

export interface Post {
  id: string;
  author: string;
  title: string;
  content: string;
  listedPrice: number;
  image: File;
}

export async function addNewPost(post: Post) {
  try {
    const response = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    });

    if (!response.ok) {
      throw new Error(`Failed to add new post (${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding new post:", error);
    throw error;
  }
}

export async function getPostById(postId: string) {
  try {
    const response = await fetch(`/api/posts/${postId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch post (${response.status})`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error;
  }
}

export async function deletePost(postId: string) {
  try {
    const response = await fetch(`/api/posts/${postId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Failed to delete post (${response.status})`);
    }
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
}

export async function updatePost(postId: string, post: Post) {
  try {
    const response = await fetch(`/api/posts/${postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    });
    if (!response.ok) {
      throw new Error(`Failed to update post (${response.status})`);
    }
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
}

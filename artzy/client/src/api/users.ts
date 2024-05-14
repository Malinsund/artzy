export interface User {
  id: string;
  username: string;
  password: string;
  isAdmin: boolean;
}


export async function fetchLoggedInUser() {
  const response = await fetch("/api/users/auth");
  if (!response.ok) return null;
  return await response.json();
}

export async function fetchUserById(id: string) {
  const response = await fetch(`/api/users/${id}`);
  return await response.json();
}

export function logInUser(credentials: { username: string; password: string }) {
  return fetch("/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  })
    .then(async (response) => {
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      }
      return responseData;
    })
    .catch((error) => {
      console.error("error logging in:", error);
      throw error;
    });
}

export function logoutUser() {
  return fetch("/api/users/logout", {
    method: "POST",
  });
}

export function registerUser(credentials: {
  username: string;
  password: string;
}) {
  return fetch("/api/users/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
}

export async function fetchAllUsers() {
  const response = await fetch("/api/users");
  return await response.json();
}

export async function updateUser(id: string, isAdmin: boolean) {
  const response = await fetch(`/api/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ isAdmin }),
  });
  return await response.json();
}

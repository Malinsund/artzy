import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { Route, RouterProvider, createRoutesFromElements } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import AddPost from "./pages/AddPostPage.tsx";
import Admin from "./pages/AdminPage.tsx";
import Home from "./pages/HomePage.tsx";
import Login from "./pages/LoginPage.tsx";
import PostPage from "./pages/PostPage.tsx";
import Profile from "./pages/ProfilePage.tsx";
import RegisterUser from "./pages/RegisterPage.tsx";

const queryClient = new QueryClient();

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route Component={App}>
      <Route path="" Component={Home} />
      <Route path="posts/:id" Component={PostPage} />
      <Route path="login" Component={Login} />
      <Route path="profile" Component={Profile} />
      <Route path="register" Component={RegisterUser} />
      <Route path="addPost" Component={AddPost} />
      <Route path="admin" Component={Admin} />
      <Route path="*" element={<span>Sidan finns inte..</span>} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);

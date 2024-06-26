import "./App.css";
import Post from "./Post";
import Header from "./Header";
import { Route, Routes } from "react-router-dom";
import IndexPage from "./pages/IndexPage";
import Layout from "./Layout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import {UserContextProvider} from "./Contextpage.js";
import CreatePost from "./pages/CreatePost.js";
import PostPage from "./pages/PostPage.js";
import EditPost from "./pages/EditPost.js";
function App() {
  return (
    <UserContextProvider>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<IndexPage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/register" element={<RegisterPage />}></Route>
        <Route path="/create" element={<CreatePost/>}></Route>
        <Route path="/post/:id" element={<PostPage/>}></Route>
        <Route path="/edit/:id" element={<EditPost/>}></Route>
      </Route>
    </Routes>
    </UserContextProvider>
  );
}

export default App;

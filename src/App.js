import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Blogs from "./pages/Blogs";
import Blog from "./pages/Blog";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useState } from "react";
import { SnackbarProvider } from "notistack";

const sections = [
  { title: "Academic", url: "academic" },
  { title: "Career", url: "career" },
  { title: "Campus", url: "campus" },
  { title: "Culture", url: "culture" },
  { title: "Local Community", url: "local" },
  { title: "Social", url: "social" },
  { title: "Sports", url: "sports" },
  { title: "Health and Wellness", url: "health" },
  { title: "Technology", url: "technology" },
  { title: "Travel", url: "travel" },
  { title: "Alumni", url: "alumni" },
];

function App() {
  const [search, setSearch] = useState("");
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <BrowserRouter>
        <Header sections={sections} />
        <Routes>
          <Route
            exact
            path="/"
            element={<Blogs search={search} setSearch={setSearch} />}
          />
          <Route
            exact
            path="/unsubscribed"
            element={<Blogs search={search} setSearch={setSearch} />}
          />
          {sections.map((section) => (
            <Route
              key={section.url}
              path={`/${section.url}`}
              exact
              element={<Blogs search={search} setSearch={setSearch} />}
            />
          ))}
          <Route exact path="/blogs/:id" element={<Blog />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </SnackbarProvider>
  );
}

export default App;

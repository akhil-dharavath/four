import React, { useEffect, useState } from "react";
import BlogsCard from "../components/BlogsCard";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllBlogsApi } from "../api/blogs";
import { getUserApi } from "../api/authentication";
import { TextField, Typography } from "@mui/material";

const Blogs = ({ search, setSearch }) => {
  const navigate = useNavigate();
  const location = useLocation().pathname.slice(1);
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState([]);

  const getUser = async () => {
    const res = await getUserApi();
    if (res.data) {
      setUser(res.data);
    } else {
      alert(res.response.data.message);
    }
  };

  const getBlogs = async () => {
    const res = await getAllBlogsApi();
    if (res.data) {
      setBlogs(res.data);
    } else {
      alert(res.response.data.message);
    }
  };

  useEffect(() => {
    getBlogs();
    if (!localStorage.getItem("token")) {
      navigate("/login");
    } else {
      getUser();
    }
    // eslint-disable-next-line
  }, []);

  return (
    <section className="text-gray-600 body-font">
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          marginRight: 20,
        }}
      >
        <Typography sx={{ mr: 2 }}>Search Blog: </Typography>
        <TextField
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search blog"
          size="small"
          className="pt-4 pb-4"
        />
      </div>
      <div className="container px-5 py-12 mx-auto">
        <div className="flex flex-wrap -my-8">
          {location === "unsubscribed" ? (
            blogs && blogs.length > 0 ? (
              blogs
                .filter((blog) => {
                  // Check if user.unSubscribed exists and contains blog._id
                  return !(
                    user.unSubscribed && !user.unSubscribed.includes(blog._id)
                  );
                })
                .filter(
                  (blog) =>
                    search === undefined ||
                    blog.title.toLowerCase().includes(search)
                )
                .map((blog) => <BlogsCard key={blog._id} blog={blog} />)
            ) : (
              <p className="text-center mt-5">Trouble finding blogs</p>
            )
          ) : blogs && blogs.length > 0 ? (
            blogs
              .filter((blog) => {
                // Check if user.unSubscribed exists and contains blog._id
                return !(
                  user.unSubscribed && user.unSubscribed.includes(blog._id)
                );
              })
              .filter((blog) => blog.category.toLowerCase().includes(location))
              .filter(
                (blog) =>
                  search === undefined ||
                  blog.title.toLowerCase().includes(search)
              )
              .map((blog) => <BlogsCard key={blog._id} blog={blog} />)
          ) : (
            <p className="text-center mt-5">Trouble finding blogs</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Blogs;

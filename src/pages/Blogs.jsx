import React, { useEffect, useState } from "react";
import BlogsCard from "../components/BlogsCard";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllBlogsApi, getTopStoriesApi } from "../api/blogs";
import { getUserApi } from "../api/authentication";
import axios from "axios";

const Blogs = ({ search }) => {
  const navigate = useNavigate();
  const location = useLocation().pathname.slice(1);
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState([]);
  const [address, setAddress] = useState({});
  const [topStories, setTopStories] = useState([]);

  const getBlogs = async () => {
    const res = await getAllBlogsApi();
    if (res.data) {
      setBlogs(res.data);
    } else {
      alert(res.response.data.message);
    }
  };

  const getUser = async () => {
    const res = await getUserApi();
    if (res.data) {
      setUser(res.data);
    } else {
      alert(res.response.data.message);
    }
  };

  const getAddress = async () => {
    const res = await axios({ url: "https://ipapi.co/json/", method: "GET" });
    if (res && res.data) {
      setAddress(res.data);
    } else {
      alert("trouble finding your location");
    }
  };

  const getTopStories = async () => {
    if (address && address.region) {
      const res = await getTopStoriesApi(address.region);
      if (res && res.data) {
        setTopStories(res.data);
      } else {
        console.log(res);
        // alert(res.response.data.message);
      }
    }
  };

  useEffect(() => {
    getBlogs();
    if (!localStorage.getItem("token")) {
      navigate("/login");
    } else {
      getUser();
    }
    getAddress();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    getTopStories();
    // eslint-disable-next-line
  }, [address]);

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-12 mx-auto">
        <div className="flex flex-wrap -my-8">
          {topStories &&
            topStories.length > 0 &&
            topStories.map((story) => (
              <div className="py-2 px-2 lg:w-1/4 ">
                <div className="h-full flex items-start rounded-md py-6 px-2 border-2 border-gray-200">
                  <div className="flex-grow pl-6">
                    <h2 className="tracking-widest text-xs title-font font-medium text-indigo-500 mb-1">
                      {story.source}
                    </h2>
                    <h1 className="title-font text-xl font-medium text-gray-900 mb-3">
                      <span className="border-b-2 border-white">
                        {story.title}
                      </span>
                    </h1>
                    <p>Published: {story.date}</p>
                    <a href={`${story.link}`} className="text-indigo-500" target="_blank" rel="noreferrer">
                      Learn More &rarr;
                    </a>
                  </div>
                </div>
              </div>
            ))}

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

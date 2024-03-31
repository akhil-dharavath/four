import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  deleteBlogApi,
  getOneBlogApi,
  openaiCommentApi,
  subscribeApi,
  unSubscribeApi,
} from "../api/blogs";
import { getAllUsers, getUserApi } from "../api/authentication";
import { Badge, Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { addCommentApi } from "../api/blogs";
import { enqueueSnackbar } from "notistack";

const Blog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [user, setUser] = useState({});
  const [subscribed, setSubscribed] = useState(null);

  const getBlog = async () => {
    const res = await getOneBlogApi(id);
    if (res.data) {
      setBlog(res.data);
    } else {
      alert(res.response.data.messege);
    }
  };

  const getUser = async () => {
    const res = await getUserApi();
    if (res.data) {
      setUser(res.data);
      const count = res.data.unSubscribed.filter((sub) => sub === id).length;
      setSubscribed(count === 0);
    } else {
      alert(res.response.data.messege);
    }
  };

  const navigate = useNavigate();
  const handleDelete = async () => {
    const res = await deleteBlogApi(id);
    if (res.data) {
      enqueueSnackbar("Blog has been deleted!",{variant:'success'})
      navigate("/");
    } else {
      alert(res.response.data.message);
    }
  };

  const handleSubscribe = async () => {
    const res = await subscribeApi(id);
    if (res.data) {
      setSubscribed(true);
    } else {
      alert(res.response.data.message);
    }
  };

  const handleUnSubscribe = async () => {
    const res = await unSubscribeApi(id);
    if (res.data) {
      setSubscribed(false);
    } else {
      alert(res.response.data.message);
    }
  };

  useEffect(() => {
    getBlog();
    getUser();
    // eslint-disable-next-line
  }, []);

  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [comment, setComment] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment === "") {
      return;
    }
    const res = await addCommentApi(id, comment);
    if (res.data) {
      handleClose();
      window.location.reload();
    } else {
      alert(res.response.data.message);
    }
  };

  const [users, setUsers] = useState({});
  const fetchAllUsers = async () => {
    const res = await getAllUsers();
    if (res.data) {
      setUsers(res.data);
    } else {
      alert("You are not Authorized");
    }
  };

  const generateComment = async () => {
    if (blog) {
      const res = await openaiCommentApi(blog.title, blog.description);
      if (res.data) {
        setComment(res.data);
      } else {
        alert(res.response.data.message);
      }
    }
  };

  useEffect(() => {
    fetchAllUsers();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <section className="text-gray-600 body-font overflow-hidden">
        <div className="container px-5 py-12 mx-auto">
          <div style={{ width: "auto", display: "flex", margin: 10 }}>
            <Button
              color="info"
              variant="outlined"
              sx={{ width: "auto" }}
              className="mx-2"
              onClick={() => navigate("/")}
            >
              Go back
            </Button>
            <Button
              color="primary"
              variant="outlined"
              sx={{ width: "auto", marginLeft: "auto", marginRight: 3 }}
              onClick={() =>
                subscribed ? handleUnSubscribe() : handleSubscribe()
              }
            >
              {subscribed ? "Unsubscribe" : "Subscribe"}
            </Button>
            {user && user.role === "Moderator" && (
              <Button
                color="error"
                variant="outlined"
                sx={{ width: "auto" }}
                className="mx-2"
                onClick={() => handleDelete()}
              >
                Delete Blog
              </Button>
            )}
          </div>
          <div className="lg:w-4/5 mx-auto flex flex-wrap">
            <img
              alt="ecommerce"
              className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded"
              src={blog && blog.cover}
            />
            <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
              <h2 className="text-sm title-font text-indigo-500 tracking-widest">
                {blog && blog.category.toUpperCase()}
              </h2>
              <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
                {blog && blog.title}
              </h1>
              <div className="flex mb-4">
                <span className="flex items-center">
                  <span className="text-gray-600 ml-0">
                    Published on: {blog && blog.createdAt.slice(0, 10)}
                  </span>
                </span>
              </div>
              <p className="leading-relaxed">
                {blog && blog.description} Dummy text starts from here Lorem
                ipsum dolor sit amet consectetur adipisicing elit. Beatae
                laudantium harum eius nihil cumque quidem cupiditate delectus
                quo? Animi iste tenetur quam nisi sit veniam, optio expedita
                dignissimos itaque fugit. Lorem ipsum dolor, sit amet
                consectetur adipisicing elit. Pariatur numquam, assumenda
                deleniti voluptatibus beatae ea magni laudantium aspernatur.
                Repellendus vel harum facilis odio est nesciunt officiis error
                velit veniam deleniti!
              </p>
              <Link to="" className="mt-5 inline-flex items-center">
                <button className="w-10 h-10 rounded-full flex-shrink-0 object-cover object-center bg-cyan-500 text-white">
                  {blog && blog.authorName.slice(4, 5).toUpperCase()}
                </button>
                <span className="flex-grow flex flex-col pl-3">
                  <span className="title-font font-medium text-gray-900">
                    {blog && blog.authorName}
                  </span>
                </span>
              </Link>
              <div className="flex  items-center pb-5 border-b-2 border-gray-100 mb-5"></div>

              <div className="flex">
                <button
                  className="rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500"
                  onClick={() => handleClickOpen(true)}
                >
                  <Badge
                    badgeContent={blog && blog.comments.length}
                    color="primary"
                  >
                    <svg
                      fill="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                    >
                      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                    </svg>
                  </Badge>
                </button>

                <Dialog
                  fullScreen={fullScreen}
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="responsive-dialog-title"
                  fullWidth
                >
                  <DialogTitle id="responsive-dialog-title">
                    Comments section
                  </DialogTitle>
                  <DialogContent>
                    <div className="comments">
                      {blog &&
                        blog.comments.length > 0 &&
                        blog &&
                        blog.comments.map((comment, index) => (
                          <div key={index} className="d-flex">
                            <div className="text-black">
                              <b>
                                {users &&
                                users.length > 0 &&
                                users.filter(
                                  (user) => user._id === comment.user
                                ).length > 0
                                  ? users.filter(
                                      (user) => user._id === comment.user
                                    )[0].username
                                  : "Unknown"}
                              </b>
                              <br />
                              {comment.comment}
                            </div>
                          </div>
                        ))}
                      <form
                        onSubmit={handleSubmit}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                          width: "100%",
                          position: "relative",
                        }}
                      >
                        <input
                          placeholder="Comment"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          className="comment-input"
                        />
                        <div className="comment-buttons">
                          <Button
                            variant="contained"
                            onClick={() => generateComment()}
                            sx={{ margin: "10px 5px" }}
                          >
                           Auto Generate
                          </Button>
                          <Button
                            variant="outlined"
                            type="submit"
                            sx={{ margin: "10px 5px" }}
                          >
                            Post
                          </Button>
                        </div>
                      </form>
                    </div>
                  </DialogContent>
                </Dialog>

                <button className="rounded-full ml-auto w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4">
                  <Badge badgeContent={blog && blog.likes} color="primary">
                    <svg
                      fill="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="w-6 h-6"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                    </svg>
                  </Badge>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;

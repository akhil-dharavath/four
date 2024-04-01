import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  disableUser,
  enableUser,
  getAllUsers,
  getUserApi,
} from "../api/authentication";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { createBlogApi } from "../api/blogs";
import { enqueueSnackbar } from "notistack";

const offCanvasButtonStyles =
  "text-gray-800 w-full text-left p-2 hover:bg-gray-100";

const Header = ({ sections }) => {
  const [hideNavbar, setHideNavbar] = useState(false);
  const navigate = useNavigate();
  const location = useLocation().pathname.slice(1);
  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const [addPost, setAddPost] = useState({
    title: "",
    description: "",
    cover: "",
    authorName: "",
    createdAt: "",
    category: "",
  });

  const handleClose = () => {
    setOpen(false);
    setAddPost({
      id: Math.floor(Math.random() * 1000000),
      title: "",
      description: "",
      cover: "",
      authorName: "",
      createdAt: "",
      category: "",
      likes: 0,
      comments: [],
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddPost({ ...addPost, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await createBlogApi(addPost);
    if (res.data) {
      handleClose();
      enqueueSnackbar("Successfully blog has been added!", {
        variant: "success",
      });
      // window.location.reload();
      const path = addPost.category.toLowerCase();
      navigate(`/${path}`);
    } else {
      alert(res.response.data.message);
    }
  };

  const getUser = async () => {
    if (localStorage.getItem("token")) {
      const res = await getUserApi();
      if (res.data) {
        setUser(res.data);
      } else {
        alert(res.response.data.message);
      }
      if (res.data.role === "Administrator") {
        let resp = await getAllUsers();
        if (resp.data) {
          setUsers(resp.data);
        } else {
          alert(resp.response.data.message);
        }
      }
    }
  };

  const fetchUsers = async () => {
    let resp = await getAllUsers();
    if (resp.data) {
      setUsers(resp.data);
    } else {
      alert(resp.response.data.message);
    }
  };

  const handleEnableDisableUser = async (userId, enable) => {
    if (enable) {
      await enableUser(userId);
    } else {
      await disableUser(userId);
    }
    // Refetch users after enabling/disabling user
    fetchUsers();
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getUser();
    }
  }, []);

  useEffect(() => {
    if (location === "login" || location === "register") {
      setHideNavbar(true);
    } else {
      setHideNavbar(false);
    }
  }, [location]);

  return (
    <header className={`text-gray-600 body-font ${hideNavbar ? "hidden" : ""}`}>
      <div className="container mx-auto flex flex-wrap py-5 px-1 flex-col md:flex-row items-center">
        <a
          href="/"
          className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0"
        >
          <span className="ml-3 text-xl">BlogVista</span>
        </a>
        <nav className="md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-400 flex flex-wrap items-center text-base justify-center">
          {sections.map((section) => (
            <Link
              key={section.url}
              to={section.url}
              className="mr-4 hover:text-gray-900"
            >
              {section.title}
            </Link>
          ))}
        </nav>
        <button
          className="inline-flex items-center text-white bg-indigo-600 border-0 py-1 px-3 focus:outline-none hover:bg-indigo-700 rounded text-base mt-4 md:mt-0"
          type="button"
          data-hs-overlay="#hs-overlay-right"
        >
          Profile
        </button>
        <div
          id="hs-overlay-right"
          className="hs-overlay hs-overlay-open:translate-x-0 hidden translate-x-full fixed top-0 end-0 transition-all duration-300 transform h-full max-w-xs w-full z-[80] bg-white border-s dark:bg-gray-800 dark:border-gray-700"
          tabIndex="-1"
        >
          <div className="flex justify-between items-center py-3 px-4 border-b dark:border-gray-700">
            <h3 className="font-bold text-gray-800 dark:text-white">PROFILE</h3>
            <button
              type="button"
              className="flex justify-center items-center size-7 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
              data-hs-overlay="#hs-overlay-right"
            >
              <span className="sr-only">Close modal</span>
              <svg
                className="flex-shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
          <div className="p-4">
            <button className={offCanvasButtonStyles}>{user.username}</button>
            <br />
            <button className={offCanvasButtonStyles}>{user.email}</button>
            <br />
            <button className={`${offCanvasButtonStyles} border-b-2`}>
              {user.role}
            </button>
            <br />

            <button className={offCanvasButtonStyles} onClick={handleClickOpen}>
              Create Blog
            </button>

            <Dialog
              fullScreen={fullScreen}
              open={open}
              onClose={handleClose}
              aria-labelledby="responsive-dialog-title"
            >
              <DialogTitle id="responsive-dialog-title">
                {"Add a Blog"}
              </DialogTitle>
              <form onSubmit={handleSubmit}>
                <DialogContent>
                  <TextField
                    sx={{ my: 1 }}
                    fullWidth
                    label="Title"
                    variant="outlined"
                    value={addPost.title}
                    name="title"
                    onChange={(e) => handleChange(e)}
                    required
                    size="small"
                  />
                  <TextField
                    sx={{ my: 1 }}
                    fullWidth
                    label="Description"
                    variant="outlined"
                    value={addPost.description}
                    name="description"
                    onChange={(e) => handleChange(e)}
                    required
                    size="small"
                  />
                  <TextField
                    sx={{ my: 1 }}
                    fullWidth
                    // label="Date Published"
                    variant="outlined"
                    value={addPost.createdAt}
                    name="createdAt"
                    onChange={(e) => handleChange(e)}
                    required
                    type="date"
                    size="small"
                  />
                  <FormControl fullWidth size="small" sx={{ my: 1 }}>
                    <InputLabel id="demo-simple-select-label">
                      Category
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Category"
                      name="category"
                      value={addPost.category}
                      onChange={(e) => handleChange(e)}
                    >
                      <MenuItem value="Academic">Academic</MenuItem>
                      <MenuItem value="Career">Career</MenuItem>
                      <MenuItem value="Campus">Campus</MenuItem>
                      <MenuItem value="Culture">Culture</MenuItem>
                      <MenuItem value="Local Community">
                        Local Community
                      </MenuItem>
                      <MenuItem value="Social">Social</MenuItem>
                      <MenuItem value="Sports">Sports</MenuItem>
                      <MenuItem value="Health and Wellness">
                        Health and Wellness
                      </MenuItem>
                      <MenuItem value="Technology">Technology</MenuItem>
                      <MenuItem value="Travel">Travel</MenuItem>
                      <MenuItem value="Alumni">Alumni</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    sx={{ my: 1 }}
                    fullWidth
                    label="Author Name"
                    variant="outlined"
                    value={addPost.authorName}
                    name="authorName"
                    onChange={(e) => handleChange(e)}
                    required
                    size="small"
                  />
                  <TextField
                    sx={{ my: 1 }}
                    fullWidth
                    label="Image link (https)"
                    variant="outlined"
                    value={addPost.cover}
                    name="cover"
                    onChange={(e) => handleChange(e)}
                    required
                    size="small"
                  />
                </DialogContent>
                <DialogActions>
                  <Button
                    color="error"
                    sx={{ width: "auto" }}
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>
                  <Button color="success" sx={{ width: "auto" }} type="submit">
                    Confirm
                  </Button>
                </DialogActions>
              </form>
            </Dialog>

            {user && user.role === "Administrator" && (
              <>
                <br />
                <button
                  className={offCanvasButtonStyles}
                  onClick={() => setShow(true)}
                >
                  Manage Login Accounts
                </button>
              </>
            )}

            {show && (
              <Dialog open={show} onClose={() => setShow(false)} fullWidth>
                <DialogTitle>Manage Login Accounts</DialogTitle>
                <DialogContent>
                  {users &&
                    users.length > 0 &&
                    users
                      .filter((user) => user.role !== "Administrator")
                      .map((user) => (
                        <Box
                          key={user._id}
                          sx={{
                            display: "flex",
                          }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                defaultChecked={user.enable ? true : false}
                                onChange={() =>
                                  handleEnableDisableUser(
                                    user._id,
                                    !user.enable
                                  )
                                }
                              />
                            }
                            label={user.username}
                          />
                        </Box>
                      ))}
                </DialogContent>
                <DialogActions>
                  <Button
                    color="error"
                    sx={{ width: "auto" }}
                    onClick={() => setShow(false)}
                  >
                    Close
                  </Button>
                </DialogActions>
              </Dialog>
            )}

            <br />
            <button
              className={offCanvasButtonStyles}
              type="button"
              data-hs-overlay="#hs-overlay-right"
              onClick={() => navigate("/unsubscribed")}
            >
              Unsubscribed blogs
            </button>
            <br />
            <button
              className={`${offCanvasButtonStyles} text-red-500`}
              onClick={() => handleLogout()}
              type="button"
              data-hs-overlay="#hs-overlay-right"
            >
              Log Out
            </button>
            <br />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

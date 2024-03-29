import React from "react";
import { Link } from "react-router-dom";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];
const BlogsCard = ({
  blog: {
    description,
    title,
    createdAt,
    authorName,
    cover,
    category,
    _id,
    likes,
    comments,
  },
}) => {
  return (
    <div className="py-2 px-2 lg:w-1/4 ">
      <div className="h-full flex items-start rounded-md py-6 px-2 border-2 border-gray-200">
        <div className="w-12 flex-shrink-0 flex flex-col text-center leading-none">
          <span className="text-gray-500 pb-2 mb-2 border-b-2 border-gray-200">
            {months[Number(createdAt.slice(5, 7)) - 1]}
          </span>
          <span className="font-medium text-lg text-gray-800 title-font leading-none">
            {createdAt.slice(8, 10)}
          </span>
        </div>
        <div className="flex-grow pl-6">
          <h2 className="tracking-widest text-xs title-font font-medium text-indigo-500 mb-1">
            {category}
          </h2>
          <Link to={`/blogs/${_id}`}>
            <h1 className="title-font text-xl font-medium text-gray-900 mb-3">
              <span className="border-b-2 border-white hover:border-b-2 hover:border-indigo-700 hover:text-indigo-700">
                {title.length > 50 ? `${title.slice(0, 50)}...` : title}
              </span>
            </h1>
          </Link>
          <p className="leading-relaxed mb-5">
            {description.length > 110
              ? `${description.slice(0, 110)}...`
              : description}
          </p>
          <Link to="" className="inline-flex items-center">
            <button className="w-8 h-8 rounded-full flex-shrink-0 object-cover object-center bg-cyan-500 text-white">
              {authorName.slice(4, 5).toUpperCase()}
            </button>
            <span className="flex-grow flex flex-col pl-3">
              <span className="title-font font-medium text-gray-900">
                {authorName}
              </span>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogsCard;

import React, { useContext, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import { UserContext } from "../UserContext";

function PostPage() {
  const [postInfo, setPostInfo] = useState(null);
  const { id } = useParams();
  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate(); // Use useNavigate hook

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/post/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((postInfo) => {
        setPostInfo(postInfo);
      })
      .catch((error) => {
        console.error("Error fetching post:", error);
      });
  }, [id]);

  const handleDelete = () => {
    fetch(`${process.env.REACT_APP_API_URL}/post/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.message);
        navigate("/events");
      })
      .catch((error) => {
        console.error("Error deleting post:", error);
      });
  };

  if (!postInfo) return "";

  return (
    <>
      <div className="container w-full md:max-w-3xl mx-auto pt-20">
        <div
          className="w-full px-4 md:px-6 text-xl text-gray-800 leading-normal"
          style={{ fontFamily: "Georgia,serif" }}
        >
          {/*Title*/}
          <div className="font-sans">
            <p className="text-base md:text-sm text-green-500 font-bold">
              &lt;{" "}
              <Link
                to={"/events"}
                className="text-base md:text-sm text-green-500 font-bold no-underline hover:underline"
              >
                BACK
              </Link>
            </p>
            <h1 className="font-bold font-sans break-normal text-gray-900 pt-6 pb-2 text-3xl md:text-4xl">
              {postInfo.title}
            </h1>
            <p className="text-sm md:text-base font-normal text-gray-600">
              Published on :
              <time>{" " + formatISO9075(new Date(postInfo.createdAt))}</time>
            </p>
            {userInfo.id && (
              <div className=" mb-2">
                <Link
                  to={`/edit/${postInfo._id}`}
                  className=" p-2  text-xs bg-gray-700 hover:bg-gray-500 text-white rounded-md"
                >
                  Edit this post
                </Link>

                <button
                  onClick={handleDelete}
                  className="p-2 text-xs ml-2 bg-red-700 hover:bg-red-500 text-white rounded-md"
                >
                  Delete this post
                </button>
              </div>
            )}
          </div>
          <img
            width={800}
            src={`data:image/jpeg;base64,${postInfo.image}`}
            alt={postInfo.title}
          />
          <hr className="border-b-2 border-gray-400 mb-8 mx-4" />
          <div dangerouslySetInnerHTML={{ __html: postInfo.content }} />
        </div>
        <hr className="border-b-2 border-gray-400 mb-8 mx-4" />
      </div>
    </>
  );
}

export default PostPage;

import { useEffect, useState } from "react";
import axios from "axios";
import { Heart, MessageCircle, Search, User, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  
  // Comment States
  const [activeCommentBox, setActiveCommentBox] = useState(null);
  const [commentText, setCommentText] = useState("");

  // BACKEND URL CONFIG
  const PF = "https://meraki-art.onrender.com";

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${PF}/api/posts`);
      setPosts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLike = async (postId) => {
    if (!user) return alert("Please login to like posts!");
    try {
      await axios.put(`${PF}/api/posts/${postId}/like`, { userId: user._id });
      fetchPosts(); 
    } catch (err) {
      console.log(err);
    }
  };

  const handleComment = async (postId) => {
    if (!user) return alert("Please login to comment!");
    if (!commentText) return;
    try {
      await axios.post(`${PF}/api/posts/${postId}/comment`, {
        userId: user._id,
        text: commentText
      });
      setCommentText("");
      fetchPosts();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await axios.delete(`${PF}/api/posts/${postId}/comment/${commentId}`);
      fetchPosts();
    } catch (err) {
      console.log(err);
    }
  };

  // HELPER FOR IMAGES
  const getImageUrl = (imgStr) => {
    if (!imgStr) return "";
    return imgStr.startsWith("http") ? imgStr : PF + imgStr;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-4xl mx-auto mb-8 flex items-center bg-gray-800 rounded-full px-4 py-2 border border-gray-700">
        <Search className="text-gray-400 mr-2" />
        <input 
          type="text" 
          placeholder="Search for amazing art..." 
          className="bg-transparent w-full focus:outline-none"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="max-w-6xl mx-auto columns-1 sm:columns-2 lg:columns-3 gap-4">
        {posts.filter(p => p.title.toLowerCase().includes(search.toLowerCase())).map((post) => (
          <div key={post._id} className="break-inside-avoid mb-4 bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-all group">
            <Link to={`/profile/${post.user?.username}`}>
                <div className="flex items-center gap-2 p-3 hover:bg-gray-700 transition">
                    <div className="w-8 h-8 rounded-full bg-gray-600 overflow-hidden border border-blue-500">
                        <img src={getImageUrl(post.user?.profilePic)} alt="" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-sm font-medium">{post.user?.username || "Artist"}</span>
                </div>
            </Link>

            <div className="relative">
              <img src={getImageUrl(post.image)} alt={post.title} className="w-full object-cover" />
            </div>

            <div className="p-4">
              <h3 className="font-bold text-lg">{post.title}</h3>
              <p className="text-gray-400 text-xs mb-3">{post.description}</p>
              
              <div className="flex gap-4">
                <button onClick={() => handleLike(post._id)} className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-500 transition">
                    <Heart size={18} className={post.likes.includes(user?._id) ? "fill-red-500 text-red-500" : ""} /> 
                    {post.likes.length}
                </button>
                <button onClick={() => setActiveCommentBox(activeCommentBox === post._id ? null : post._id)} className="flex items-center gap-1 text-sm text-gray-400 hover:text-blue-500 transition">
                    <MessageCircle size={18} /> {post.comments.length}
                </button>
              </div>

              {activeCommentBox === post._id && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="max-h-32 overflow-y-auto mb-3 space-y-2">
                  {post.comments.length === 0 ? (
                    <p className="text-gray-500 text-[10px]">No comments yet.</p>
                  ) : (
                    post.comments.map((c) => (
                      <div key={c._id} className="flex justify-between items-start group/comm">
                        <div>
                          <span className="text-blue-400 text-[10px] font-bold mr-2">{c.user?.username}</span>
                          <span className="text-gray-300 text-[10px]">{c.text}</span>
                        </div>
                        {user && c.user?._id === user._id && (
                            <button onClick={() => handleDeleteComment(post._id, c._id)} className="text-gray-600 hover:text-red-500 opacity-0 group-hover/comm:opacity-100 transition">
                                <Trash2 size={12} />
                            </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" placeholder="Write a comment..." 
                    className="flex-1 bg-gray-900 text-xs p-2 rounded border border-gray-700 outline-none"
                    value={commentText} onChange={(e) => setCommentText(e.target.value)}
                  />
                  <button onClick={() => handleComment(post._id)} className="text-blue-500 text-xs font-bold">Post</button>
                </div>
              </div>
            )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
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

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get("https://meraki-api.onrender.com/api/posts");
      setPosts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLike = async (postId) => {
    if (!user) return alert("Please login to like posts!");
    try {
      await axios.put(`https://meraki-api.onrender.com/api/posts/${postId}/like`, { userId: user._id });
      fetchPosts(); 
    } catch (err) {
      console.log(err);
    }
  };

  const handleComment = async (postId) => {
    if (!commentText) return;
    if (!user) return alert("Please login to comment!");
    
    try {
      await axios.put(`https://meraki-api.onrender.com/api/posts/${postId}/comment`, { 
        userId: user._id, 
        text: commentText 
      });
      setCommentText("");
      fetchPosts(); 
    } catch (err) {
      console.log(err);
    }
  };

  // --- NEW DELETE COMMENT FUNCTION ---
  const handleDeleteComment = async (postId, commentId) => {
    if(!window.confirm("Delete this comment?")) return;
    try {
        await axios.put(`https://meraki-api.onrender.com/api/posts/${postId}/comment/delete`, {
            commentId: commentId
        });
        fetchPosts(); // Refresh to remove comment from UI
    } catch (err) {
        console.log(err);
    }
  };

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* Search Header */}
      <div className="max-w-6xl mx-auto mb-12 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          Explore Art Haven
        </h1>
        <div className="relative max-w-lg mx-auto">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by title or tag..." 
            className="w-full bg-gray-800 border border-gray-700 rounded-full py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500 transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Art Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredPosts.map((post) => (
          <div key={post._id} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 hover:border-gray-600 transition flex flex-col">
            
            {/* Image */}
            <div className="h-64 overflow-hidden relative group cursor-pointer">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <span className="text-white font-bold tracking-wider">{post.title}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-grow">
              
              {/* Creator Info */}
              <Link to={`/profile/${post.user?.username}`} className="flex items-center gap-2 mb-3 w-fit hover:opacity-80 transition">
                 <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden border border-gray-500">
                    {post.user?.profilePic ? (
                      <img src={post.user.profilePic} className="w-full h-full object-cover"/>
                    ) : (
                      <User size={16} />
                    )}
                 </div>
                 <span className="text-sm text-gray-300 font-medium hover:text-blue-400 hover:underline">
                    {post.user?.username || "Unknown"}
                 </span>
              </Link>

              <p className="text-gray-400 text-sm mb-3 line-clamp-2">{post.description}</p>
              <div className="flex flex-wrap gap-1 mb-4">
                {post.tags.slice(0, 3).map((tag, i) => (
                   <span key={i} className="text-xs bg-gray-700 text-blue-300 px-2 py-0.5 rounded-full">#{tag}</span>
                ))}
              </div>

              {/* Actions */}
              <div className="mt-auto border-t border-gray-700 pt-3 flex items-center justify-between">
                <button 
                  onClick={() => handleLike(post._id)} 
                  className={`flex items-center gap-1.5 text-sm transition ${post.likes.includes(user?._id) ? "text-red-500" : "text-gray-400 hover:text-red-400"}`}
                >
                  <Heart size={18} fill={post.likes.includes(user?._id) ? "currentColor" : "none"} />
                  {post.likes.length}
                </button>

                <button 
                  onClick={() => setActiveCommentBox(activeCommentBox === post._id ? null : post._id)}
                  className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-blue-400 transition"
                >
                  <MessageCircle size={18} />
                  {post.comments.length}
                </button>
              </div>
            </div>

            {/* Comment Section */}
            {activeCommentBox === post._id && (
              <div className="bg-gray-900 p-3 border-t border-gray-700 animate-fade-in">
                <div className="max-h-32 overflow-y-auto mb-2 space-y-2">
                  {post.comments.length === 0 ? <p className="text-xs text-gray-500">No comments yet.</p> : (
                    post.comments.map((c, idx) => (
                      <div key={idx} className="flex justify-between items-start group">
                        <div className="text-xs">
                           <span className="font-bold text-gray-300 mr-1">{c.user?.username || "User"}:</span>
                           <span className="text-gray-400">{c.text}</span>
                        </div>
                        
                        {/* DELETE ICON (Only shows if it's YOUR comment) */}
                        {user && c.user?._id === user._id && (
                            <button 
                                onClick={() => handleDeleteComment(post._id, c._id)}
                                className="text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                            >
                                <Trash2 size={12} />
                            </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Write a comment..." 
                    className="flex-1 bg-gray-800 text-xs p-2 rounded border border-gray-700 focus:border-blue-500 outline-none"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleComment(post._id)}
                  />
                  <button onClick={() => handleComment(post._id)} className="text-blue-500 text-xs font-bold hover:text-white">Post</button>
                </div>
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
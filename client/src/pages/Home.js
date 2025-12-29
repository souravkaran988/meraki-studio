import React, { useEffect, useState } from "react";
import API from "../api.js"
import { Link } from "react-router-dom";
import { Heart, MessageCircle, Share2, Send, Trash2, X, Search, Sparkles } from "lucide-react";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentText, setCommentText] = useState("");

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/posts");
      setPosts(res.data);
      setFilteredPosts(res.data);
      if (selectedPost) {
        const updated = res.data.find(p => p._id === selectedPost._id);
        setSelectedPost(updated);
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("username") || "sourav";
    setCurrentUser(storedUser);
    fetchPosts();
  }, []);

  useEffect(() => {
    const results = posts.filter(post =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredPosts(results);
  }, [searchTerm, posts]);

  const handleLike = async (e, postId) => {
    e.stopPropagation(); 
    try {
      await axios.put(`http://localhost:5000/api/posts/${postId}/like`, { username: currentUser });
      fetchPosts();
    } catch (err) { console.error(err); }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await axios.post(`http://localhost:5000/api/posts/${selectedPost._id}/comment`, {
        username: currentUser,
        text: commentText
      });
      setCommentText("");
      fetchPosts();
    } catch (err) { console.error(err); }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Delete your comment?")) {
      try {
        await axios.delete(`http://localhost:5000/api/posts/${selectedPost._id}/comment/${commentId}`);
        fetchPosts();
      } catch (err) { console.error(err); }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 text-white">
      
      {/* --- HERO SECTION --- */}
      <div className="flex flex-col items-center justify-center text-center mb-24 mt-10">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full mb-6">
          <Sparkles className="text-blue-400" size={16} />
          <span className="text-blue-400 text-[10px] font-black uppercase tracking-widest">Digital Art Community</span>
        </div>
        
        <h1 className="text-6xl md:text-7xl font-black tracking-tighter mb-6 italic">
          Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">Meraki</span>
        </h1>
        
        <p className="text-gray-500 font-medium max-w-xl mb-12 leading-relaxed">
          The world’s most extraordinary digital masterpieces. Search by title or tag to discover brilliance instantly.
        </p>

        <div className="relative w-full max-w-xl group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full blur opacity-10 group-focus-within:opacity-30 transition duration-500"></div>
          <div className="relative flex items-center bg-[#161b22] border border-white/10 rounded-full shadow-2xl overflow-hidden px-6">
            <Search className="text-gray-500 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search masterpieces..." 
              className="w-full bg-transparent py-5 px-4 outline-none text-base font-medium placeholder:text-gray-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="text-gray-500 hover:text-white transition-colors">
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* --- GALLERY GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredPosts.map((post) => (
          <div 
            key={post._id} 
            onClick={() => setSelectedPost(post)}
            className="group relative bg-[#161b22] border border-white/10 rounded-[2.5rem] overflow-hidden hover:border-blue-500/40 transition-all duration-500 cursor-pointer shadow-xl"
          >
            <div className="relative aspect-square overflow-hidden">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            </div>
            
            <div className="p-7">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-xl truncate pr-2">{post.title}</h3>
                <span className="bg-blue-600/10 text-blue-500 text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-wider">
                  #{post.tags?.[0] || "Art"}
                </span>
              </div>

              {/* --- LIKES & COMMENTS MOVED HERE (ABOVE USERNAME) --- */}
              <div className="flex items-center gap-4 mb-3">
                <button 
                  onClick={(e) => handleLike(e, post._id)} 
                  className="flex items-center gap-1.5 group/like"
                >
                  <Heart 
                    size={18} 
                    fill={post.likes.includes(currentUser) ? "#ef4444" : "none"} 
                    className={post.likes.includes(currentUser) ? "text-red-500" : "text-gray-500 group-hover/like:text-red-400 transition-colors"} 
                  />
                  <span className="text-sm font-bold text-gray-400">{post.likes.length}</span>
                </button>
                <div className="flex items-center gap-1.5">
                  <MessageCircle size={18} className="text-gray-500" />
                  <span className="text-sm font-bold text-gray-400">{post.comments.length}</span>
                </div>
              </div>

              <Link 
                to={`/profile/${post.username}`} 
                className="text-gray-500 text-xs italic hover:text-blue-400 transition-colors block"
                onClick={(e) => e.stopPropagation()}
              >
                by @{post.username}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* --- MODAL FOR INTERACTION --- */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
          <div className="bg-[#0d1117] border border-white/10 w-full max-w-6xl h-[85vh] rounded-[3.5rem] overflow-hidden flex flex-col relative">
            <button onClick={() => setSelectedPost(null)} className="absolute top-8 right-8 z-20 p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all text-white">
              <X size={24} />
            </button>
            <div className="flex flex-col md:flex-row h-full">
                <div className="flex-1 bg-black/40 flex items-center justify-center p-8 border-r border-white/5">
                  <img src={selectedPost.image} className="max-w-full max-h-full object-contain rounded-xl shadow-2xl" alt="" />
                </div>
                <div className="w-full md:w-[450px] flex flex-col bg-[#0d1117]">
                  <div className="p-10 border-b border-white/5">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-full flex items-center justify-center font-black">
                            {selectedPost.username?.charAt(0).toUpperCase()}
                        </div>
                        <Link to={`/profile/${selectedPost.username}`} className="font-bold text-lg hover:text-blue-400 transition-colors">
                          {selectedPost.username}
                        </Link>
                    </div>
                    <h2 className="text-3xl font-black mb-4">{selectedPost.title}</h2>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6">{selectedPost.description}</p>
                    <div className="flex items-center gap-6">
                      <button onClick={(e) => handleLike(e, selectedPost._id)} className={`flex items-center gap-2 group ${selectedPost.likes.includes(currentUser) ? "text-red-500" : "text-gray-400"}`}>
                        <Heart size={24} fill={selectedPost.likes.includes(currentUser) ? "currentColor" : "none"} className="group-hover:scale-110 transition-transform" />
                        <span className="font-black text-lg">{selectedPost.likes.length}</span>
                      </button>
                      <div className="text-gray-400 flex items-center gap-2">
                        <MessageCircle size={24} />
                        <span className="font-black text-lg">{selectedPost.comments.length}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-10 space-y-8 bg-white/[0.01] custom-scrollbar">
                    {selectedPost.comments.map((c) => (
                      <div key={c._id} className="group flex justify-between items-start">
                        <div className="flex gap-4">
                            <div className="w-8 h-8 bg-white/5 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold border border-white/10">{c.username?.charAt(0).toUpperCase()}</div>
                            <div className="flex-1">
                                <Link to={`/profile/${c.username}`} className="text-[11px] font-black text-blue-500 uppercase tracking-tighter hover:text-blue-400 transition-colors">{c.username}</Link>
                                <p className="text-gray-300 text-sm mt-1 leading-snug">{c.text}</p>
                            </div>
                        </div>
                        {c.username === currentUser && (
                          <button onClick={() => handleDeleteComment(c._id)} className="text-gray-700 hover:text-red-500 transition-all ml-4 flex-shrink-0">
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <form onSubmit={handleCommentSubmit} className="p-8 bg-[#161b22]/50 border-t border-white/5">
                    <div className="relative">
                      <input type="text" placeholder="Join the discussion..." className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 pl-8 pr-16 text-sm outline-none focus:border-blue-500/50" value={commentText} onChange={(e) => setCommentText(e.target.value)} />
                      <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-blue-600 rounded-xl text-white hover:bg-blue-500 transition-all">
                        <Send size={18} />
                      </button>
                    </div>
                  </form>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
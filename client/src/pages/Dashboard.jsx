import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Image as ImageIcon, Loader, Upload, Link as LinkIcon, Trash2, Camera, Pencil, X, Heart, MessageCircle } from "lucide-react";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  
  // Form States
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState(""); // For URL type
  const [imageFile, setImageFile] = useState(null); // For Physical File
  const [loading, setLoading] = useState(false);
  const [uploadType, setUploadType] = useState("file");

  // Avatar State
  const [avatar, setAvatar] = useState("");

  // EDIT MODE STATE
  const [editMode, setEditMode] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(null);

  // BACKEND URL CONFIG
  const PF = "https://meraki-art.onrender.com";

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setAvatar(storedUser.profilePic || "");
      fetchUserPosts(storedUser.username);
    }
  }, []);

  const fetchUserPosts = async (username) => {
    try {
      const res = await axios.get(`${PF}/api/posts/profile/${username}`);
      setPosts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", desc);
    formData.append("tags", tags);
    formData.append("userId", user._id);

    if (uploadType === "file") {
      if (!imageFile && !editMode) {
        alert("Please select a file");
        setLoading(false);
        return;
      }
      if (imageFile) formData.append("image", imageFile);
    } else {
      formData.append("image", image); // Sending the URL string
    }

    try {
      const token = JSON.parse(localStorage.getItem("user")).token;
      
      if (editMode) {
        await axios.put(`${PF}/api/posts/${currentPostId}`, formData, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
        alert("Post updated!");
      } else {
        await axios.post(`${PF}/api/posts`, formData, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
        alert("Post created!");
      }

      // Reset form
      setTitle("");
      setDesc("");
      setTags("");
      setImage("");
      setImageFile(null);
      setEditMode(false);
      fetchUserPosts(user.username);
    } catch (err) {
      console.error(err);
      alert("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Delete this art?")) return;
    try {
      const token = JSON.parse(localStorage.getItem("user")).token;
      await axios.delete(`${PF}/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUserPosts(user.username);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditInit = (post) => {
    setEditMode(true);
    setCurrentPostId(post._id);
    setTitle(post.title);
    setDesc(post.description);
    setTags(post.tags.join(", "));
    setUploadType("url");
    setImage(post.image);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("profilePic", file);
    formData.append("userId", user._id);

    try {
      const token = JSON.parse(localStorage.getItem("user")).token;
      const res = await axios.put(`${PF}/api/auth/profile-pic`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      });
      setAvatar(res.data.profilePic);
      const updatedUser = { ...user, profilePic: res.data.profilePic };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      alert("Profile picture updated!");
    } catch (err) {
      console.log(err);
      alert("Failed to update avatar");
    }
  };

  const getImageUrl = (imgStr) => {
    if (!imgStr) return "";
    return imgStr.startsWith("http") ? imgStr : PF + imgStr;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* PROFILE SECTION */}
        <div className="bg-gray-800 rounded-2xl p-6 mb-8 border border-gray-700 shadow-xl flex flex-col md:flex-row items-center gap-6">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 shadow-2xl bg-gray-700">
              {avatar ? (
                <img src={getImageUrl(avatar)} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Camera size={40} className="text-gray-500" />
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-500 transition shadow-lg">
              <Upload size={16} />
              <input type="file" className="hidden" onChange={handleAvatarChange} />
            </label>
          </div>
          
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-white">{user?.username}</h1>
            <p className="text-gray-400">{user?.email}</p>
            <div className="flex gap-4 mt-3">
              <div className="text-center">
                <p className="text-xl font-bold text-blue-400">{posts.length}</p>
                <p className="text-xs text-gray-500 uppercase">Artworks</p>
              </div>
            </div>
          </div>
        </div>

        {/* UPLOAD SECTION */}
        <div className="bg-gray-800 rounded-2xl p-6 mb-12 border border-gray-700 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-600/20 p-2 rounded-lg">
              {editMode ? <Pencil className="text-blue-500" /> : <Plus className="text-blue-500" />}
            </div>
            <h2 className="text-xl font-bold">{editMode ? "Edit Artwork" : "Upload New Art"}</h2>
            {editMode && (
              <button onClick={() => { setEditMode(false); setTitle(""); setDesc(""); setTags(""); setImage(""); }} className="ml-auto text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <input 
                type="text" placeholder="Artwork Title" 
                className="w-full bg-gray-900 border border-gray-700 p-3 rounded-xl focus:border-blue-500 outline-none transition"
                value={title} onChange={(e) => setTitle(e.target.value)} required 
              />
              <textarea 
                placeholder="Tell the story behind this piece..." 
                className="w-full bg-gray-900 border border-gray-700 p-3 rounded-xl focus:border-blue-500 outline-none h-32 transition"
                value={desc} onChange={(e) => setDesc(e.target.value)}
              />
              <input 
                type="text" placeholder="Tags (comma separated)" 
                className="w-full bg-gray-900 border border-gray-700 p-3 rounded-xl focus:border-blue-500 outline-none transition"
                value={tags} onChange={(e) => setTags(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <div className="flex bg-gray-900 p-1 rounded-xl border border-gray-700">
                <button 
                  type="button" onClick={() => setUploadType("file")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition ${uploadType === "file" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"}`}
                >
                  <Upload size={18} /> File
                </button>
                <button 
                  type="button" onClick={() => setUploadType("url")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition ${uploadType === "url" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"}`}
                >
                  <LinkIcon size={18} /> URL
                </button>
              </div>

              {uploadType === "file" ? (
                <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-blue-500 transition cursor-pointer relative">
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
                  <ImageIcon className="mx-auto text-gray-500 mb-2" size={40} />
                  <p className="text-gray-400 text-sm">{imageFile ? imageFile.name : "Click or drag to upload artwork"}</p>
                </div>
              ) : (
                <input 
                  type="text" placeholder="Paste Image URL" 
                  className="w-full bg-gray-900 border border-gray-700 p-3 rounded-xl focus:border-blue-500 outline-none transition"
                  value={image} onChange={(e) => setImage(e.target.value)}
                />
              )}

              <button 
                type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg transition flex items-center justify-center gap-2"
              >
                {loading ? <Loader className="animate-spin" /> : (editMode ? "Save Changes" : "Publish Artwork")}
              </button>
            </div>
          </form>
        </div>

        {/* ARTWORK GRID */}
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <ImageIcon className="text-blue-500" /> Your Collection
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div key={post._id} className="group bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 hover:border-blue-500 transition shadow-lg relative">
                
                {/* Actions Overlay */}
                <div className="absolute top-3 right-3 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition">
                    <button onClick={() => handleEditInit(post)} className="bg-yellow-600 p-1.5 rounded-full text-white hover:bg-yellow-500"><Pencil size={16} /></button>
                    <button onClick={() => handleDelete(post._id)} className="bg-red-600 p-1.5 rounded-full text-white hover:bg-red-500"><Trash2 size={16} /></button>
                </div>

                <div className="h-48 overflow-hidden relative">
                  <img src={getImageUrl(post.image)} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-white">{post.title}</h3>
                  <p className="text-gray-400 text-sm truncate">{post.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex gap-2">
                      <span className="flex items-center gap-1 text-xs text-gray-400"><Heart size={14} /> {post.likes?.length || 0}</span>
                      <span className="flex items-center gap-1 text-xs text-gray-400"><MessageCircle size={14} /> {post.comments?.length || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
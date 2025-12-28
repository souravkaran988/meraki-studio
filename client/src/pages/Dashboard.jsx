import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Image as ImageIcon, Loader, Upload, Link as LinkIcon, Trash2, Camera, Pencil, X } from "lucide-react";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  
  // Form States with Placeholders
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadType, setUploadType] = useState("file");

  // Avatar State
  const [avatar, setAvatar] = useState("");

  // Edit Mode State
  const [editMode, setEditMode] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(null);

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

  const getImageUrl = (imgStr) => {
    if (!imgStr) return "";
    return imgStr.startsWith("http") || imgStr.startsWith("data") ? imgStr : PF + imgStr;
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
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

  const resetForm = () => {
    setEditMode(false);
    setCurrentPostId(null);
    setTitle("");
    setDesc("");
    setTags("");
    setImage("");
    setImageFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("userId", user._id);
    formData.append("title", title);
    formData.append("description", desc);
    formData.append("tags", tags);

    if (uploadType === "file" && imageFile) {
      formData.append("image", imageFile);
    } else {
      formData.append("image", image); 
    }

    try {
      if (editMode) {
        await axios.put(`${PF}/api/posts/${currentPostId}`, formData);
        alert("Artwork Updated Successfully!");
      } else {
        await axios.post(`${PF}/api/posts`, formData);
        alert("Artwork Published Successfully!");
      }
      resetForm();
      fetchUserPosts(user.username);
    } catch (err) {
      console.log(err);
      alert("Submission failed. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this artwork?")) return;
    try {
      await axios.delete(`${PF}/api/posts/${postId}`);
      // Remove from UI immediately
      setPosts((prev) => prev.filter((p) => p._id !== postId));
      alert("Deleted successfully!");
    } catch (err) {
      console.log(err);
      alert("Delete failed.");
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePic", file);
    formData.append("userId", user._id);

    try {
      const res = await axios.put(`${PF}/api/auth/profile-pic`, formData);
      const updatedUser = { ...user, profilePic: res.data.profilePic };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setAvatar(res.data.profilePic);
      window.location.reload(); // Reload to sync with Navbar
    } catch (err) {
      console.log(err);
      alert("Failed to update profile picture.");
    }
  };

  if (!user) return <div className="text-white text-center mt-20">Please Login to view Dashboard.</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Profile Info Section */}
        <div className="bg-gray-800 rounded-2xl p-6 mb-8 border border-gray-700 flex items-center gap-6 shadow-xl">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 bg-gray-700 shadow-2xl">
              <img 
                src={getImageUrl(avatar)} 
                alt="Avatar" 
                className="w-full h-full object-cover" 
                onError={(e) => e.target.src = "https://via.placeholder.com/150"}
              />
            </div>
            <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-500 transition shadow-lg">
              <Camera size={18} />
              <input type="file" className="hidden" onChange={handleAvatarChange} accept="image/*" />
            </label>
          </div>
          <div>
            <h1 className="text-3xl font-bold">{user.username}</h1>
            <p className="text-gray-400">Manage your art and profile</p>
          </div>
        </div>

        {/* Upload & Edit Form Section */}
        <div className={`bg-gray-800 rounded-2xl p-6 mb-12 border shadow-xl transition-all ${editMode ? "border-yellow-500" : "border-gray-700"}`}>
          <h2 className="text-xl font-bold mb-6 flex items-center justify-between">
            <span className="flex items-center gap-2">
              {editMode ? <Pencil className="text-yellow-500" /> : <Plus className="text-blue-500" />}
              {editMode ? "Edit This Artwork" : "Share New Art"}
            </span>
            {editMode && (
              <button onClick={resetForm} className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
                <X size={14} /> Cancel Edit
              </button>
            )}
          </h2>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-gray-500 ml-1">Artwork Title</label>
                <input type="text" placeholder="e.g. Moonlight Over Mountains" className="w-full bg-gray-900 border border-gray-700 p-3 rounded-xl focus:border-blue-500 outline-none" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-500 ml-1">Description</label>
                <textarea placeholder="Describe your creative process or the story behind this piece..." className="w-full bg-gray-900 border border-gray-700 p-3 rounded-xl focus:border-blue-500 outline-none h-32" value={desc} onChange={(e) => setDesc(e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-500 ml-1">Tags</label>
                <input type="text" placeholder="nature, abstract, painting (separate with commas)" className="w-full bg-gray-900 border border-gray-700 p-3 rounded-xl focus:border-blue-500 outline-none" value={tags} onChange={(e) => setTags(e.target.value)} />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex bg-gray-900 p-1 rounded-xl border border-gray-700">
                <button type="button" onClick={() => setUploadType("file")} className={`flex-1 py-2 rounded-lg transition font-medium ${uploadType === "file" ? "bg-blue-600 text-white" : "text-gray-400"}`}>Upload File</button>
                <button type="button" onClick={() => setUploadType("url")} className={`flex-1 py-2 rounded-lg transition font-medium ${uploadType === "url" ? "bg-blue-600 text-white" : "text-gray-400"}`}>External URL</button>
              </div>

              {uploadType === "file" ? (
                <div className="border-2 border-dashed border-gray-700 rounded-xl p-10 text-center hover:border-blue-500 transition cursor-pointer relative bg-gray-900/50">
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
                  <Upload className="mx-auto text-blue-500 mb-3" size={40} />
                  <p className="text-gray-300 font-medium">{imageFile ? imageFile.name : "Choose an image file"}</p>
                  <p className="text-gray-500 text-xs mt-1">Supports JPG, PNG, WEBP</p>
                </div>
              ) : (
                <div className="space-y-1">
                   <label className="text-xs text-gray-500 ml-1">Image Link</label>
                   <input type="text" placeholder="https://example.com/my-art.jpg" className="w-full bg-gray-900 border border-gray-700 p-3 rounded-xl focus:border-blue-500 outline-none" value={image} onChange={(e) => setImage(e.target.value)} />
                </div>
              )}

              <button type="submit" disabled={loading} className={`w-full py-4 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg ${editMode ? "bg-yellow-600 hover:bg-yellow-500" : "bg-blue-600 hover:bg-blue-500"}`}>
                {loading ? <Loader className="animate-spin" /> : (editMode ? "Update Artwork" : "Publish Artwork")}
              </button>
            </div>
          </form>
        </div>

        {/* User's Uploaded Art Gallery */}
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <ImageIcon className="text-blue-500" size={24}/> My Art Collection
        </h2>
        
        {posts.length === 0 ? (
          <div className="text-center py-20 bg-gray-800 rounded-2xl border border-gray-700 border-dashed text-gray-500">
             You haven't uploaded any art yet. Use the form above to start!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div key={post._id} className="group bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-all relative shadow-lg">
                <div className="absolute top-3 right-3 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEditInit(post)} className="bg-yellow-600 p-2 rounded-full text-white hover:bg-yellow-500 shadow-lg" title="Edit"><Pencil size={14}/></button>
                  <button onClick={() => handleDelete(post._id)} className="bg-red-600 p-2 rounded-full text-white hover:bg-red-500 shadow-lg" title="Delete"><Trash2 size={14}/></button>
                </div>
                <div className="h-56 overflow-hidden">
                  <img src={getImageUrl(post.image)} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-white truncate">{post.title}</h3>
                  <p className="text-gray-400 text-xs mt-1 flex gap-2">
                    {post.tags.slice(0, 3).map((t, i) => <span key={i}>#{t}</span>)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
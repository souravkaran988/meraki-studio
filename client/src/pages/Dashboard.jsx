import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Image as ImageIcon, Loader, Upload, Link as LinkIcon, Trash2, Camera, Pencil, X } from "lucide-react";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  
  // Form States
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

  const getImageUrl = (imgStr) => {
    if (!imgStr) return "";
    return imgStr.startsWith("http") || imgStr.startsWith("data") ? imgStr : PF + imgStr;
  };

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

  // FIXED: UPLOAD & EDIT LOGIC (Using FormData to support file uploads)
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
        alert("Artwork Updated!");
      } else {
        await axios.post(`${PF}/api/posts`, formData);
        alert("Artwork Published!");
      }
      resetForm();
      fetchUserPosts(user.username);
    } catch (err) {
      console.log(err);
      alert("Upload failed. Make sure all fields are filled.");
    } finally {
      setLoading(false);
    }
  };

  // FIXED: DELETE LOGIC (Updates UI immediately)
  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this art permanently?")) return;
    try {
      await axios.delete(`${PF}/api/posts/${postId}`);
      // Filter out the deleted post from the current state so it disappears instantly
      setPosts((prevPosts) => prevPosts.filter((p) => p._id !== postId));
      alert("Deleted successfully!");
    } catch (err) {
      console.log(err);
      alert("Failed to delete.");
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = async () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            const MAX_WIDTH = 200;
            const scaleSize = MAX_WIDTH / img.width;
            canvas.width = MAX_WIDTH;
            canvas.height = img.height * scaleSize;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const compressedAvatar = canvas.toDataURL("image/jpeg", 0.7);
            setAvatar(compressedAvatar);
            try {
                const res = await axios.put(`${PF}/api/users/${user._id}`, {
                    userId: user._id,
                    profilePic: compressedAvatar
                });
                const updatedUser = { ...user, profilePic: res.data.profilePic };
                localStorage.setItem("user", JSON.stringify(updatedUser));
                setUser(updatedUser);
                window.location.reload();
            } catch (err) { console.log(err); }
        };
      };
    }
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  if (!user) return <div className="text-white text-center mt-20">Please Login to view Dashboard.</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Profile Card Section */}
        <div className="bg-gray-800 rounded-2xl p-6 mb-8 border border-gray-700 shadow-xl flex flex-col md:flex-row items-center gap-6">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 shadow-2xl bg-gray-700">
              <img 
                src={getImageUrl(avatar)} 
                alt="Avatar" 
                className="w-full h-full object-cover" 
                onError={(e) => e.target.src = "https://via.placeholder.com/150"}
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <Camera size={24} className="text-white" />
              </div>
            </div>
            <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-500 transition shadow-lg">
              <Upload size={16} />
              <input type="file" className="hidden" onChange={handleAvatarChange} accept="image/*" />
            </label>
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold">{user.username}</h1>
            <p className="text-gray-400">{user.email}</p>
          </div>
        </div>

        {/* Upload/Edit Form Section */}
        <div className={`bg-gray-800 rounded-2xl p-6 mb-12 border shadow-xl transition-colors ${editMode ? "border-yellow-500" : "border-gray-700"}`}>
          <h2 className="text-xl font-bold mb-6 flex items-center justify-between">
            <span className="flex items-center gap-2">
              {editMode ? <Pencil className="text-yellow-500" /> : <Plus className="text-blue-500" />}
              {editMode ? "Edit Artwork" : "Upload New Art"}
            </span>
            {editMode && (
              <button onClick={resetForm} className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
                <X size={14} /> Cancel Edit
              </button>
            )}
          </h2>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <input type="text" placeholder="Artwork Title" className="w-full bg-gray-900 border border-gray-700 p-3 rounded-xl focus:border-blue-500 outline-none" value={title} onChange={(e) => setTitle(e.target.value)} required />
              <textarea placeholder="Tell the story of this art..." className="w-full bg-gray-900 border border-gray-700 p-3 rounded-xl focus:border-blue-500 outline-none h-32" value={desc} onChange={(e) => setDesc(e.target.value)} />
              <input type="text" placeholder="Tags (e.g. digital, neon, nature)" className="w-full bg-gray-900 border border-gray-700 p-3 rounded-xl focus:border-blue-500 outline-none" value={tags} onChange={(e) => setTags(e.target.value)} />
            </div>
            
            <div className="space-y-4">
              <div className="flex bg-gray-900 p-1 rounded-xl border border-gray-700">
                <button type="button" onClick={() => setUploadType("file")} className={`flex-1 py-2 rounded-lg transition ${uploadType === "file" ? "bg-blue-600 text-white" : "text-gray-400"}`}>Local File</button>
                <button type="button" onClick={() => setUploadType("url")} className={`flex-1 py-2 rounded-lg transition ${uploadType === "url" ? "bg-blue-600 text-white" : "text-gray-400"}`}>Image URL</button>
              </div>

              {uploadType === "file" ? (
                <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-blue-500 transition cursor-pointer relative">
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
                  <ImageIcon className="mx-auto text-gray-500 mb-2" size={40} />
                  <p className="text-gray-400 text-sm">{imageFile ? imageFile.name : "Click to select Artwork"}</p>
                </div>
              ) : (
                <input type="text" placeholder="Paste image link here..." className="w-full bg-gray-900 border border-gray-700 p-3 rounded-xl focus:border-blue-500 outline-none" value={image} onChange={(e) => setImage(e.target.value)} />
              )}

              <button type="submit" disabled={loading} className={`w-full py-4 rounded-xl font-bold transition flex items-center justify-center gap-2 ${editMode ? "bg-yellow-600 hover:bg-yellow-500" : "bg-blue-600 hover:bg-blue-500"}`}>
                {loading ? <Loader className="animate-spin" /> : (editMode ? "Save Changes" : "Publish Artwork")}
              </button>
            </div>
          </form>
        </div>

        {/* Gallery Section */}
        <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2 flex items-center gap-2">
          <ImageIcon className="text-blue-500" size={24}/> My Gallery
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post._id} className="group bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-all relative shadow-md">
              <div className="absolute top-3 right-3 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEditInit(post)} className="bg-yellow-600 p-2 rounded-full text-white hover:bg-yellow-500" title="Edit"><Pencil size={14}/></button>
                <button onClick={() => handleDelete(post._id)} className="bg-red-600 p-2 rounded-full text-white hover:bg-red-500" title="Delete"><Trash2 size={14}/></button>
              </div>
              <div className="h-48 overflow-hidden">
                <img src={getImageUrl(post.image)} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg text-white">{post.title}</h3>
                <p className="text-gray-400 text-sm truncate mb-2">{post.description}</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="text-xs bg-gray-700 text-blue-300 px-2 py-1 rounded-full">#{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
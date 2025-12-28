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
  const [loading, setLoading] = useState(false);
  const [uploadType, setUploadType] = useState("file");

  // Avatar State
  const [avatar, setAvatar] = useState("");

  // EDIT MODE STATE
  const [editMode, setEditMode] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(null);

  // FIX: Added the Backend URL prefix
  const PF = "https://meraki-art.onrender.com";

  // FIX: Helper to attach Backend URL to image paths
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

  const handleEditClick = (post) => {
    setEditMode(true);
    setCurrentPostId(post._id);
    setTitle(post.title);
    setDesc(post.description);
    setTags(post.tags.join(", "));
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !image) return alert("Title and Image are required!");
    setLoading(true);
    try {
      const postData = {
        user: user._id,
        title,
        description: desc,
        tags: tags.split(",").map(tag => tag.trim()),
        image, 
      };
      if (editMode) {
        await axios.put(`${PF}/api/posts/${currentPostId}`, postData);
        alert("Post Updated Successfully!");
      } else {
        await axios.post(`${PF}/api/posts`, postData);
      }
      resetForm();
      fetchUserPosts(user.username);
    } catch (err) {
      console.log(err);
      alert("Operation failed!");
    } finally {
      setLoading(false);
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
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const MAX_WIDTH = 800;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.7);
          setImage(compressedDataUrl);
        };
      };
    }
  };

  const handleDelete = async (postId) => {
    if(window.confirm("Are you sure you want to delete this art?")) {
      try {
        await axios.delete(`${PF}/api/posts/${postId}`);
        setPosts(posts.filter(p => p._id !== postId));
        if (currentPostId === postId) resetForm();
      } catch (err) {
        console.log(err);
      }
    }
  };

  if (!user) return <div className="text-white text-center mt-20">Please Login to view Dashboard.</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 text-center">
             <div className="relative w-24 h-24 mx-auto mb-4 group cursor-pointer">
                {/* FIX: Use getImageUrl helper */}
                <img src={getImageUrl(avatar)} alt="Avatar" className="w-full h-full rounded-full object-cover border-4 border-gray-700" onError={(e) => e.target.src = "https://via.placeholder.com/150"}/>
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <Camera size={24} className="text-white" />
                </div>
                <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleAvatarChange} />
             </div>
             <h3 className="font-bold text-xl">{user.username}</h3>
             <p className="text-xs text-gray-400 mt-1">Click image to change avatar</p>
          </div>

          <div className={`p-6 rounded-lg shadow-lg border sticky top-24 transition-colors ${editMode ? "bg-blue-900/20 border-blue-500" : "bg-gray-800 border-gray-700"}`}>
            <h2 className="text-xl font-bold mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                {editMode ? <Pencil className="text-yellow-400" /> : <Plus className="text-blue-500" />} 
                {editMode ? "Edit Artwork" : "Upload New Art"}
              </span>
              {editMode && (
                <button onClick={resetForm} className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
                  <X size={14} /> Cancel
                </button>
              )}
            </h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-sm text-gray-400">Title <span className="text-red-500">*</span></label>
                <input type="text" placeholder="e.g. Cyberpunk City" className="w-full bg-gray-700 p-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Image Source <span className="text-red-500">*</span></label>
                <div className="flex gap-2 mb-2">
                  <button type="button" onClick={() => setUploadType("file")} className={`flex-1 p-2 text-sm rounded flex gap-2 justify-center ${uploadType === "file" ? "bg-blue-600" : "bg-gray-700"}`}>
                    <Upload size={16} /> File
                  </button>
                  <button type="button" onClick={() => setUploadType("url")} className={`flex-1 p-2 text-sm rounded flex gap-2 justify-center ${uploadType === "url" ? "bg-blue-600" : "bg-gray-700"}`}>
                    <LinkIcon size={16} /> URL
                  </button>
                </div>

                {uploadType === "file" ? (
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition relative">
                    <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <div className="text-gray-400">
                      <Upload className="mx-auto mb-2" />
                      <span className="text-xs">Click to Change JPG/PNG</span>
                    </div>
                  </div>
                ) : (
                  <input type="text" placeholder="https://..." value={image.startsWith("data") ? "" : image} className="w-full bg-gray-700 p-2 rounded border border-gray-600" onChange={(e) => setImage(e.target.value)} />
                )}

                {image && (
                  <div className="mt-2 h-32 w-full overflow-hidden rounded border border-gray-600">
                    {/* FIX: Use getImageUrl helper */}
                    <img src={getImageUrl(image)} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-400">Description</label>
                <textarea rows="3" placeholder="Description..." className="w-full bg-gray-700 p-2 rounded border border-gray-600" value={desc} onChange={(e) => setDesc(e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-gray-400">Tags</label>
                <input type="text" placeholder="nature, neon" className="w-full bg-gray-700 p-2 rounded border border-gray-600" value={tags} onChange={(e) => setTags(e.target.value)} />
              </div>

              <button disabled={loading} className={`text-white p-2 rounded font-bold transition flex justify-center ${editMode ? "bg-yellow-600 hover:bg-yellow-500" : "bg-blue-600 hover:bg-blue-500"}`}>
                {loading ? <Loader className="animate-spin" /> : (editMode ? "Update Artwork" : "Upload Artwork")}
              </button>
            </form>
          </div>
        </div>

        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">My Gallery</h2>
          {posts.length === 0 ? (
            <div className="text-gray-500 text-center py-20 bg-gray-800 rounded-lg border border-gray-700 border-dashed">
              <ImageIcon size={48} className="mx-auto mb-2 opacity-50" />
              <p>No artwork uploaded yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {posts.map((post) => (
                <div key={post._id} className={`bg-gray-800 rounded-lg overflow-hidden shadow-md border group relative transition ${currentPostId === post._id ? "border-yellow-500 ring-2 ring-yellow-500/50" : "border-gray-700"}`}>
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition z-10">
                     <button onClick={() => handleEditClick(post)} className="bg-yellow-600 p-1.5 rounded-full text-white hover:bg-yellow-500" title="Edit Art"><Pencil size={16} /></button>
                     <button onClick={() => handleDelete(post._id)} className="bg-red-600 p-1.5 rounded-full text-white hover:bg-red-500" title="Delete Art"><Trash2 size={16} /></button>
                  </div>
                  <div className="h-48 overflow-hidden relative">
                    {/* FIX: Use getImageUrl helper */}
                    <img src={getImageUrl(post.image)} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-white">{post.title}</h3>
                    <p className="text-gray-400 text-sm truncate">{post.description}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <span key={index} className="text-xs bg-gray-700 text-blue-300 px-2 py-1 rounded-full">#{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
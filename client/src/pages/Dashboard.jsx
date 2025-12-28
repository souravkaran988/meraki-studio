import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Image as ImageIcon, Loader, Upload, Link as LinkIcon, Trash2, Camera, Pencil, X, Heart, MessageCircle } from "lucide-react";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadType, setUploadType] = useState("file");
  const [avatar, setAvatar] = useState("");
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
    } catch (err) { console.log(err); }
  };

  const handleFileChange = (e) => setImageFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", desc);
    formData.append("tags", tags);
    formData.append("userId", user._id); // CRITICAL: Tell backend which user this is

    if (uploadType === "file" && imageFile) {
      formData.append("image", imageFile);
    } else {
      formData.append("image", image);
    }

    try {
      if (editMode) {
        await axios.put(`${PF}/api/posts/${currentPostId}`, formData);
      } else {
        await axios.post(`${PF}/api/posts`, formData);
      }
      // Reset form
      setTitle(""); setDesc(""); setTags(""); setImage(""); setImageFile(null); setEditMode(false);
      fetchUserPosts(user.username);
    } catch (err) {
      console.error(err);
      alert("Upload failed. Check console.");
    } finally { setLoading(false); }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("profilePic", file);
    formData.append("userId", user._id); // CRITICAL

    try {
      const res = await axios.put(`${PF}/api/auth/profile-pic`, formData);
      setAvatar(res.data.profilePic);
      const updatedUser = { ...user, profilePic: res.data.profilePic };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      alert("Avatar Updated!");
    } catch (err) { console.log(err); }
  };

  const getImageUrl = (imgStr) => {
    if (!imgStr) return "";
    return imgStr.startsWith("http") ? imgStr : PF + imgStr;
  };

  // ... keep all your UI return logic exactly as it was ...
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-gray-800 rounded-2xl p-6 mb-8 border border-gray-700 flex items-center gap-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 bg-gray-700">
              {avatar ? <img src={getImageUrl(avatar)} alt="Avatar" className="w-full h-full object-cover" /> : <Camera size={40} className="m-auto mt-8 text-gray-500" />}
            </div>
            <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-500">
              <Upload size={16} />
              <input type="file" className="hidden" onChange={handleAvatarChange} />
            </label>
          </div>
          <div>
            <h1 className="text-3xl font-bold">{user?.username}</h1>
            <p className="text-gray-400">{user?.email}</p>
          </div>
        </div>

        {/* Upload Form */}
        <div className="bg-gray-800 rounded-2xl p-6 mb-12 border border-gray-700 shadow-xl">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <input type="text" placeholder="Title" className="w-full bg-gray-900 border border-gray-700 p-3 rounded-xl" value={title} onChange={(e)=>setTitle(e.target.value)} required />
              <textarea placeholder="Story..." className="w-full bg-gray-900 border border-gray-700 p-3 rounded-xl h-32" value={desc} onChange={(e)=>setDesc(e.target.value)} />
              <input type="text" placeholder="Tags (comma separated)" className="w-full bg-gray-900 border border-gray-700 p-3 rounded-xl" value={tags} onChange={(e)=>setTags(e.target.value)} />
            </div>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center relative">
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
                <ImageIcon className="mx-auto text-gray-500 mb-2" size={40} />
                <p className="text-gray-400 text-sm">{imageFile ? imageFile.name : "Select Art"}</p>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-blue-600 py-4 rounded-xl font-bold">
                {loading ? "Uploading..." : "Publish Artwork"}
              </button>
            </div>
          </form>
        </div>

        {/* Collection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post._id} className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700">
              <img src={getImageUrl(post.image)} alt={post.title} className="h-48 w-full object-cover" />
              <div className="p-4">
                <h3 className="font-bold">{post.title}</h3>
                <p className="text-gray-400 text-sm truncate">{post.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
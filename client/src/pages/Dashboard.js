// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import API from "../api";
// import { 
//   Upload, Trash2, Edit3, Camera, Image as ImageIcon, Sparkles, 
//   Search, Check, Heart, MessageCircle, Send
// } from "lucide-react";

// const Dashboard = () => {
//   const { username } = useParams();
//   const [posts, setPosts] = useState([]);
//   const [filteredPosts, setFilteredPosts] = useState([]);
//   const [profile, setProfile] = useState({ bio: "", avatar: "", banner: "" });
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isEditingBio, setIsEditingBio] = useState(false);
  
//   // Create/Edit Post States
//   const [formData, setFormData] = useState({ title: "", description: "", tags: "", image: "" });
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [editId, setEditId] = useState(null);

//   const fetchData = async () => {
//     try {
//       const postsRes = await axios.get(`http://localhost:5000/api/posts/user/${username}`);
//       const profileRes = await axios.get(`http://localhost:5000/api/profile/${username}`);
//       setPosts(postsRes.data);
//       setFilteredPosts(postsRes.data);
//       setProfile(profileRes.data);
//     } catch (err) { console.error(err); }
//   };

//   useEffect(() => { fetchData(); }, [username]);

//   // Handle Search
//   useEffect(() => {
//     const results = posts.filter(post =>
//       post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
//     );
//     setFilteredPosts(results);
//   }, [searchTerm, posts]);

//   // Profile Uploads
//   const handleProfileUpload = async (type, file) => {
//     if (!file) return;
//     const data = new FormData();
//     if (type === 'avatar') data.append("avatarFile", file);
//     if (type === 'banner') data.append("bannerFile", file);

//     try {
//       await axios.put(`http://localhost:5000/api/profile/${username}`, data);
//       fetchData();
//     } catch (err) { console.error(err); }
//   };

//  const handleUpdateBio = async () => {
//   try {
//     // We use FormData to stay consistent with the profile route
//     const data = new FormData();
//     data.append("bio", profile.bio);

//     const res = await axios.put(`http://localhost:5000/api/profile/${username}`, data);
    
//     if (res.data) {
//       setProfile(res.data); // Update state with the newly saved bio
//       setIsEditingBio(false);
//       // Optional: fetch data again to be 100% sure
//       fetchData(); 
//     }
//   } catch (err) { 
//     console.error("Bio save error:", err);
//   }
// };

//   // Post Actions
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     const data = new FormData();
//     data.append("username", username);
//     data.append("title", formData.title);
//     data.append("description", formData.description);
//     data.append("tags", formData.tags);
//     if (file) data.append("imageFile", file);
//     else data.append("imageUrl", formData.image);

//     try {
//       if (editId) {
//         await axios.put(`http://localhost:5000/api/posts/${editId}`, data);
//       } else {
//         await axios.post("http://localhost:5000/api/posts", data);
//       }
//       setFormData({ title: "", description: "", tags: "", image: "" });
//       setFile(null);
//       setEditId(null);
//       fetchData();
//     } catch (err) { console.error(err); }
//     setLoading(false);
//   };

//   const handleEdit = (post) => {
//     setEditId(post._id);
//     setFormData({ title: post.title, description: post.description, tags: post.tags.join(", "), image: post.image });
//     window.scrollTo({ top: 400, behavior: 'smooth' });
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Delete this masterpiece?")) {
//       await axios.delete(`http://localhost:5000/api/posts/${id}`);
//       fetchData();
//     }
//   };

//   const totalLikes = posts.reduce((acc, post) => acc + post.likes.length, 0);
//   const totalComments = posts.reduce((acc, post) => acc + post.comments.length, 0);

//   return (
//     <div className="max-w-7xl mx-auto px-6 py-10 text-white">
      
//       {/* 1. PROFILE HEADER */}
//       <div className="relative mb-12 rounded-[3.5rem] overflow-hidden bg-[#161b22] border border-white/10 shadow-2xl">
//         <div className="h-72 relative group bg-gradient-to-r from-blue-900/40 to-cyan-900/40">
//           {profile.banner ? (
//             <img src={profile.banner} className="w-full h-full object-cover" alt="banner" />
//           ) : (
//             <div className="w-full h-full flex items-center justify-center text-gray-700 font-black italic opacity-20 text-2xl tracking-tighter uppercase">Studio Banner</div>
//           )}
//           <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer backdrop-blur-sm">
//             <Camera size={32} />
//             <input type="file" className="hidden" onChange={(e) => handleProfileUpload('banner', e.target.files[0])} />
//           </label>
//         </div>

//         <div className="px-12 pb-10 flex flex-col md:flex-row items-end gap-8 -mt-20 relative z-10">
//           <div className="relative group">
//             <div className="w-44 h-44 rounded-[3rem] border-[10px] border-[#0d1117] overflow-hidden bg-blue-600 shadow-2xl">
//               {profile.avatar ? <img src={profile.avatar} className="w-full h-full object-cover" alt="avatar" /> : <div className="w-full h-full flex items-center justify-center text-5xl font-black">{username.charAt(0).toUpperCase()}</div>}
//             </div>
//             <label className="absolute inset-0 rounded-[3rem] bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer">
//               <Camera size={24} />
//               <input type="file" className="hidden" onChange={(e) => handleProfileUpload('avatar', e.target.files[0])} />
//             </label>
//           </div>

//           <div className="flex-1 mb-4">
//             <h1 className="text-5xl font-black italic tracking-tighter">@{username}</h1>
//             <div className="flex items-center gap-3 mt-3">
//               {isEditingBio ? (
//                 <div className="flex gap-2 w-full max-w-md">
//                   <input className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none w-full" value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})} />
//                   <button onClick={handleUpdateBio} className="p-2 bg-blue-600 rounded-xl hover:bg-blue-500"><Check size={18}/></button>
//                 </div>
//               ) : (
//                 <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setIsEditingBio(true)}>
//                   <p className="text-gray-400 font-medium italic">{profile.bio || "Click to add a bio..."}</p>
//                   <Edit3 size={14} className="text-blue-500 opacity-0 group-hover:opacity-100 transition-all"/>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* 2. STATS ROW */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
//         <div className="bg-[#161b22] border border-white/10 p-8 rounded-[2.5rem] flex items-center justify-between shadow-xl">
//           <div>
//             <p className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] mb-1">Creations</p>
//             <p className="text-3xl font-black">{posts.length}</p>
//           </div>
//           <div className="bg-white/5 p-4 rounded-2xl"><ImageIcon className="text-blue-500"/></div>
//         </div>
//         <div className="bg-[#161b22] border border-white/10 p-8 rounded-[2.5rem] flex items-center justify-between shadow-xl">
//           <div>
//             <p className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] mb-1">Total Likes</p>
//             <p className="text-3xl font-black">{totalLikes}</p>
//           </div>
//           <div className="bg-white/5 p-4 rounded-2xl"><Heart className="text-red-500"/></div>
//         </div>
//         <div className="bg-[#161b22] border border-white/10 p-8 rounded-[2.5rem] flex items-center justify-between shadow-xl">
//           <div>
//             <p className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] mb-1">Comments</p>
//             <p className="text-3xl font-black">{totalComments}</p>
//           </div>
//           <div className="bg-white/5 p-4 rounded-2xl"><MessageCircle className="text-cyan-500"/></div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
//         {/* 3. FORM SECTION */}
//         <div className="lg:col-span-4">
//           <div className="bg-[#161b22] border border-white/10 p-10 rounded-[3rem] sticky top-10 shadow-2xl">
//             <h2 className="text-2xl font-black mb-8 flex items-center gap-3 italic">
//               {editId ? <Edit3 className="text-blue-500"/> : <Sparkles className="text-blue-500"/>} 
//               {editId ? "Edit Post" : "New Post"}
//             </h2>
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <input type="text" placeholder="Title" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-blue-500/50" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
//               <textarea placeholder="Description" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 h-32 outline-none focus:border-blue-500/50" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
//               <input type="text" placeholder="Tags" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-blue-500/50" value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})} />
              
//               <div className="border-2 border-dashed border-white/10 rounded-[2rem] p-8 text-center hover:border-blue-500/50 transition-all relative">
//                 <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setFile(e.target.files[0])} />
//                 <Upload className="mx-auto text-gray-500 mb-2" />
//                 <p className="text-xs text-gray-500 font-bold uppercase">{file ? file.name : "Choose Artwork"}</p>
//               </div>

//               <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg">
//                 {loading ? "Publishing..." : editId ? "Update" : "Publish"}
//               </button>
//               {editId && <button onClick={() => { setEditId(null); setFormData({ title: "", description: "", tags: "", image: "" }); }} className="w-full text-xs font-bold text-gray-500 mt-2">Cancel</button>}
//             </form>
//           </div>
//         </div>

//         {/* 4. MANAGEMENT GRID */}
//         <div className="lg:col-span-8 space-y-8">
//           <div className="relative group">
//             <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
//             <input type="text" placeholder="Search studio..." className="w-full bg-[#161b22] border border-white/10 rounded-full py-6 pl-16 pr-8 outline-none focus:border-blue-500/50" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             {filteredPosts.map((post) => (
//               <div key={post._id} className="bg-[#161b22] border border-white/10 rounded-[2.5rem] overflow-hidden group">
//                 <div className="h-56 relative overflow-hidden">
//                   <img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={post.title} />
//                   <div className="absolute top-4 right-4 flex gap-2">
//                     <button onClick={() => handleEdit(post)} className="p-3 bg-black/50 backdrop-blur-md rounded-2xl text-white hover:bg-blue-600"><Edit3 size={18}/></button>
//                     <button onClick={() => handleDelete(post._id)} className="p-3 bg-black/50 backdrop-blur-md rounded-2xl text-white hover:bg-red-600"><Trash2 size={18}/></button>
//                   </div>
//                 </div>
//                 <div className="p-8">
//                   <h4 className="font-black text-xl mb-1 truncate">{post.title}</h4>
//                   <p className="text-gray-500 text-xs italic">Updated {new Date(post.updatedAt).toLocaleDateString()}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api.js"; // This is your custom instance
import { 
  Upload, Trash2, Edit3, Camera, Image as ImageIcon, Sparkles, 
  Search, Check, Heart, MessageCircle, Send
} from "lucide-react";

const Dashboard = () => {
  const { username } = useParams();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [profile, setProfile] = useState({ bio: "", avatar: "", banner: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditingBio, setIsEditingBio] = useState(false);
  
  const [formData, setFormData] = useState({ title: "", description: "", tags: "", image: "" });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchData = async () => {
    try {
      // Notice we use API and removed "http://localhost:5000"
      const postsRes = await API.get(`/api/posts/user/${username}`);
      const profileRes = await API.get(`/api/profile/${username}`);
      setPosts(postsRes.data);
      setFilteredPosts(postsRes.data);
      setProfile(profileRes.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchData(); }, [username]);

  useEffect(() => {
    const results = posts.filter(post =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredPosts(results);
  }, [searchTerm, posts]);

  const handleProfileUpload = async (type, file) => {
    if (!file) return;
    const data = new FormData();
    if (type === 'avatar') data.append("avatarFile", file);
    if (type === 'banner') data.append("bannerFile", file);

    try {
      await API.put(`/api/profile/${username}`, data);
      fetchData();
    } catch (err) { console.error(err); }
  };

  const handleUpdateBio = async () => {
    try {
      const data = new FormData();
      data.append("bio", profile.bio);
      const res = await API.put(`/api/profile/${username}`, data);
      if (res.data) {
        setProfile(res.data);
        setIsEditingBio(false);
        fetchData(); 
      }
    } catch (err) { console.error("Bio save error:", err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append("username", username);
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("tags", formData.tags);
    if (file) data.append("imageFile", file);
    else data.append("imageUrl", formData.image);

    try {
      if (editId) {
        await API.put(`/api/posts/${editId}`, data);
      } else {
        await API.post("/api/posts", data);
      }
      setFormData({ title: "", description: "", tags: "", image: "" });
      setFile(null);
      setEditId(null);
      fetchData();
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleEdit = (post) => {
    setEditId(post._id);
    setFormData({ title: post.title, description: post.description, tags: post.tags.join(", "), image: post.image });
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this masterpiece?")) {
      await API.delete(`/api/posts/${id}`);
      fetchData();
    }
  };

  const totalLikes = posts.reduce((acc, post) => acc + post.likes.length, 0);
  const totalComments = posts.reduce((acc, post) => acc + post.comments.length, 0);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 text-white">
      {/* (Rest of your JSX code remains the same as before) */}
      <div className="relative mb-12 rounded-[3.5rem] overflow-hidden bg-[#161b22] border border-white/10 shadow-2xl">
        <div className="h-72 relative group bg-gradient-to-r from-blue-900/40 to-cyan-900/40">
          {profile.banner ? (
            <img src={profile.banner} className="w-full h-full object-cover" alt="banner" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-700 font-black italic opacity-20 text-2xl tracking-tighter uppercase">Studio Banner</div>
          )}
          <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer backdrop-blur-sm">
            <Camera size={32} />
            <input type="file" className="hidden" onChange={(e) => handleProfileUpload('banner', e.target.files[0])} />
          </label>
        </div>

        <div className="px-12 pb-10 flex flex-col md:flex-row items-end gap-8 -mt-20 relative z-10">
          <div className="relative group">
            <div className="w-44 h-44 rounded-[3rem] border-[10px] border-[#0d1117] overflow-hidden bg-blue-600 shadow-2xl">
              {profile.avatar ? <img src={profile.avatar} className="w-full h-full object-cover" alt="avatar" /> : <div className="w-full h-full flex items-center justify-center text-5xl font-black">{username.charAt(0).toUpperCase()}</div>}
            </div>
            <label className="absolute inset-0 rounded-[3rem] bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer">
              <Camera size={24} />
              <input type="file" className="hidden" onChange={(e) => handleProfileUpload('avatar', e.target.files[0])} />
            </label>
          </div>

          <div className="flex-1 mb-4">
            <h1 className="text-5xl font-black italic tracking-tighter">@{username}</h1>
            <div className="flex items-center gap-3 mt-3">
              {isEditingBio ? (
                <div className="flex gap-2 w-full max-w-md">
                  <input className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none w-full" value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})} />
                  <button onClick={handleUpdateBio} className="p-2 bg-blue-600 rounded-xl hover:bg-blue-500"><Check size={18}/></button>
                </div>
              ) : (
                <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setIsEditingBio(true)}>
                  <p className="text-gray-400 font-medium italic">{profile.bio || "Click to add a bio..."}</p>
                  <Edit3 size={14} className="text-blue-500 opacity-0 group-hover:opacity-100 transition-all"/>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-[#161b22] border border-white/10 p-8 rounded-[2.5rem] flex items-center justify-between shadow-xl">
          <div>
            <p className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] mb-1">Creations</p>
            <p className="text-3xl font-black">{posts.length}</p>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl"><ImageIcon className="text-blue-500"/></div>
        </div>
        <div className="bg-[#161b22] border border-white/10 p-8 rounded-[2.5rem] flex items-center justify-between shadow-xl">
          <div>
            <p className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] mb-1">Total Likes</p>
            <p className="text-3xl font-black">{totalLikes}</p>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl"><Heart className="text-red-500"/></div>
        </div>
        <div className="bg-[#161b22] border border-white/10 p-8 rounded-[2.5rem] flex items-center justify-between shadow-xl">
          <div>
            <p className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] mb-1">Comments</p>
            <p className="text-3xl font-black">{totalComments}</p>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl"><MessageCircle className="text-cyan-500"/></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <div className="bg-[#161b22] border border-white/10 p-10 rounded-[3rem] sticky top-10 shadow-2xl">
            <h2 className="text-2xl font-black mb-8 flex items-center gap-3 italic">
              {editId ? <Edit3 className="text-blue-500"/> : <Sparkles className="text-blue-500"/>} 
              {editId ? "Edit Post" : "New Post"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <input type="text" placeholder="Title" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-blue-500/50" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
              <textarea placeholder="Description" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 h-32 outline-none focus:border-blue-500/50" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
              <input type="text" placeholder="Tags" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-blue-500/50" value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})} />
              <div className="border-2 border-dashed border-white/10 rounded-[2rem] p-8 text-center hover:border-blue-500/50 transition-all relative">
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setFile(e.target.files[0])} />
                <Upload className="mx-auto text-gray-500 mb-2" />
                <p className="text-xs text-gray-500 font-bold uppercase">{file ? file.name : "Choose Artwork"}</p>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg">
                {loading ? "Publishing..." : editId ? "Update" : "Publish"}
              </button>
              {editId && <button onClick={() => { setEditId(null); setFormData({ title: "", description: "", tags: "", image: "" }); }} className="w-full text-xs font-bold text-gray-500 mt-2">Cancel</button>}
            </form>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-8">
          <div className="relative group">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input type="text" placeholder="Search studio..." className="w-full bg-[#161b22] border border-white/10 rounded-full py-6 pl-16 pr-8 outline-none focus:border-blue-500/50" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredPosts.map((post) => (
              <div key={post._id} className="bg-[#161b22] border border-white/10 rounded-[2.5rem] overflow-hidden group">
                <div className="h-56 relative overflow-hidden">
                  <img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={post.title} />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button onClick={() => handleEdit(post)} className="p-3 bg-black/50 backdrop-blur-md rounded-2xl text-white hover:bg-blue-600"><Edit3 size={18}/></button>
                    <button onClick={() => handleDelete(post._id)} className="p-3 bg-black/50 backdrop-blur-md rounded-2xl text-white hover:bg-red-600"><Trash2 size={18}/></button>
                  </div>
                </div>
                <div className="p-8">
                  <h4 className="font-black text-xl mb-1 truncate">{post.title}</h4>
                  <p className="text-gray-500 text-xs italic">Updated {new Date(post.updatedAt).toLocaleDateString()}</p>
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
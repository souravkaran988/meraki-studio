import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Heart, MessageCircle, ImageIcon, Sparkles } from "lucide-react";

const Profile = () => {
  const { username } = useParams();
  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState({ bio: "", avatar: "", banner: "" });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const postsRes = await axios.get(`http://localhost:5000/api/posts/user/${username}`);
        const profileRes = await axios.get(`http://localhost:5000/api/profile/${username}`);
        setPosts(postsRes.data);
        setProfile(profileRes.data);
      } catch (err) { console.error(err); }
    };
    fetchUserData();
  }, [username]);

  const totalLikes = posts.reduce((acc, post) => acc + post.likes.length, 0);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 text-white">
      {/* HEADER SECTION (Same as Dashboard but no Edit buttons) */}
      <div className="relative mb-12 rounded-[3.5rem] overflow-hidden bg-[#161b22] border border-white/10 shadow-2xl">
        <div className="h-72 bg-gradient-to-r from-blue-900/40 to-cyan-900/40">
          {profile.banner && <img src={profile.banner} className="w-full h-full object-cover" alt="" />}
        </div>
        <div className="px-12 pb-10 flex flex-col md:flex-row items-end gap-8 -mt-20 relative z-10">
          <div className="w-44 h-44 rounded-[3rem] border-[10px] border-[#0d1117] overflow-hidden bg-blue-600 shadow-2xl">
            {profile.avatar ? <img src={profile.avatar} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex items-center justify-center text-5xl font-black">{username.charAt(0).toUpperCase()}</div>}
          </div>
          <div className="flex-1 mb-4">
            <h1 className="text-5xl font-black italic tracking-tighter">@{username}</h1>
            <p className="text-gray-400 font-medium italic mt-3">{profile.bio}</p>
          </div>
          <div className="flex gap-4 mb-4">
             <div className="bg-white/5 px-6 py-3 rounded-2xl text-center border border-white/5">
                <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Masterpieces</p>
                <p className="text-xl font-bold">{posts.length}</p>
             </div>
             <div className="bg-white/5 px-6 py-3 rounded-2xl text-center border border-white/5">
                <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Total Likes</p>
                <p className="text-xl font-bold">{totalLikes}</p>
             </div>
          </div>
        </div>
      </div>

      {/* CREATOR'S GALLERY */}
      <h2 className="text-2xl font-black mb-8 italic flex items-center gap-3">
        <Sparkles className="text-blue-500" /> Recent Works
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {posts.map((post) => (
          <div key={post._id} className="bg-[#161b22] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-xl">
            <div className="aspect-square overflow-hidden">
              <img src={post.image} className="w-full h-full object-cover" alt={post.title} />
            </div>
            <div className="p-7">
              <h3 className="font-bold text-xl truncate">{post.title}</h3>
              <div className="flex gap-4 mt-4 text-gray-500 text-sm">
                 <span className="flex items-center gap-1"><Heart size={16}/> {post.likes.length}</span>
                 <span className="flex items-center gap-1"><MessageCircle size={16}/> {post.comments.length}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
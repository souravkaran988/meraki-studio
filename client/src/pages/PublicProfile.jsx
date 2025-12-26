import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // To read the username from URL
import axios from "axios";
import { User, Image as ImageIcon, Heart } from "lucide-react";

const PublicProfile = () => {
  const { username } = useParams(); // Get "artist" from /profile/artist
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`https://meraki-art.onrender.com/api/posts/profile/${username}`);
        setPosts(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  if (loading) return <div className="text-center text-white mt-20">Loading Profile...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* PROFILE HEADER */}
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg p-8 mb-8 text-center shadow-lg border border-gray-700">
        <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto flex items-center justify-center mb-4 overflow-hidden border-4 border-gray-600">
            {/* Try to show avatar from first post, otherwise default icon */}
            {posts.length > 0 && posts[0].user.profilePic ? (
                <img src={posts[0].user.profilePic} className="w-full h-full object-cover" alt="Avatar" />
            ) : (
                <User size={48} className="text-gray-400" />
            )}
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          {username}
        </h1>
        <p className="text-gray-400 mt-2">
          {posts.length} {posts.length === 1 ? "Artwork" : "Artworks"} Shared
        </p>
      </div>

      {/* GALLERY GRID */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">Portfolio</h2>

        {posts.length === 0 ? (
          <div className="text-center py-20 bg-gray-800 rounded-lg border border-gray-700 border-dashed">
            <ImageIcon size={48} className="mx-auto mb-2 opacity-50" />
            <p className="text-gray-500">This user hasn't uploaded any art yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div key={post._id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition border border-gray-700 group">
                <div className="h-64 overflow-hidden relative">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                  
                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 text-white">
                    <Heart size={20} className="fill-current text-red-500" /> 
                    <span className="font-bold">{post.likes.length}</span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-bold text-lg truncate">{post.title}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {post.tags.map((tag, i) => (
                      <span key={i} className="text-xs bg-gray-700 text-blue-300 px-2 py-1 rounded-full">#{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicProfile;
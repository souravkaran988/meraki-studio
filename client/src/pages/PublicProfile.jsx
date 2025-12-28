import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Heart, MessageCircle, User as UserIcon, Image as ImageIcon } from "lucide-react";

const PublicProfile = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // FIX: Added the Backend URL prefix
  const PF = "https://meraki-art.onrender.com";

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        setLoading(true);
        // Fetch user details and their posts
        const userRes = await axios.get(`${PF}/api/users?username=${username}`);
        setUser(userRes.data);
        
        const postsRes = await axios.get(`${PF}/api/posts/profile/${username}`);
        setPosts(postsRes.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicData();
  }, [username]);

  // FIX: Helper to attach Backend URL to image paths
  const getImageUrl = (imgStr) => {
    if (!imgStr) return "";
    return imgStr.startsWith("http") || imgStr.startsWith("data") ? imgStr : PF + imgStr;
  };

  if (loading) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading Profile...</div>;
  if (!user) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">User not found</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Profile Header */}
        <div className="bg-gray-800 rounded-2xl p-8 mb-12 border border-gray-700 shadow-xl flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 shadow-2xl bg-gray-700">
            {/* FIX: Profile Picture Path */}
            <img 
              src={getImageUrl(user.profilePic)} 
              alt={user.username} 
              className="w-full h-full object-cover" 
              onError={(e) => e.target.src = "https://via.placeholder.com/150"}
            />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold mb-2">{user.username}</h1>
            <p className="text-gray-400 mb-4">{user.bio || "Digital Artist & Creator"}</p>
            <div className="flex gap-6 justify-center md:justify-start">
              <div className="text-center">
                <p className="text-xl font-bold text-blue-400">{posts.length}</p>
                <p className="text-xs text-gray-500 uppercase">Artworks</p>
              </div>
            </div>
          </div>
        </div>

        {/* User's Gallery */}
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <ImageIcon className="text-blue-500" /> {user.username}'s Collection
        </h2>

        {posts.length === 0 ? (
          <div className="text-center py-20 bg-gray-800 rounded-2xl border border-gray-700 border-dashed">
            <p className="text-gray-500">This artist hasn't published any work yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div key={post._id} className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-all group shadow-lg">
                <div className="h-64 overflow-hidden">
                  {/* FIX: Post Image Path */}
                  <img 
                    src={getImageUrl(post.image)} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2">{post.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{post.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                    <div className="flex gap-4">
                      <span className="flex items-center gap-1 text-sm text-gray-400">
                        <Heart size={16} /> {post.likes?.length || 0}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-gray-400">
                        <MessageCircle size={16} /> {post.comments?.length || 0}
                      </span>
                    </div>
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
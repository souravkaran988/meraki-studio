import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; // Import Footer
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PublicProfile from "./pages/PublicProfile";

function App() {
  return (
    <BrowserRouter>
      {/* flex-col and min-h-screen ensure the footer stays 
        at the bottom even if the page has little content 
      */}
      <div className="flex flex-col min-h-screen bg-gray-900">
        <Navbar />
        
        {/* Main Content Area (Grows to fill space) */}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile/:username" element={<PublicProfile />} />
          </Routes>
        </div>

        <Footer /> {/* Footer sits at the bottom */}
      </div>
    </BrowserRouter>
  );
}

export default App;
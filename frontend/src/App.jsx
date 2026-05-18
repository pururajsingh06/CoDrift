import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import EditorPage from "./pages/EditorPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import Friends from "./pages/Friends";
import About from "./pages/About";
import Features from "./pages/Features";
import OAuthCallback from "./pages/OAuthCallback";
import useAuthStore from "./store/useAuthStore";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/features" element={<Features />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/auth/callback" element={<OAuthCallback />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/friends" 
        element={
          <ProtectedRoute>
            <Friends />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/session/:roomId" 
        element={
          <ProtectedRoute>
            <EditorPage />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;
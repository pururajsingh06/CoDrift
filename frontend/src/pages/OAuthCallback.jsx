import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      try {
        
        const payloadBase64 = token.split('.')[1];
        const decodedJson = atob(payloadBase64);
        const user = JSON.parse(decodedJson);
        
        
        setAuth(user, token);
        navigate('/dashboard');
      } catch (error) {
        console.error("Failed to parse token", error);
        navigate('/login?error=oauth_failed');
      }
    } else {
      navigate('/login?error=oauth_failed');
    }
  }, [searchParams, navigate, setAuth]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a] text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold">Authenticating...</h2>
        <p className="text-gray-400 mt-2">Please wait while we complete your sign-in.</p>
      </div>
    </div>
  );
};

export default OAuthCallback;

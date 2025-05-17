import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          navigate('/signin');
          return;
        }
 
        if (session) {
          // Check if user is a doctor
          const { data: doctorData } = await supabase
            .from('doctors')
            .select('id, email')
            .eq('email', session.user.email)
            .maybeSingle();

          if (doctorData) {
            localStorage.setItem('userRole', 'doctor');
            navigate('/doctor');
          } else {
            localStorage.setItem('userRole', 'patient');
            navigate('/dashboard');
          }
        } else {
          navigate('/signin');
        }
      } catch (err) {
        console.error('Error in auth callback:', err);
        navigate('/signin');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Completing sign in...</h2>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#62d5d0] mx-auto"></div>
      </div>
    </div>
  );
};

export default AuthCallback; 
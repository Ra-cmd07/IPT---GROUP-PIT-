import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { activateAccount } from '../api';

const Activation = () => {
  const { uid, token } = useParams();
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [message, setMessage] = useState('Activating your account...');
  const navigate = useNavigate();

  useEffect(() => {
    const activate = async () => {
      if (!uid || !token) {
        setStatus('error');
        setMessage('Missing activation UID or token.');
        return;
      }

      try {
        await activateAccount(uid, token);
        setStatus('success');
        setMessage('Your account has been activated successfully. You can now log in.');
        setTimeout(() => navigate('/login'), 3000);
      } catch (error: any) {
        setStatus('error');
        setMessage(error.message || 'Activation failed. Please check your link and try again.');
      }
    };

    activate();
  }, [uid, token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-950 text-white">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl shadow-slate-950/60 backdrop-blur-xl">
        <h1 className="text-4xl font-black mb-4 text-center">Account Activation</h1>
        <p className="text-center text-gray-300 mb-8">{message}</p>

        {status === 'success' && (
          <div className="text-center">
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-400 transition"
            >
              Go to Login
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4 text-center">
            <p className="text-red-300">If the activation link is invalid, please request a new one.</p>
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-400 transition"
            >
              Register Again
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Activation;

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useGoogleLogin } from '@react-oauth/google';
import { Info, X, ExternalLink, KeyRound } from 'lucide-react';

interface GoogleOAuthButtonProps {
  buttonText?: string;
  className?: string;
}

export const GoogleOAuthButton: React.FC<GoogleOAuthButtonProps> = ({
  buttonText = 'Continue with Google',
  className = ''
}) => {
  const { isGoogleConfigured, googleClientId, loginWithGoogleSuccess } = useAuth();
  const { success, error } = useToast();
  const [showSetupModal, setShowSetupModal] = useState(false);

  // Real Google Login hook from @react-oauth/google
  let realGoogleLoginTrigger: (() => void) | null = null;

  try {
    if (isGoogleConfigured) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      realGoogleLoginTrigger = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
          try {
            // Fetch verified user profile info using the access token from Google UserInfo API
            const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
            });
            const userInfo = await res.json();
            loginWithGoogleSuccess({
              name: userInfo.name || 'Google User',
              email: userInfo.email,
              avatar: userInfo.picture
            });
            success(`Welcome, ${userInfo.name}! Logged in with Google.`);
          } catch (err) {
            console.error('Failed to retrieve user profile from Google:', err);
            error('Google authentication was successful, but failed to retrieve profile data.');
          }
        },
        onError: () => {
          error('Google Sign-In was cancelled or failed.');
        }
      });
    }
  } catch (err) {
    console.warn('GoogleOAuthProvider not active or client id missing:', err);
  }

  const handleClick = () => {
    if (isGoogleConfigured && realGoogleLoginTrigger) {
      realGoogleLoginTrigger();
    } else {
      setShowSetupModal(true);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-sm transition-all active:scale-95 ${className}`}
      >
        {/* Google G Logo SVG */}
        <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>{buttonText}</span>
      </button>

      {/* Google Setup Guide Modal when unconfigured */}
      {showSetupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-emerald-950/10 animate-slide-up space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0F3427]">
                    Google OAuth Setup Required
                  </h3>
                  <p className="text-xs text-slate-500">
                    Client credentials not yet detected in `.env`
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSetupModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-neutral-50 rounded-2xl p-4 text-xs text-slate-600 space-y-2 border border-slate-200/80">
              <p className="font-semibold text-slate-800">
                To connect real Google OAuth login flow:
              </p>
              <ol className="list-decimal pl-4 space-y-1.5 leading-relaxed text-slate-600">
                <li>Create an OAuth Client ID in your Google Cloud Console.</li>
                <li>Set Authorized JavaScript origin to your dev URL (e.g. <code className="bg-white px-1 py-0.5 rounded border border-slate-200">http://localhost:5173</code>).</li>
                <li>Create a <code className="bg-white px-1 py-0.5 rounded border border-slate-200">.env</code> file from <code className="bg-white px-1 py-0.5 rounded border border-slate-200">.env.example</code>.</li>
                <li>Set: <code className="bg-white px-1 py-0.5 rounded border border-slate-200 font-mono text-[11px]">VITE_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com</code></li>
                <li>Restart the dev server.</li>
              </ol>
            </div>

            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200/60 text-xs text-[#0F3427] flex items-center gap-2">
              <Info className="w-4 h-4 text-fresh-600 flex-shrink-0" />
              <span>
                You can immediately use the <strong>local email & password</strong> form right below to test the full website!
              </span>
            </div>

            <button
              onClick={() => setShowSetupModal(false)}
              className="w-full py-2.5 bg-[#0F3427] hover:bg-[#144333] text-white rounded-xl text-xs font-bold transition-colors"
            >
              Continue with Local Login
            </button>
          </div>
        </div>
      )}
    </>
  );
};

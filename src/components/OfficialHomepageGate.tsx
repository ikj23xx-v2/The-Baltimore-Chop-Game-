// src/components/OfficialHomepageGate.tsx
import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider
} from 'firebase/auth';
import { auth } from '../firebase';
import { authService, UserAccountProfile } from '../services/authService';
import { teamThemeService } from '../services/teamThemeService';
import { soundManager } from '../services/audio';
import { triggerHapticFeedback } from '../services/haptics';

interface OfficialHomepageGateProps {
  isOpen: boolean;
  onEnterGame: (profile?: UserAccountProfile, bonusTokens?: number, selectedTeam?: string) => void;
}

export const OfficialHomepageGate: React.FC<OfficialHomepageGateProps> = ({
  isOpen,
  onEnterGame,
}) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError(null);

    const identifier = usernameOrEmail.trim();
    if (!identifier) {
      setAuthError('Please enter your Username or Email');
      return;
    }
    if (!password) {
      setAuthError('Please enter your password');
      return;
    }

    setIsLoading(true);

    const emailToUse = identifier.includes('@') 
      ? identifier 
      : `${identifier.toLowerCase().replace(/[^a-z0-9]/g, '')}@thebaltimorechop.app`;
    const usernameToUse = identifier.includes('@') ? identifier.split('@')[0] : identifier;

    let authUserUid: string | null = null;
    try {
      const cred = await signInWithEmailAndPassword(auth, emailToUse, password);
      if (cred?.user) {
        authUserUid = cred.user.uid;
      }
    } catch (err: any) {
      console.warn('Firebase sign in note:', err);
    }

    const profile: UserAccountProfile = {
      uid: authUserUid || `gm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      email: emailToUse,
      displayName: usernameToUse,
      username: usernameToUse,
      photoURL: null,
      isAnonymous: false,
      linkedProviders: ['password'],
      createdAt: Date.now(),
      lastUsernameChangeAt: null,
      usernameHistory: []
    };

    saveAndLaunch(profile, 0);
  };

  const handleSignUp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError(null);

    const identifier = usernameOrEmail.trim();
    if (!identifier) {
      setAuthError('Please enter your desired Username or Email');
      return;
    }
    if (!password || password.length < 6) {
      setAuthError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    const emailToUse = identifier.includes('@') 
      ? identifier 
      : `${identifier.toLowerCase().replace(/[^a-z0-9]/g, '')}@thebaltimorechop.app`;
    const usernameToUse = identifier.includes('@') ? identifier.split('@')[0] : identifier;

    let authUserUid: string | null = null;
    try {
      const cred = await createUserWithEmailAndPassword(auth, emailToUse, password);
      if (cred?.user) {
        authUserUid = cred.user.uid;
      }
    } catch (err: any) {
      console.warn('Firebase register note:', err);
    }

    const profile: UserAccountProfile = {
      uid: authUserUid || `gm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      email: emailToUse,
      displayName: usernameToUse,
      username: usernameToUse,
      photoURL: null,
      isAnonymous: false,
      linkedProviders: ['password'],
      createdAt: Date.now(),
      lastUsernameChangeAt: null,
      usernameHistory: []
    };

    saveAndLaunch(profile, 1000);
  };

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setIsLoading(true);
    soundManager.playButtonClick();

    let profile: UserAccountProfile | null = null;
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      if (res?.user) {
        const u = res.user;
        const cleanName = u.displayName || u.email?.split('@')[0] || 'GoogleGM';
        profile = {
          uid: u.uid,
          email: u.email || 'google_gm@thebaltimorechop.app',
          displayName: cleanName,
          username: cleanName.replace(/[^a-zA-Z0-9_]/g, ''),
          photoURL: u.photoURL,
          isAnonymous: false,
          linkedProviders: ['google.com'],
          createdAt: Date.now(),
          lastUsernameChangeAt: null,
          usernameHistory: []
        };
      }
    } catch (err: any) {
      console.warn('Google popup note:', err);
      const cleanName = usernameOrEmail.trim() || 'GoogleGM';
      profile = {
        uid: `gm_google_${Date.now()}`,
        email: usernameOrEmail.includes('@') ? usernameOrEmail : 'google_gm@thebaltimorechop.app',
        displayName: cleanName,
        username: cleanName,
        photoURL: null,
        isAnonymous: false,
        linkedProviders: ['google.com'],
        createdAt: Date.now(),
        lastUsernameChangeAt: null,
        usernameHistory: []
      };
    }

    if (profile) {
      saveAndLaunch(profile, 1000);
    } else {
      setIsLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setAuthError(null);
    setIsLoading(true);
    soundManager.playButtonClick();

    let profile: UserAccountProfile | null = null;
    try {
      const provider = new OAuthProvider('apple.com');
      const res = await signInWithPopup(auth, provider);
      if (res?.user) {
        const u = res.user;
        const cleanName = u.displayName || u.email?.split('@')[0] || 'AppleGM';
        profile = {
          uid: u.uid,
          email: u.email || 'apple_gm@thebaltimorechop.app',
          displayName: cleanName,
          username: cleanName.replace(/[^a-zA-Z0-9_]/g, ''),
          photoURL: u.photoURL,
          isAnonymous: false,
          linkedProviders: ['apple.com'],
          createdAt: Date.now(),
          lastUsernameChangeAt: null,
          usernameHistory: []
        };
      }
    } catch (err: any) {
      console.warn('Apple popup note:', err);
      const cleanName = usernameOrEmail.trim() || 'AppleGM';
      profile = {
        uid: `gm_apple_${Date.now()}`,
        email: usernameOrEmail.includes('@') ? usernameOrEmail : 'apple_gm@thebaltimorechop.app',
        displayName: cleanName,
        username: cleanName,
        photoURL: null,
        isAnonymous: false,
        linkedProviders: ['apple.com'],
        createdAt: Date.now(),
        lastUsernameChangeAt: null,
        usernameHistory: []
      };
    }

    if (profile) {
      saveAndLaunch(profile, 1000);
    } else {
      setIsLoading(false);
    }
  };

  const handleGuestEnter = () => {
    soundManager.playButtonClick();
    const guestProfile: UserAccountProfile = {
      uid: `gm_guest_${Date.now()}`,
      email: 'guest@thebaltimorechop.app',
      displayName: 'Guest GM',
      username: usernameOrEmail.trim() || 'CamdenSlugger',
      photoURL: null,
      isAnonymous: true,
      linkedProviders: ['anonymous'],
      createdAt: Date.now(),
      lastUsernameChangeAt: null,
      usernameHistory: []
    };
    saveAndLaunch(guestProfile, 0);
  };

  const handleClaimGrant = () => {
    soundManager.playPackRip();
    if (!usernameOrEmail) {
      setUsernameOrEmail('NewGM_' + Math.floor(100 + Math.random() * 900));
    }
    if (!password) {
      setPassword('chop2025');
    }
  };

  const saveAndLaunch = (profile: UserAccountProfile, bonus: number) => {
    try {
      localStorage.setItem('baltimore_chop_local_user_v1', JSON.stringify(profile));
      localStorage.setItem('the_baltimore_chop_onboarding_completed', 'true');
      sessionStorage.setItem('chop_splash_dismissed', 'true');
      authService.saveProfile(profile);
      teamThemeService.setFavoriteTeam('Baltimore Orioles');
    } catch {
      // ignore
    }

    soundManager.playBatCrack(true);
    triggerHapticFeedback('CHOP');
    setIsLoading(false);
    onEnterGame(profile, bonus, 'Baltimore Orioles');
  };

  return (
    <div className="fixed inset-0 z-[100] w-screen h-screen overflow-hidden bg-black select-none">
      <style>{`
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        /* Landing Page Background Container */
        .landing-container {
            position: relative;
            width: 100vw;
            height: 100vh;
            background-image: url('/watermarked_img_9229416380901793785.jpg');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 40px 60px;
        }

        /* Dark overlay to ensure contrast */
        .landing-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.35);
            z-index: 1;
        }

        /* Left Side Content / Branding */
        .brand-section {
            position: relative;
            z-index: 2;
            color: #ffffff;
            max-width: 450px;
        }

        .brand-section h1 {
            font-size: 3.5rem;
            color: #ff6b00;
            font-weight: 900;
            text-shadow: 2px 2px 8px rgba(0,0,0,0.8);
            line-height: 1.1;
            margin-bottom: 10px;
            letter-spacing: 1px;
        }

        .brand-section h2 {
            font-size: 1.2rem;
            font-weight: 700;
            letter-spacing: 2px;
            color: #f1f1f1;
            margin-bottom: 25px;
            text-transform: uppercase;
        }

        .app-icon-preview {
            width: 110px;
            height: 110px;
            border-radius: 16px;
            border: 3px solid #ff6b00;
            box-shadow: 0 8px 20px rgba(0,0,0,0.6);
            margin-bottom: 20px;
            background: url('/assets/aistudio/chopchop_085f9a0d.jpeg') center/cover;
            background-color: #111;
        }

        /* Grant Banner Card */
        .grant-banner {
            position: relative;
            z-index: 2;
            background: rgba(255, 248, 220, 0.95);
            border: 2px solid #d4af37;
            border-radius: 8px;
            padding: 15px 20px;
            max-width: 420px;
            color: #222;
            box-shadow: 0 10px 25px rgba(0,0,0,0.5);
            position: absolute;
            bottom: 40px;
            left: 60px;
            cursor: pointer;
            transition: transform 0.15s ease;
        }

        .grant-banner:hover {
            transform: translateY(-2px);
        }

        .grant-banner h3 {
            font-size: 0.95rem;
            color: #8b4513;
            margin-bottom: 5px;
            font-weight: 800;
        }

        .grant-banner p {
            font-size: 0.85rem;
            font-weight: 600;
            line-height: 1.4;
        }

        /* Right Side Credential / Login Box */
        .auth-card {
            position: relative;
            z-index: 2;
            background: rgba(245, 240, 230, 0.92);
            border: 3px solid #b58d3d;
            border-radius: 10px;
            width: 320px;
            padding: 25px 20px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.7);
        }

        .auth-card h3 {
            text-align: center;
            font-size: 1.1rem;
            color: #2c2c2c;
            letter-spacing: 1.5px;
            margin-bottom: 15px;
            border-bottom: 2px solid #d4af37;
            padding-bottom: 8px;
        }

        .form-group {
            margin-bottom: 12px;
        }

        .form-group label {
            display: block;
            font-size: 0.75rem;
            font-weight: 700;
            color: #444;
            margin-bottom: 4px;
            letter-spacing: 0.5px;
        }

        .form-group input {
            width: 100%;
            padding: 10px;
            background-color: #e4dec9;
            border: 1px solid #b58d3d;
            border-radius: 4px;
            font-size: 0.85rem;
            color: #333;
        }

        .form-group input:focus {
            outline: none;
            border-color: #ff6b00;
            background-color: #fff;
        }

        .btn {
            width: 100%;
            padding: 11px;
            border: none;
            border-radius: 4px;
            font-weight: 700;
            font-size: 0.9rem;
            cursor: pointer;
            margin-top: 8px;
            transition: background 0.2s;
            text-align: center;
            display: block;
            text-decoration: none;
        }

        .btn-login {
            background-color: #e65c00;
            color: white;
            box-shadow: 0 4px 10px rgba(230, 92, 0, 0.4);
        }

        .btn-login:hover {
            background-color: #cc5200;
        }

        .btn-signin {
            background-color: #3e4e5e;
            color: white;
            border: 1px solid #2c3540;
        }

        .btn-signin:hover {
            background-color: #2c3540;
        }

        .btn-signup {
            background-color: #e65c00;
            color: white;
            margin-top: 12px;
        }

        .btn-signup:hover {
            background-color: #cc5200;
        }

        .btn-oauth {
            background-color: #ffffff;
            color: #222;
            border: 1px solid #b58d3d;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            position: relative;
            padding: 8px;
            font-size: 0.78rem;
        }

        .btn-oauth:hover {
            background-color: #f5f5f5;
        }

        .oauth-badge {
            position: absolute;
            top: -6px;
            right: 6px;
            background: linear-gradient(90deg, #f59e0b, #eab308);
            color: #451a03;
            font-size: 7.5px;
            font-weight: 900;
            padding: 1px 5px;
            border-radius: 3px;
            border: 1px solid #78350f;
        }

        @media (max-width: 768px) {
            .landing-container {
                padding: 20px 16px;
                flex-direction: column;
                justify-content: flex-start;
                gap: 16px;
                overflow-y: auto;
                height: auto;
                min-height: 100vh;
            }
            .brand-section h1 {
                font-size: 2.2rem;
            }
            .grant-banner {
                position: relative;
                bottom: auto;
                left: auto;
                max-width: 100%;
            }
        }
      `}</style>

      <div className="landing-container">
        {/* Left Hero Details */}
        <div className="brand-section">
          <div className="app-icon-preview"></div>
          <h1>THE BALTIMORE CHOP™</h1>
          <h2>OFFICIAL FRANCHISE GM & HOBBY COLLECTOR</h2>
        </div>

        {/* Bottom Left Bonus Grant Notice */}
        <div 
          className="grant-banner" 
          onClick={handleClaimGrant}
          title="Click to claim 2,500 Vending Tokens starter grant!"
        >
          <h3>NEW GM SIGNUP GRANT:</h3>
          <p>
            1,500 Base + 1,000 Bonus = 2,500 Vending Tokens!<br />
            ✓ Enough to rip a 750-Token Hobby Box right away!
          </p>
        </div>

        {/* Right Side Auth / Action Card */}
        <div className="auth-card">
          <h3>CREDENTIALS</h3>

          {authError && (
            <div className="bg-red-900/90 text-red-100 text-[11px] font-mono p-2 rounded border border-red-500 mb-2 text-center">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>USERNAME / EMAIL</label>
              <input 
                type="text" 
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                placeholder="" 
                disabled={isLoading}
              />
            </div>
            <div className="form-group">
              <label>PASSWORD</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="" 
                disabled={isLoading}
              />
            </div>

            <button type="submit" disabled={isLoading} className="btn btn-login">
              LOG IN
            </button>

            {/* Google Sign In with +1000 Tokens badge */}
            <div className="relative mt-2">
              <button 
                type="button" 
                disabled={isLoading} 
                onClick={handleGoogleSignIn} 
                className="btn btn-oauth"
              >
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>SIGN IN WITH GOOGLE</span>
              </button>
              <div className="oauth-badge">+1000 TOKENS</div>
            </div>

            {/* Apple Sign In with +1000 Tokens badge */}
            <div className="relative mt-2">
              <button 
                type="button" 
                disabled={isLoading} 
                onClick={handleAppleSignIn} 
                className="btn btn-oauth"
              >
                <svg className="w-3.5 h-3.5 fill-black shrink-0" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.07-7.7-7.85-12.01-14.34-6.17-9.35-11.1-19.86-14.79-31.54-3.69-11.68-5.54-22.68-5.54-33 0-14.42 3.65-26.65 10.96-36.68 7.31-10.03 16.64-15.17 27.99-15.42 4.87 0 10.15 1.3 15.84 3.91 5.69 2.61 9.5 3.97 11.43 4.09 1.77 0 5.75-1.42 11.94-4.26 6.19-2.84 11.55-4.14 16.08-3.9 11.95.63 21.72 5.09 29.31 13.37-10.42 6.35-15.5 15.1-15.26 26.25.25 8.74 3.59 16.02 10.02 21.84 6.43 5.82 14.13 9.07 23.1 9.76-2.12 6.42-4.63 12.78-7.53 19.08zM119.22 31.84c0-7.14 2.65-13.91 7.95-20.31 5.3-6.4 11.83-10.45 19.59-12.15.25 1.14.38 2.22.38 3.24 0 7.02-2.73 13.88-8.19 20.58-5.46 6.7-12.19 10.59-20.19 11.68-.26-1.02-.39-2.04-.39-3.04z" />
                </svg>
                <span>SIGN IN WITH APPLE</span>
              </button>
              <div className="oauth-badge">+1000 TOKENS</div>
            </div>

            <button 
              type="button" 
              onClick={handleLogin} 
              disabled={isLoading}
              className="btn btn-signin"
            >
              EXISTING USER? SIGN IN
            </button>

            <button 
              type="button" 
              onClick={handleSignUp} 
              disabled={isLoading}
              className="btn btn-signup"
            >
              SIGN UP
            </button>

            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <button
                type="button"
                onClick={handleGuestEnter}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#555',
                  fontSize: '0.8rem',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Direct Guest Play →
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};




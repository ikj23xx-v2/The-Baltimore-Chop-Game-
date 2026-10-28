// src/components/OfficialHomepageGate.tsx
import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
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
    <div className="fixed inset-0 z-[100] w-full min-h-[100dvh] overflow-y-auto overflow-x-hidden bg-black select-none">
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
            width: 100%;
            min-height: 100dvh;
            background-image: url('/watermarked_img_9229416380901793785.jpg');
            background-size: cover;
            background-position: center center;
            background-repeat: no-repeat;
            background-attachment: fixed;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: clamp(20px, 4vw, 50px) clamp(20px, 5vw, 60px);
            padding-top: max(clamp(20px, 4vw, 50px), env(safe-area-inset-top, 20px));
            padding-bottom: max(clamp(20px, 4vw, 50px), env(safe-area-inset-bottom, 20px));
            gap: 24px;
        }

        /* Dark overlay to ensure contrast across all viewport ratios */
        .landing-container::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.42);
            z-index: 1;
            pointer-events: none;
        }

        /* Left Side Content / Branding */
        .brand-section {
            position: relative;
            z-index: 2;
            color: #ffffff;
            max-width: 480px;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .brand-section h1 {
            font-size: clamp(2.2rem, 5vw, 3.5rem);
            color: #ff6b00;
            font-weight: 900;
            text-shadow: 2px 2px 8px rgba(0,0,0,0.85);
            line-height: 1.1;
            margin-bottom: 10px;
            letter-spacing: 1px;
        }

        .brand-section h2 {
            font-size: clamp(0.95rem, 2vw, 1.2rem);
            font-weight: 700;
            letter-spacing: 1.8px;
            color: #f1f1f1;
            margin-bottom: 22px;
            text-transform: uppercase;
            text-shadow: 1px 1px 4px rgba(0,0,0,0.8);
        }

        .app-icon-preview {
            width: clamp(75px, 12vw, 110px);
            height: clamp(75px, 12vw, 110px);
            border-radius: 16px;
            border: 3px solid #ff6b00;
            box-shadow: 0 8px 24px rgba(0,0,0,0.7);
            margin-bottom: 18px;
            background: url('/assets/aistudio/chopchop_085f9a0d.jpeg') center/cover;
            background-color: #111;
            flex-shrink: 0;
        }

        /* Grant Banner Card */
        .grant-banner {
            position: relative;
            z-index: 2;
            background: rgba(255, 248, 220, 0.96);
            border: 2px solid #d4af37;
            border-radius: 8px;
            padding: 14px 18px;
            max-width: 440px;
            color: #222;
            box-shadow: 0 10px 25px rgba(0,0,0,0.55);
            cursor: pointer;
            transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        .grant-banner:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 28px rgba(212, 175, 55, 0.4);
        }

        .grant-banner h3 {
            font-size: clamp(0.85rem, 1.5vw, 0.95rem);
            color: #8b4513;
            margin-bottom: 4px;
            font-weight: 800;
        }

        .grant-banner p {
            font-size: clamp(0.78rem, 1.4vw, 0.85rem);
            font-weight: 600;
            line-height: 1.4;
            color: #222;
        }

        /* Right Side Credential / Login Box */
        .auth-card {
            position: relative;
            z-index: 2;
            background: rgba(245, 240, 230, 0.95);
            border: 3px solid #b58d3d;
            border-radius: 12px;
            width: 320px;
            max-width: 100%;
            padding: 24px 20px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.75);
            backdrop-filter: blur(4px);
            flex-shrink: 0;
        }

        .auth-card h3 {
            text-align: center;
            font-size: 1.15rem;
            color: #2c2c2c;
            letter-spacing: 1.5px;
            margin-bottom: 16px;
            border-bottom: 2px solid #d4af37;
            padding-bottom: 8px;
            font-weight: 800;
        }

        .form-group {
            margin-bottom: 13px;
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
            padding: 11px 12px;
            background-color: #e4dec9;
            border: 1px solid #b58d3d;
            border-radius: 6px;
            font-size: 0.9rem;
            color: #222;
            font-weight: 600;
            box-sizing: border-box;
            transition: border-color 0.15s ease, background-color 0.15s ease;
        }

        .form-group input:focus {
            outline: none;
            border-color: #ff6b00;
            background-color: #ffffff;
        }

        .btn {
            width: 100%;
            padding: 12px 14px;
            border: none;
            border-radius: 6px;
            font-weight: 800;
            font-size: 0.9rem;
            cursor: pointer;
            margin-top: 8px;
            transition: background 0.18s ease, transform 0.1s ease;
            text-align: center;
            display: block;
            text-decoration: none;
            box-sizing: border-box;
        }

        .btn:active {
            transform: scale(0.99);
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
            box-shadow: 0 4px 10px rgba(230, 92, 0, 0.4);
        }

        .btn-signup:hover {
            background-color: #cc5200;
        }

        /* ========================================================= */
        /* RESPONSIVE LAYOUT ACROSS ALL PHONE & FOLDABLE SCREEN RATIOS */
        /* ========================================================= */
        
        /* 1. Desktop & Widescreen (Landscape > 900px) */
        @media (min-width: 901px) {
            .landing-container {
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
            }
            .grant-banner {
                position: absolute;
                bottom: clamp(24px, 4vw, 40px);
                left: clamp(24px, 5vw, 60px);
            }
        }

        /* 2. Foldable Phones Unfolded & Tablets (Aspect Ratio ~ 4:3, 5:4, 1:1, width 641px - 900px) */
        @media (min-width: 641px) and (max-width: 900px) {
            .landing-container {
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 20px;
                padding: 24px;
            }
            .brand-section {
                max-width: 480px;
                text-align: center;
                align-items: center;
            }
            .app-icon-preview {
                margin: 0 auto 14px auto;
            }
            .auth-card {
                width: 360px;
            }
            .grant-banner {
                position: relative;
                bottom: auto;
                left: auto;
                width: 360px;
                max-width: 100%;
            }
        }

        /* 3. Standard & Tall Narrow Phones / Foldable Cover Screens (< 640px, 19.5:9, 21:9, 23:9 ratios) */
        @media (max-width: 640px) {
            .landing-container {
                flex-direction: column;
                justify-content: flex-start;
                align-items: center;
                padding: 16px;
                padding-top: max(16px, env(safe-area-inset-top, 16px));
                padding-bottom: max(24px, env(safe-area-inset-bottom, 24px));
                gap: 16px;
            }
            .brand-section {
                width: 100%;
                max-width: 340px;
                text-align: center;
                align-items: center;
            }
            .app-icon-preview {
                width: 72px;
                height: 72px;
                border-radius: 14px;
                margin: 0 auto 10px auto;
            }
            .brand-section h1 {
                font-size: 2rem;
                margin-bottom: 6px;
            }
            .brand-section h2 {
                font-size: 0.85rem;
                letter-spacing: 1.2px;
                margin-bottom: 12px;
            }
            .auth-card {
                width: 100%;
                max-width: 340px;
                padding: 18px 16px;
            }
            .auth-card h3 {
                font-size: 1.05rem;
                margin-bottom: 12px;
                padding-bottom: 6px;
            }
            .grant-banner {
                position: relative;
                bottom: auto;
                left: auto;
                width: 100%;
                max-width: 340px;
                padding: 12px 14px;
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
            <div className="bg-red-900/90 text-red-100 text-[11px] font-mono p-2 rounded border border-red-500 mb-2.5 text-center leading-tight">
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
                autoCapitalize="none"
                autoCorrect="off"
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
          </form>
        </div>

      </div>
    </div>
  );
};

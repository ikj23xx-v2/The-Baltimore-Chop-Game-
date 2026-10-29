// src/components/OfficialHomepageGate.tsx
import React, { useState } from 'react';
import { soundManager } from '../services/audio';
import { authService, UserAccountProfile } from '../services/authService';
import { teamThemeService } from '../services/teamThemeService';
import { triggerHapticFeedback } from '../services/haptics';
import { MLB_TEAMS } from '../data/mlbTeams';

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
  const [selectedFranchise, setSelectedFranchise] = useState('All-MLB All-Stars');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError(null);
    setIsLoading(true);
    soundManager.playButtonClick();

    const usernameToUse = usernameOrEmail.trim() || 'FranchiseGM';
    
    // Check if user has an existing saved profile
    const existing = authService.getProfile();
    if (existing && !existing.isAnonymous) {
      saveAndLaunch(existing, 0);
      return;
    }

    const profile: UserAccountProfile = {
      uid: `gm_${Date.now()}`,
      email: usernameOrEmail.includes('@') ? usernameOrEmail.trim() : `${usernameToUse.toLowerCase()}@thebaltimorechop.app`,
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
    setIsLoading(true);
    soundManager.playButtonClick();

    const usernameToUse = usernameOrEmail.trim() || `GM_${Math.floor(1000 + Math.random() * 9000)}`;

    const profile: UserAccountProfile = {
      uid: `gm_${Date.now()}`,
      email: usernameOrEmail.includes('@') ? usernameOrEmail.trim() : `${usernameToUse.toLowerCase()}@thebaltimorechop.app`,
      displayName: usernameToUse,
      username: usernameToUse,
      photoURL: null,
      isAnonymous: false,
      linkedProviders: ['password'],
      createdAt: Date.now(),
      lastUsernameChangeAt: null,
      usernameHistory: []
    };

    // Grant 1,000 bonus tokens + starter grant
    saveAndLaunch(profile, 1000);
  };

  const saveAndLaunch = (profile: UserAccountProfile, bonus: number) => {
    try {
      localStorage.setItem('baltimore_chop_local_user_v1', JSON.stringify(profile));
      localStorage.setItem('the_baltimore_chop_onboarding_completed', 'true');
      sessionStorage.setItem('chop_splash_dismissed', 'true');
      authService.saveProfile(profile);
      if (selectedFranchise && selectedFranchise !== 'All-MLB All-Stars') {
        teamThemeService.setFavoriteTeam(selectedFranchise);
      }
    } catch {
      // ignore
    }

    soundManager.playBatCrack(true);
    triggerHapticFeedback('CHOP');
    setIsLoading(false);
    onEnterGame(profile, bonus, selectedFranchise);
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
            justify-content: flex-end;
            align-items: center;
            padding: clamp(20px, 4vw, 50px) clamp(24px, 6vw, 80px);
            padding-top: max(clamp(20px, 4vw, 50px), env(safe-area-inset-top, 20px));
            padding-bottom: max(clamp(20px, 4vw, 50px), env(safe-area-inset-bottom, 20px));
        }

        /* Subtle vignette overlay to ensure text readability without darkening background art */
        .landing-container::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at center, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.3) 100%);
            z-index: 1;
            pointer-events: none;
        }

        /* Right Side Credential / Login Box */
        .auth-card {
            position: relative;
            z-index: 2;
            background: rgba(245, 240, 230, 0.95);
            border: 3px solid #b58d3d;
            border-radius: 12px;
            width: 330px;
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
            background-color: #2d3748;
            color: #f7fafc;
            font-size: 0.82rem;
            letter-spacing: 0.5px;
            box-shadow: 0 3px 8px rgba(0,0,0,0.3);
        }

        .btn-signin:hover {
            background-color: #1a202c;
        }

        .btn-signup {
            background-color: #d9531e;
            color: white;
            box-shadow: 0 4px 10px rgba(217, 83, 30, 0.4);
        }

        .btn-signup:hover {
            background-color: #bf4313;
        }

        .auth-grant-tag {
            margin-top: 14px;
            padding: 8px 10px;
            background: rgba(212, 175, 55, 0.15);
            border: 1px dashed #b58d3d;
            border-radius: 6px;
            font-size: 0.72rem;
            font-weight: 700;
            color: #5a3810;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            text-align: center;
            line-height: 1.3;
        }

        /* Responsive Layout for Mobile and Foldables */
        @media (max-width: 899px) {
            .landing-container {
                justify-content: center;
                align-items: center;
                padding: 24px 16px;
            }
            .auth-card {
                width: 100%;
                max-width: 340px;
                margin: auto;
            }
        }

        /* Foldable phones when unfolded (square-ish aspect ratios: 4:3, 3:2, 1:1) */
        @media (min-width: 600px) and (max-width: 960px) and (min-aspect-ratio: 4/5) {
            .landing-container {
                justify-content: flex-end;
                padding-right: 32px;
            }
            .auth-card {
                max-width: 320px;
            }
        }
      `}</style>

      <div className="landing-container">
        {/* Right Side Interactive Credentials Card */}
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
              <label>FAVORITE FRANCHISE / DRAFT BASE</label>
              <select
                value={selectedFranchise}
                onChange={(e) => setSelectedFranchise(e.target.value)}
                disabled={isLoading}
                className="w-full p-2.5 bg-[#e4dec9] border border-[#b58d3d] rounded text-sm text-[#222] font-semibold focus:outline-none focus:border-[#ff6b00] cursor-pointer"
              >
                <option value="All-MLB All-Stars">⭐ All-MLB All-Stars (Clean Slate Draft)</option>
                <optgroup label="American League">
                  {MLB_TEAMS.filter(t => t.league === 'AL').map(t => (
                    <option key={t.id} value={t.name}>
                      {t.name} ({t.city})
                    </option>
                  ))}
                </optgroup>
                <optgroup label="National League">
                  {MLB_TEAMS.filter(t => t.league === 'NL').map(t => (
                    <option key={t.id} value={t.name}>
                      {t.name} ({t.city})
                    </option>
                  ))}
                </optgroup>
              </select>
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

          <div className="auth-grant-tag">
            <span>🎁</span>
            <span>2,500 Vending Tokens Starter Grant on Signup!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

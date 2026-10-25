// 5 Logins Within 7 Days Streak Manager

export interface DayStreakStatus {
  date: string;
  dayLabel: string;
  loggedIn: boolean;
  isToday: boolean;
}

export interface StreakState {
  loginDates: string[]; // ISO strings 'YYYY-MM-DD'
  lastClaimedPeriod?: string; // Identifier for current 7-day period claimed
}

const STORAGE_KEY = 'baltimore_chop_login_streak_v2';
const STREAK_TARGET = 5;

// Format date as YYYY-MM-DD in local time
export const getLocalDateKey = (d: Date = new Date()): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Retrieve streak state from localStorage
export const loadStreakState = (): StreakState => {
  if (typeof window === 'undefined') {
    return { loginDates: [] };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { loginDates: [] };
    return JSON.parse(raw);
  } catch {
    return { loginDates: [] };
  }
};

// Save streak state
export const saveStreakState = (state: StreakState): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save login streak', err);
  }
};

// Record today's login and return updated status
export const recordDailyLogin = (): { isNewDay: boolean; state: StreakState } => {
  const state = loadStreakState();
  const today = getLocalDateKey();

  const isAlreadyRecorded = state.loginDates.includes(today);
  if (!isAlreadyRecorded) {
    // Add today and keep only dates within last 30 days to keep storage clean
    const nowMs = Date.now();
    const thirtyDaysAgo = nowMs - 30 * 24 * 60 * 60 * 1000;
    const filtered = state.loginDates.filter((d) => {
      const dt = new Date(d).getTime();
      return !isNaN(dt) && dt >= thirtyDaysAgo;
    });
    filtered.push(today);
    const updatedState: StreakState = { ...state, loginDates: filtered };
    saveStreakState(updatedState);
    return { isNewDay: true, state: updatedState };
  }

  return { isNewDay: false, state };
};

// Compute rolling 7-day window status
export const getSevenDayStreakStatus = () => {
  const state = loadStreakState();
  const today = new Date();
  
  // Build rolling 7-day calendar array (last 6 days + today)
  const days: DayStreakStatus[] = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateKey = getLocalDateKey(d);
    const hasLogin = state.loginDates.includes(dateKey);
    days.push({
      date: dateKey,
      dayLabel: i === 0 ? 'Today' : dayNames[d.getDay()],
      loggedIn: hasLogin,
      isToday: i === 0
    });
  }

  const activeDaysCount = days.filter((d) => d.loggedIn).length;
  const isTargetReached = activeDaysCount >= STREAK_TARGET;

  // Window identifier for claiming (e.g. current week anchor)
  const currentWindowKey = `window-${days[0].date}-to-${days[days.length - 1].date}`;
  const isRewardClaimed = state.lastClaimedPeriod === currentWindowKey;
  const canClaimReward = isTargetReached && !isRewardClaimed;

  return {
    target: STREAK_TARGET,
    activeDaysCount,
    isTargetReached,
    canClaimReward,
    isRewardClaimed,
    currentWindowKey,
    daysTimeline: days,
    remainingDaysNeeded: Math.max(0, STREAK_TARGET - activeDaysCount)
  };
};

// Claim the 5-in-7 streak reward
export const claimStreakBonus = (windowKey: string): { points: number; tokens: number; packReward: boolean } => {
  const state = loadStreakState();
  state.lastClaimedPeriod = windowKey;
  saveStreakState(state);

  return {
    points: 1500,
    tokens: 5,
    packReward: true
  };
};

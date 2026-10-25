// Tactile Haptic and visual impact triggers for mobile and desktop

export type HapticType = 'LIGHT' | 'SNAP' | 'HEAVY' | 'CHOP';

export function triggerHapticFeedback(type: HapticType): void {
  // Mobile vibration API
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      if (type === 'HEAVY') {
        navigator.vibrate([45, 30, 90]);
      } else if (type === 'CHOP') {
        navigator.vibrate([70, 40, 30, 20, 80]);
      } else if (type === 'SNAP') {
        navigator.vibrate([25, 20, 25]);
      } else {
        navigator.vibrate(15);
      }
    } catch {
      // Ignore vibration errors if blocked by permission
    }
  }

  // Trigger DOM visual shake effect on main arena
  const container = document.getElementById('atbat-arena-container') || document.body;
  if (container) {
    container.classList.remove('animate-screen-shake');
    // Force DOM reflow to retrigger animation
    void container.offsetWidth;
    if (type === 'HEAVY' || type === 'CHOP') {
      container.classList.add('animate-screen-shake');
      setTimeout(() => {
        container.classList.remove('animate-screen-shake');
      }, 350);
    }
  }
}

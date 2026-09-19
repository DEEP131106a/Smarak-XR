/**
 * Mobile haptic vibration feedback utility.
 * Enhances user experience on mobile devices with gentle tactile responses.
 */

export const triggerHaptic = (type: 'tap' | 'success' | 'snap' | 'heavy' = 'tap') => {
  if (typeof window === 'undefined' || !navigator || !('vibrate' in navigator)) {
    return;
  }

  try {
    switch (type) {
      case 'tap':
        navigator.vibrate(10);
        break;
      case 'success':
        navigator.vibrate([15, 60, 25]);
        break;
      case 'snap':
        navigator.vibrate([25, 40, 35]);
        break;
      case 'heavy':
        navigator.vibrate(40);
        break;
    }
  } catch {
    // Ignore if vibration is restricted by browser policy
  }
};

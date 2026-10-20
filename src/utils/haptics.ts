/**
 * Tactile Haptic Feedback Utility
 * Uses the Web Vibration API (navigator.vibrate) to deliver native iOS-style
 * haptic tick patterns for drag threshold crossing, card commitments, and undos.
 */

export const triggerHaptic = (pattern: number | number[]): boolean => {
  if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      return navigator.vibrate(pattern);
    } catch {
      return false;
    }
  }
  return false;
};

export const haptics = {
  // Light tick when card crosses the swipe activation threshold (UIImpactFeedbackGenerator.light)
  threshold: () => triggerHaptic(12),

  // Crisp tick when card is passed (UIImpactFeedbackGenerator.medium)
  pass: () => triggerHaptic(15),

  // Warm double pulse when card is liked (UINotificationFeedbackGenerator.success)
  like: () => triggerHaptic([15, 35, 22]),

  // Resonant triple burst when super liked (UINotificationFeedbackGenerator.warning/magic)
  superLike: () => triggerHaptic([25, 40, 20, 30, 25]),

  // Tactile backward rewind pulse when undoing (UIImpactFeedbackGenerator.soft)
  undo: () => triggerHaptic([12, 30, 12]),

  // Subtle tap feedback
  tap: () => triggerHaptic(8),

  // Selection tick (UISelectionFeedbackGenerator)
  selection: () => triggerHaptic(10),

  // Success celebration notification pulse
  success: () => triggerHaptic([15, 30, 20]),
};

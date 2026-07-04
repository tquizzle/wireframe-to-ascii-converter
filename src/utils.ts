// Utility functions and shared constants

export const CANVAS_WIDTH = 600;
export const CANVAS_HEIGHT = 450;

/**
 * Copy text to clipboard
 * @param text - Text to copy to clipboard
 * @returns Promise that resolves when copy is successful
 */
export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

/**
 * Format timestamp for display
 * @param timestamp - Timestamp string in ISO format or milliseconds
 * @returns Formatted time string (e.g., "2:30 PM")
 */
export function formatTime(timestamp: string | number): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : new Date(timestamp);

  // Handle invalid dates
  if (isNaN(date.getTime())) {
    return 'Invalid time';
  }

  // Get UTC hours and minutes for consistent formatting across timezones
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();

  // Format as HH:MM (24-hour format)
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}
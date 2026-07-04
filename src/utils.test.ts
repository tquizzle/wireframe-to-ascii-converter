// Utility functions unit tests

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { copyToClipboard, formatTime } from './utils';

describe('utils.ts', () => {
  let writeTextMock: any;

  beforeEach(() => {
    writeTextMock = vi.fn();
    (navigator as any).clipboard = { writeText: writeTextMock };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('copyToClipboard', () => {
    it('should copy text to clipboard', async () => {
      const testText = 'Hello, world!';
      await copyToClipboard(testText);
      expect(writeTextMock).toHaveBeenCalledWith(testText);
    });

    it('should reject when clipboard write fails', async () => {
      const error = new Error('Clipboard write failed');
      writeTextMock.mockRejectedValueOnce(error);

      await expect(copyToClipboard('test')).rejects.toThrow(error);
    });
  });

  describe('formatTime', () => {
    it('should format ISO time string correctly', () => {
      const result = formatTime('2023-01-15T14:30:00Z');
      // Should format as 2:30 PM or 14:30 depending on locale
      expect(result).toMatch(/\d{1,2}:\d{2}/);
    });

    it('should format timestamp number correctly', () => {
      const timestamp = new Date('2023-01-15T14:30:00Z').getTime();
      const result = formatTime(timestamp);
      expect(result).toMatch(/\d{1,2}:\d{2}/);
    });

    it('should handle invalid date gracefully', () => {
      const result = formatTime('invalid-date');
      expect(result).toBe('Invalid time');
    });

    it('should format midnight correctly', () => {
      const result = formatTime('2023-01-15T00:00:00Z');
      expect(result).toMatch(/00:00|12:00/); // Depending on locale
    });

    it('should format evening time correctly', () => {
      const result = formatTime('2023-01-15T20:45:00Z');
      expect(result).toMatch(/8:45|20:45/); // Depending on locale
    });
  });
});
/**
 * useProfileChange — invoke a callback whenever the active profile is
 * switched. Used by every data-bearing tab (Tasks, Memory, Skills, Settings,
 * Agents) to refetch their per-profile data after the user swaps profiles
 * via the rail avatar popover.
 *
 * RailProfileMenu dispatches `browser-memex.profile-changed` on window
 * after a successful setActive; everything that consumes per-profile data
 * subscribes here.
 */

import { useEffect } from 'preact/hooks';

const EVENT_NAME = 'browser-memex.profile-changed';

export function useProfileChange(cb) {
  useEffect(() => {
    if (typeof cb !== 'function') return undefined;
    const handler = (e) => cb(e?.detail?.id ?? null);
    window.addEventListener(EVENT_NAME, handler);
    return () => window.removeEventListener(EVENT_NAME, handler);
  }, [cb]);
}

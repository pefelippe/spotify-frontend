import { useEffect } from 'react';

export function useSyncCurrentPosition(
  positionMs: number,
  isDragging: boolean,
  isSeeking: boolean,
  setCurrentPosition: (value: number | ((prev: number) => number)) => void,
) {
  useEffect(() => {
    if (!isDragging && !isSeeking) {
      setCurrentPosition(positionMs);
    }
  }, [positionMs, isDragging, isSeeking, setCurrentPosition]);
}

export function usePlayheadProgress(
  isPlaying: boolean,
  durationMs: number,
  isDragging: boolean,
  isSeeking: boolean,
  setCurrentPosition: (value: number | ((prev: number) => number)) => void,
) {
  useEffect(() => {
    if (!isPlaying || isSeeking) {
      return;
    }

    const interval = setInterval(() => {
      if (!isDragging) {
        setCurrentPosition((prev) => Math.min(prev + 1000, durationMs));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, durationMs, isDragging, isSeeking, setCurrentPosition]);
}

export function useEnterOnReady(
  isReady: boolean,
  setIsEntering: (value: boolean) => void,
) {
  useEffect(() => {
    if (isReady) {
      const id = setTimeout(() => setIsEntering(true), 0);
      return () => clearTimeout(id);
    }
  }, [isReady, setIsEntering]);
}

export function useRefreshPlaybackOnAppFocus(
  refreshPlayback: () => void,
) {
  useEffect(() => {
    const onFocus = () => {
      refreshPlayback();
    };
    const onVisibility = () => {
      if (!document.hidden) {
        refreshPlayback();
      }
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [refreshPlayback]);
}

export function useCloseDevicesOnOutsideClick(
  showDevices: boolean,
  setShowDevices: (value: boolean) => void,
) {
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (showDevices) {
        const triggers = Array.from(document.querySelectorAll('[data-device-trigger]'));
        const devicesModal = document.querySelector('.devices-modal');
        const target = e.target as Node;
        const clickedInsideAnyTrigger = triggers.some((el) => el.contains(target));
        const clickedInsideModal = !!devicesModal && devicesModal.contains(target);
        if (!clickedInsideAnyTrigger && !clickedInsideModal) {
          setShowDevices(false);
        }
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, [showDevices, setShowDevices]);
}


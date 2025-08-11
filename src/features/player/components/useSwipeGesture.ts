import { useRef, useCallback } from 'react';

type SwipeHandlers<T = HTMLElement> = {
  onTouchStart: React.TouchEventHandler<T>;
  onTouchMove: React.TouchEventHandler<T>;
  onTouchEnd: React.TouchEventHandler<T>;
};

interface UseSwipeOptions {
  threshold?: number;
  ignoreFromSelector?: string;
  enabled?: boolean;
}

interface SwipeCallbacks {
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export function useSwipeGesture<T extends HTMLElement = HTMLElement>(
  callbacks: SwipeCallbacks,
  options?: UseSwipeOptions,
): SwipeHandlers<T> {
  const { onSwipeUp, onSwipeDown, onSwipeLeft, onSwipeRight } = callbacks;

  const startXRef = useRef<number | null>(null);
  const startYRef = useRef<number | null>(null);
  const isVerticalRef = useRef<boolean | null>(null);
  const ignoreRef = useRef<boolean>(false);

  const threshold = options?.threshold ?? 50;
  const ignoreFromSelector = options?.ignoreFromSelector ?? 'button, a, input, textarea, [role="button"]';
  const enabled = options?.enabled ?? true;

  const onTouchStart = useCallback<React.TouchEventHandler<T>>((e) => {
    if (!enabled) {
      return;
    }
    const target = e.target as HTMLElement | null;
    ignoreRef.current = !!(target && target.closest(ignoreFromSelector));
    const touch = e.touches[0];
    startXRef.current = touch.clientX;
    startYRef.current = touch.clientY;
    isVerticalRef.current = null;
  }, [enabled, ignoreFromSelector]);

  const lastDeltaXRef = useRef<number>(0);
  const lastDeltaYRef = useRef<number>(0);

  const onTouchMove = useCallback<React.TouchEventHandler<T>>((e) => {
    if (!enabled || ignoreRef.current) {
      return;
    }
    if (startXRef.current == null || startYRef.current == null) {
      return;
    }
    const touch = e.touches[0];
    const dx = touch.clientX - startXRef.current;
    const dy = touch.clientY - startYRef.current;
    lastDeltaXRef.current = dx;
    lastDeltaYRef.current = dy;

    if (isVerticalRef.current == null) {
      isVerticalRef.current = Math.abs(dy) > Math.abs(dx);
    }
    if (Math.abs(dy) > 6 || Math.abs(dx) > 6) {
      e.preventDefault();
    }
  }, [enabled]);

  const onTouchEnd = useCallback<React.TouchEventHandler<T>>(() => {
    if (!enabled) {
      return;
    }
    const dx = lastDeltaXRef.current;
    const dy = lastDeltaYRef.current;

    // Decide orientation by magnitude
    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal
      if (dx <= -threshold && onSwipeLeft) {
        onSwipeLeft();
      } else if (dx >= threshold && onSwipeRight) {
        onSwipeRight();
      }
    } else if (dy <= -threshold && onSwipeUp) {
      // Vertical up
      onSwipeUp();
    } else if (dy >= threshold && onSwipeDown) {
      // Vertical down
      onSwipeDown();
    }

    startXRef.current = null;
    startYRef.current = null;
    isVerticalRef.current = null;
    ignoreRef.current = false;
    lastDeltaXRef.current = 0;
    lastDeltaYRef.current = 0;
  }, [enabled, onSwipeDown, onSwipeLeft, onSwipeRight, onSwipeUp, threshold]);

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
}

// Backwards-compatible vertical-only helper
export function useVerticalSwipe<T extends HTMLElement = HTMLElement>(
  onSwipeUp?: () => void,
  onSwipeDown?: () => void,
  options?: UseSwipeOptions,
): SwipeHandlers<T> {
  return useSwipeGesture<T>({ onSwipeUp, onSwipeDown }, options);
}

// Horizontal-only helper
export function useHorizontalSwipe<T extends HTMLElement = HTMLElement>(
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  options?: UseSwipeOptions,
): SwipeHandlers<T> {
  return useSwipeGesture<T>({ onSwipeLeft, onSwipeRight }, options);
}


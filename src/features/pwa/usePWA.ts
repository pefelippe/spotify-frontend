import { useState, useEffect } from 'react';
import { BeforeInstallPromptEvent, PWAHookReturn } from './types';

export const usePWA = (): PWAHookReturn => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    console.log('[PWA] Checking PWA readiness');
    console.log('[PWA] Window support:', 'beforeinstallprompt' in window);
    console.log('[PWA] Service Worker support:', 'serviceWorker' in navigator);
    console.log('[PWA] Standalone mode:', window.matchMedia('(display-mode: standalone)').matches);
    
    const handler = (e: Event) => {
      e.preventDefault();
      console.log('[PWA] beforeinstallprompt event details:', {
        type: e.type,
        target: e.target,
        currentTarget: e.currentTarget,
      });
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('[PWA] Already in standalone mode');
      setIsInstalled(true);
    }

    // Enable in dev mode for testing
    if (import.meta.env.DEV) {
      console.log('[PWA] Running in DEV mode');
      setIsInstallable(true);
    }

    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', handler);

    // Listen for successful installation
    window.addEventListener('appinstalled', () => {
      console.log('[PWA] App successfully installed');
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    });

    const onVisibilityChange = () => {
      console.log('[PWA] Visibility changed');
      const installed = window.matchMedia('(display-mode: standalone)').matches;
      setIsInstalled(installed);
      // reset installable flag on normal browsing context; browser will fire prompt again when ready
      if (!installed && !import.meta.env.DEV && deferredPrompt === null) {
        console.log('[PWA] Not in standalone mode, no deferred prompt');
        setIsInstallable(false);
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  const installApp = async (): Promise<boolean> => {
    console.log('[PWA] Install attempt details:', {
      deferredPrompt: !!deferredPrompt,
      isDevMode: import.meta.env.DEV,
      windowSupport: 'beforeinstallprompt' in window,
      serviceWorkerSupport: 'serviceWorker' in navigator,
    });

    if (import.meta.env.DEV) {
      if (!deferredPrompt) {
        console.warn('[PWA][DEV] No deferredPrompt yet. To test real install, run: npm run build && npm run preview');
        return false;
      }
      console.log('[PWA][DEV] prompting install...');
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log('[PWA][DEV] userChoice outcome:', outcome);
        if (outcome === 'accepted') {
          setIsInstalled(true);
          setDeferredPrompt(null);
          return true;
        }
        return false;
      } catch (err) {
        console.error('[PWA][DEV] install prompt error:', err);
        return false;
      }
    }

    if (!deferredPrompt) {
      // No prompt available yet – ask browser to surface it later
      console.warn('[PWA] No deferredPrompt available yet');
      setIsInstallable(false);
      return false;
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log('[PWA] userChoice outcome:', outcome);

      if (outcome === 'accepted') {
        // Installation success – keep button visible per product requirement
        setIsInstalled(true);
        setDeferredPrompt(null);
        // Some browsers may not fire beforeinstallprompt again until reload
        return true;
      }
      return false;
    } catch (err) {
      console.error('[PWA] install prompt error:', err);
      return false;
    }
  };

  return {
    isInstallable,
    isInstalled,
    installApp,
  };
};

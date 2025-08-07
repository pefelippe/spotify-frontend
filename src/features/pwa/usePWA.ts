import { useState, useEffect } from 'react';
import { BeforeInstallPromptEvent, PWAHookReturn } from '../types/pwa';

export const usePWA = (): PWAHookReturn => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Enable in dev mode for testing
    if (import.meta.env.DEV) {
      setIsInstallable(true);
    }

    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', handler);

    // Listen for successful installation
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const installApp = async (): Promise<boolean> => {
    if (!deferredPrompt && !import.meta.env.DEV) {
      return false;
    }

    if (import.meta.env.DEV) {
      setIsInstalled(true);
      setIsInstallable(false);
      return true;
    }

    try {
      deferredPrompt!.prompt();
      const { outcome } = await deferredPrompt!.userChoice;

      if (outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
        setDeferredPrompt(null);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };

  return {
    isInstallable,
    isInstalled,
    installApp,
  };
};

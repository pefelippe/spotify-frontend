import { usePWA } from '../hooks/usePWA';

export const PWADebug = () => {
  const { isInstallable, isInstalled, installApp } = usePWA();

  const checkPWASupport = () => {
    const support = {
      serviceWorker: 'serviceWorker' in navigator,
      beforeInstallPrompt: 'BeforeInstallPromptEvent' in window,
      standalone: window.matchMedia('(display-mode: standalone)').matches,
      displayMode: window.matchMedia('(display-mode: standalone)').matches ? 'standalone' : 'browser',
    };

    console.log('🔧 PWA Support Check:', support);
    return support;
  };

  const handleDebugClick = () => {
    checkPWASupport();
    console.log('🔧 PWA State:', { isInstallable, isInstalled });
  };

  if (import.meta.env.PROD) {
    return null; // Only show in development
  }

  return (
    <div className="fixed top-4 right-4 bg-gray-800 p-4 rounded-lg text-white text-xs z-50">
      <h3 className="font-bold mb-2">PWA Debug</h3>
      <div className="space-y-1">
        <div>Installable: {isInstallable ? '✅' : '❌'}</div>
        <div>Installed: {isInstalled ? '✅' : '❌'}</div>
        <button
          onClick={handleDebugClick}
          className="bg-blue-600 px-2 py-1 rounded text-xs"
        >
          Debug
        </button>
        <button
          onClick={installApp}
          className="bg-green-600 px-2 py-1 rounded text-xs ml-1"
        >
          Install
        </button>
      </div>
    </div>
  );
};

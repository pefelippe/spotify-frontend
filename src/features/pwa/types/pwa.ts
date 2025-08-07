export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export interface PWAHookReturn {
  isInstallable: boolean;
  isInstalled: boolean;
  installApp: () => Promise<boolean>;
}

import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.c2edbe4088bf4c7d894dc7b63353546f',
  appName: 'GameMatch',
  webDir: 'dist',
  server: {
    url: 'https://c2edbe40-88bf-4c7d-894d-c7b63353546f.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: "#0B1B3D",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
    },
  },
};

export default config;
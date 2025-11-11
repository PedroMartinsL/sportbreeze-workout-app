import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  name: "sportbreeze-workout-app",
  slug: "sportbreeze-workout-app",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "sportbreezeworkoutapp",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    infoPlist: {
      NSLocationWhenInUseUsageDescription:
        "Precisamos da sua localização para sugerir treinos baseados no clima local."
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff"
    },
    edgeToEdgeEnabled: true,
    permissions: [
      "ACCESS_COARSE_LOCATION",
      "ACCESS_FINE_LOCATION",
      "FOREGROUND_SERVICE"
    ],
    package: "com.pedromartinsl.sportbreezeworkoutapp",
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png"
  },
  plugins: [
    [
      "expo-notifications",
      {
        icon: "./assets/images/icon-not.png",
        color: "#ffffff",
        defaultChannel: "default",
        enableBackgroundRemoteNotifications: false
      }
    ]
  ],
  experiments: {
    typedRoutes: true
  },
  extra: {
    eas: {
      projectId: "38f23ad9-d695-4cc1-a8b7-9d452ba9ef61"
    }
  }
});

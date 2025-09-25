import 'tsx/cjs';

module.exports = () => {
    return {
        "expo": {
            "name": "react-native-maps-web",
            "slug": "react-native-maps-web",
            "version": "1.0.0",
            "orientation": "portrait",
            "icon": "./assets/images/icon.png",
            "scheme": "reactnativemapsweb",
            "userInterfaceStyle": "automatic",
            "newArchEnabled": true,
            "ios": {
                "supportsTablet": true,
                "bundleIdentifier": "com.amaxsoftware.reactnativemapsweb",
                "config": {
                    "googleMapsApiKey": process.env.EXPO_PUBLIC__GOOGLE_MAPS_API_KEY__IOS!
                },
                "infoPlist": {
                    "NSLocationWhenInUseUsageDescription": "Location is required for map and navigation functionality."
                }
            },
            "android": {
                "adaptiveIcon": {
                    "backgroundColor": "#E6F4FE",
                    "foregroundImage": "./assets/images/android-icon-foreground.png",
                    "backgroundImage": "./assets/images/android-icon-background.png",
                    "monochromeImage": "./assets/images/android-icon-monochrome.png"
                },
                "edgeToEdgeEnabled": true,
                "predictiveBackGestureEnabled": false,
                "package": "com.amaxsoftware.reactnativemapsweb"
            },
            "web": {
                "output": "static",
                "favicon": "./assets/images/favicon.png"
            },
            "plugins": [
                [
                    "expo-location",
                    {
                        "locationAlwaysAndWhenInUsePermission": "Allow $(PRODUCT_NAME) to use your location."
                    }
                ],
                "./plugins/google-maps-setup.ts",
                "expo-router",
                [
                    "expo-splash-screen",
                    {
                        "image": "./assets/images/splash-icon.png",
                        "imageWidth": 200,
                        "resizeMode": "contain",
                        "backgroundColor": "#ffffff",
                        "dark": {
                            "backgroundColor": "#000000"
                        }
                    }
                ],
            ],
            "experiments": {
                "typedRoutes": true,
                "reactCompiler": true,
                "baseUrl": process.env.EXPO_PUBLIC__BASE_URL!,
            }
        }
    }

}

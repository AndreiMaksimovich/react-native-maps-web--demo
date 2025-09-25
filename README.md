# Cross-Platform Maps for React Native (Android, iOS, Web)

This repo contains a lightweight extension/wrapper of react-native-maps that adds Web support (using vis.gl/react-google-maps) alongside Android and iOS. And demo project.

Give it a try: [https://demos.amaxsoftware.com/01.react-native-maps-web/](https://demos.amaxsoftware.com/01.react-native-maps-web/)

![QR Code with the demo project link](./qr-code.png)

### Extension/Wrapper Features:
- Display maps on Android, iOS, and Web
- Simple API for map camera control and map interactions
- Show user location and device heading
- Support for markers and polylines
- Easy integration with existing React Native projects

### Project Structure
- **/src/react-native-maps-web/** – react-native-maps extension/wrapper
- **/src/foreground-location-provider/** – Cross-platform user location provider
- **/src/device-heading-provider/** – Cross-platform device heading provider

### How to Install
Create your own .env.development.local and .env.local files, or update .env.development and .env with your values.

**Note:** navigator.geolocation and AbsoluteOrientationSensor require HTTPS to function properly (except on localhost). To test locally on real devices, you can generate a certificate and run your development server through a https proxy: npx local-ssl-proxy --source 443 --target 8081 --cert localhost.pem --key localhost-key.pem


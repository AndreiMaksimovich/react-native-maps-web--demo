import { withAndroidManifest, AndroidConfig, ConfigPlugin } from 'expo/config-plugins';

const googleMapsSetup: ConfigPlugin = (config) => {
    config = withAndroidManifest(config, config => {
        const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(config.modResults);
        AndroidConfig.Manifest.addMetaDataItemToMainApplication(
            mainApplication,
            'com.google.android.geo.API_KEY',
            process.env.EXPO_PUBLIC__GOOGLE_MAPS_API_KEY__ANDROID!
        );
        return config;
    });

    return config;
};

export default googleMapsSetup;

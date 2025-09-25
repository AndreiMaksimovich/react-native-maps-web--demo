import {SafeAreaView} from "react-native-safe-area-context";
import {Alert, Button, Platform, View, StyleSheet, ImageURISource, ImageRequireSource} from "react-native";
import MapView, {Map, MapMarker, MapPolyline} from "@/src/react-native-maps-web";
import {Image} from "expo-image";
import {MapRect} from "@/src/react-native-maps-web/Types";
import {useEffect, useRef, useState} from "react";
import {ForegroundLocationProvider} from "@/src/foreground-location-provider/ForegroundLocationProvider";
import {Checkbox} from "expo-checkbox";
import {LocationObject} from "expo-location";
import { DeviceHeadingProvider } from "@/src/device-heading-provider/DeviceHeadingProvider";
import {LatLng} from "react-native-maps/lib/sharedTypes";
import {ThemedText} from "@/src/components/themed-text";

const batumiRegion: MapRect = {
    northEast: { latitude: 41.66125785542457, longitude: 41.57580994051841 },
    southWest: { latitude: 41.60488919553704, longitude: 41.663742934890244 }
};

const warsawRegio: MapRect = {
    northEast: { latitude: 52.385443660303956, longitude: 20.802271298281543 },
    southWest: { latitude: 52.13279018111788, longitude: 21.296392793565133 }
}

const polylineData: LatLng[] =
    Array.from([
        [41.63269751483311, 41.612141861407615],
        [41.63722150977695, 41.61879193526783],
        [41.641162151419486, 41.62447781675612],
        [41.647288223018144, 41.6449824653606],
        [41.64636962148884, 41.6471891599236],
        [41.646267672031584, 41.65164590022096],
        [41.64638776586509, 41.65809266696618]
    ].map((item) => {return { latitude: item[0], longitude: item[1] }}));

interface MapMarkerData {
    id: string;
    coordinate: LatLng;
    image: ImageURISource | ImageRequireSource;
}

const mapMarkers: MapMarkerData[] = [
    { id: "A", image: require("@/assets/icons/icon.heart.png"), coordinate: {latitude: 41.64039480147793, longitude: 41.612313630301344} },
    { id: "B", image: require("@/assets/icons/icon.home.png"), coordinate: {longitude: 41.62623001437079, latitude: 41.64761113174779} },
    { id: "C", image: require("@/assets/icons/icon.star.png"), coordinate: {longitude: 41.64760361679618, latitude: 41.645508745682584} },
]

export default function MapScreen() {
    const mapRef = useRef<Map>(null);
    const [moveCameraToToUserLocation, setMoveCameraToToUserLocation] = useState<boolean>(false);
    const [showUserLocation, setShowUserLocation] = useState(false);
    const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
    const [userLocation, setUserLocation] = useState<LocationObject | null>(null);

    useEffect(
        () => {
            if (!moveCameraToToUserLocation || !userLocation || !mapRef.current) return;
            setMoveCameraToToUserLocation(false);
            mapRef.current.setRegion({
                longitude: userLocation.coords.longitude,
                latitude: userLocation.coords.latitude,
                latitudeDelta: 0.025,
                longitudeDelta: 0.025,
            });
        },
        [moveCameraToToUserLocation, userLocation]
    );

    const handleUserLocationChange = (event: LocationObject) => {
        setUserLocation(event);
    }

    const handleShowUserLocationToggle = (value: boolean) => {
        setShowUserLocation(value);
        setUserLocation(null);
        if (value) {
            setMoveCameraToToUserLocation(true);
        }
    }

    const handleOnMapMarkerClick = (id: string) => {
        const message = `On Map Marker Click id=${id}`;
        console.log(message);
        if (Platform.OS === 'web') {
            alert(message)
        } else {
            Alert.alert("", message);
        }
    }

    return (
        <SafeAreaView style={{flex: 1}}>

            <ForegroundLocationProvider
                onPermissionDenied={console.error}
                periodicity={1000}
                enabled={showUserLocation}
                onLocationChange={handleUserLocationChange}
                onLocationError={console.error} />

            <DeviceHeadingProvider
                enabled={showUserLocation}
                onChange={setDeviceHeading}
                onPermissionDenied={() => console.error("DeviceHeadingProvider PermissionDenied")} />

            <View style={styles.contentContainer}>

                {/* Show User Location */}
                <View style={styles.showUserLocationContainer}>
                    <Checkbox
                        value={showUserLocation}
                        onValueChange={handleShowUserLocationToggle}
                    />
                    <ThemedText type={"subtitle"} style={{paddingLeft: 5}}> Show user location</ThemedText>
                </View>

                {/* Move camera to */}
                <View style={styles.moveCameraToContainer}>
                    <ThemedText type={"subtitle"}>Show:</ThemedText>
                    <Button title={"Warsaw"} onPress={() => {
                        if (mapRef.current) {
                            mapRef.current.setMapRect(warsawRegio);
                        }
                    }}/>
                    <Button title={"Batumi"} onPress={() => {
                        if (mapRef.current) {
                            mapRef.current.setMapRect(batumiRegion);
                        }
                    }}/>
                </View>

                {/* Map */}
                <MapView
                    showsUserLocation={false}
                    provider={"google"}
                    mapRef={mapRef}
                    initialMapRect={batumiRegion}
                    googleMapId={"main"}
                    webGoogleMapsApiKey={process.env.EXPO_PUBLIC__GOOGLE_MAPS_API_KEY__WEB!}
                    webDefaultZoom={10}>

                    {/* Map Markers */}
                    {mapMarkers.map(
                        (data) => {
                            return (
                                <MapMarker
                                    webImageStyle={styles.mapMarker}
                                    uniOnClick={handleOnMapMarkerClick}
                                    key={data.id} id={data.id}
                                    image={data.image}
                                    coordinate={data.coordinate} />
                            )
                        }
                    )}

                    {/* Polyline */}
                    <MapPolyline
                        webStrokeColor={"darkblue"}
                        webStrokeWeight={3}
                        webStrokeOpacity={0.75}
                        strokeWidth={3}
                        strokeColor={"darkblue"}
                        coordinates={polylineData}/>

                    {/* User location & device direction */}
                    {showUserLocation && userLocation &&
                        <MapMarker coordinate={userLocation.coords}>
                            {deviceHeading
                                ?
                                <Image
                                    source={require("@/assets/icons/icon.user-location-direction.png")}
                                    style={[
                                        styles.mapMarker,
                                        { transform: [{rotate: (deviceHeading -(mapRef?.current?.getMapHeading() ?? 0)) + "deg"}] }
                                    ]}/>
                                :
                                <Image
                                    source={require("@/assets/icons/icon.user-location.png")}
                                    style={styles.mapMarker}/>
                            }
                        </MapMarker>
                    }

                </MapView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    contentContainer: {flex: 1, flexDirection: "column"},
    showUserLocationContainer: {flexDirection: 'row', padding: 5, paddingLeft: 20, alignItems: "center"},
    moveCameraToContainer: {width:"100%", flexDirection: "row", alignItems: "center", padding: 5, gap: 10},
    mapMarker: { width: 32, height: 32 }
});

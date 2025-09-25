import MapView, {
    MapViewProps as RNMapViewProps,
    MapMarkerProps as RNMapMarkerProps,
    MapPolylineProps as RNMapPolylineProps, LatLng, Region
} from "react-native-maps";
import {CSSProperties, RefObject} from "react";
import {AdvancedMarkerAnchorPoint} from "@vis.gl/react-google-maps";
import {BoundingBox} from "react-native-maps/lib/MapView.types";
import {StyleProp} from "react-native";
import {ImageStyle as RNImageStyle} from "react-native/Libraries/StyleSheet/StyleSheetTypes";

export type MapRect = BoundingBox;

export interface UniOnUserLocationChangeEvent {
    coordinates?: LatLng;
    error?: string;
}

export interface MapViewProps extends RNMapViewProps {
    webGoogleMapsApiKey: string;
    webDefaultZoom: number;
    initialMapRect?: MapRect;
    mapRef?: RefObject<Map | null>;
    webStyle?: CSSProperties;
}

export interface MapMarkerProps extends RNMapMarkerProps {
    uniOnClick? (id?: string): void;
    webAnchorPoint?: AdvancedMarkerAnchorPoint | [string, string];
    webImageStyle?: StyleProp<RNImageStyle>;
}

export interface MapPolylineProps extends RNMapPolylineProps {
    webStrokeWeight?: number;
    webStrokeColor?: string;
    webStrokeOpacity?: number;
}

export interface Map {
    getMap(): MapView | google.maps.Map;
    setZoom: (zoom: number) => void;
    getZoom(): Promise<number|undefined>;
    setRegion: (region: Region) => void;
    getRegion(): Promise<Region|undefined>;
    setMapRect: (rect: MapRect) => void;
    getMapRect(): Promise<MapRect|undefined>;
    getMapHeading(): number;
}

import {MapRect} from "./Types";
import {Region} from "react-native-maps";
import LatLngBoundsLiteral = google.maps.LatLngBoundsLiteral;

export function mapRectToRegion(rect: MapRect): Region {
    let longitude: number | undefined;
    let longitudeDelta: number | undefined;

    if (rect.northEast.longitude > rect.southWest.longitude) {
        longitudeDelta = (180 - rect.northEast.longitude) + (rect.southWest.longitude + 180);

        if (Math.abs(rect.northEast.longitude) > Math.abs(rect.southWest.longitude)) {
            longitude = rect.southWest.longitude - longitudeDelta/2.0;
        } else {
            longitude = rect.northEast.longitude + longitudeDelta/2.0;
        }
    }

    return  {
        latitude: (rect.northEast.latitude + rect.southWest.latitude)/2.0,
        longitude: longitude ?? (rect.northEast.longitude + rect.southWest.longitude)/2.0,
        latitudeDelta: (rect.northEast.latitude - rect.southWest.latitude),
        longitudeDelta: longitudeDelta ?? rect.southWest.longitude - rect.northEast.longitude
    }
}

export function boundsToRegion(bounds: LatLngBoundsLiteral): Region {
    return mapRectToRegion({
        northEast: {
            latitude: bounds.north,
            longitude: bounds.east
        },
        southWest: {
            latitude: bounds.south,
            longitude: bounds.west
        }
    });
}

function normalizeLongitude(value: number) {
    if (value > 180) {
        value -= 360;
    }
    if (value < -180) {
        value += 360;
    }
    return value;
}

function normalizeLatitude(value: number) {
    if (value > 90) {
        value = 90;
    }
    if (value < -90) {
        value = -90;
    }
    return value;
}

export function regionToMapRect(region: Region): MapRect {
    return {
        northEast: {
            latitude: normalizeLatitude(region.latitude + region.latitudeDelta/2.0),
            longitude: normalizeLongitude(region.longitude - region.longitudeDelta/2.0)
        },
        southWest: {
            latitude: normalizeLatitude(region.latitude - region.latitudeDelta/2.0),
            longitude: normalizeLongitude(region.longitude + region.longitudeDelta/2.0)
        }
    }
}

export function calculateAppropriateZoomForRegion(region: Region, map: google.maps.Map): number {
    const div = map.getDiv();

    const width = div.clientWidth;
    const height = div.clientHeight;
    const portrait = height > width;

    const heightRatio = portrait ? 1 : height/width;
    const widthRatio = portrait ? width/height : 1;

    let size: number;
    let targetDelta: number;

    if (Math.abs(region.latitudeDelta)/heightRatio > Math.abs(region.longitudeDelta)/widthRatio) {
        size = 180 * heightRatio;
        targetDelta = Math.abs(region.latitudeDelta);
    } else {
        size = 180 * widthRatio;
        targetDelta = Math.abs(region.longitudeDelta);
    }

    let zoom: number;
    for (zoom = 3; zoom<=20; zoom++) {
        size = size / 2.0;
        if (size < targetDelta) break;
    }

    return zoom;
}

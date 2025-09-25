import {Map, MapRect} from "./Types"
import MapView, {Region} from "react-native-maps";
import {calculateAppropriateZoomForRegion, regionToMapRect, mapRectToRegion} from "./Utils";

export class MapWeb implements Map {

    constructor(private readonly map: google.maps.Map) {}

    async getZoom() {
        return this.map.getZoom() ?? -1;
    }
    async getRegion() {
        const bounds = this.map.getBounds();

        const northEast = bounds?.getNorthEast();
        const southWest = bounds?.getSouthWest();

        if (northEast && southWest) {
            return mapRectToRegion({
                northEast: {
                    latitude: northEast.lat(),
                    longitude: northEast.lng(),
                },
                southWest: {
                    latitude: southWest.lat(),
                    longitude: southWest.lng(),
                }
            })
        }

        return undefined;
    }

    async getMapRect() {
        const region = await this.getRegion();
        return region ? regionToMapRect(region) : undefined;
    }

    getMap(): MapView | google.maps.Map {
        return this.map;
    }

    setRegion(region: Region): void {
        this.map.setCenter({ lat: region.latitude, lng: region.longitude });
        this.map.setZoom(calculateAppropriateZoomForRegion(region, this.map));
    }

    setMapRect(rect: MapRect): void {
        this.setRegion(mapRectToRegion(rect));
    }

    setZoom(zoom: number): void {
        this.map.setZoom(zoom);
    }

    getMapHeading(): number {
        return this.map.getHeading() ?? 0;
    }
}

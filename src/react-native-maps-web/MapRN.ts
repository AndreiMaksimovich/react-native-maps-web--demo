import {Map, MapRect} from "./Types"
import MapView, {Camera, Region} from "react-native-maps";
import {mapRectToRegion} from "./Utils";
import { Platform } from "react-native";

export class MapRN implements Map {

    camera: Camera | null = null;

    constructor(private readonly map: MapView) {}

    async getZoom() {
        console.warn("Zoom is only supported in Web mode")
        return undefined;
    }

    async getRegion() {
        const boundaries = await this.map.getMapBoundaries();
        return mapRectToRegion(boundaries)
    }

    async getMapRect() {
        return await this.map.getMapBoundaries();
    }

    getMap(): MapView | google.maps.Map {
        return this.map;
    }

    setRegion(region: Region): void {
        this.map.animateToRegion(region);
    }

    setMapRect(rect: MapRect): void {
        const region = mapRectToRegion(rect);
        if (Platform.OS === 'ios') {
            // This strange piece of code exists to avoid two iOS specific bugs: Google Maps longitude corner situation "longA --> 180|-180 --> longB", Apple Maps not loading map data after moving to a new region.
            this.map.fitToCoordinates([rect.southWest, rect.northEast]);
            if (this.map.props.provider !== "google") {
                this.setRegion(region);
            }
        } else {
            this.setRegion(region);
        }
    }

    setZoom(zoom: number): void {
        console.warn("Zoom is only supported in Web mode")
    }

    getMapHeading(): number {
        return this.camera?.heading ?? 0;
    }

    updateCamera() {
        this.map.getCamera()
            .then(camera => {this.camera = camera;})
            .catch(console.error);
    }
}

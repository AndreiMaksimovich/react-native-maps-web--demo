import {MapPolylineProps} from "./Types";
import { useMap } from "@vis.gl/react-google-maps";
import { useEffect } from "react";

export function MapPolyline(props: MapPolylineProps) {
    const map = useMap();

    useEffect(
        () => {
            if (!map) return;

            const polyline = new google.maps.Polyline({
                path: Array.from(props.coordinates.map(i => { return {lat: i.latitude, lng: i.longitude}})),
                strokeWeight: props.webStrokeWeight,
                strokeColor: props.webStrokeColor,
                strokeOpacity: props.webStrokeOpacity
            });

            polyline.setMap(map);

            return () => {
                polyline.setMap(null);
            };
        },
        [map, props.coordinates, props.webStrokeWeight, props.webStrokeColor, props.webStrokeOpacity]
    );
}

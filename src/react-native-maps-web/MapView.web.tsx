import {MapViewProps} from "./Types";
import React, {useEffect} from 'react'
import {APIProvider, Map, useMap, MapCameraChangedEvent} from '@vis.gl/react-google-maps';
import {mapRectToRegion, calculateAppropriateZoomForRegion, boundsToRegion} from "./Utils";
import {MapWeb} from "./MapWeb";

function getInitialRegionCenter(props: MapViewProps):google.maps.LatLngLiteral | undefined {
    const region = props.initialMapRect ? mapRectToRegion(props.initialMapRect) : props.initialRegion

    if (region) {
        return {
            lat: region.latitude,
            lng: region.longitude,
        };
    }

    return undefined;
}

export function MapView(props: MapViewProps) {
    const onBoundsChanged = (event: MapCameraChangedEvent) => {
        if (props.onRegionChange) {
            props.onRegionChange(boundsToRegion(event.detail.bounds), {});
        }
    }

    return (
        <APIProvider apiKey={props.webGoogleMapsApiKey}>
            <Map
                streetViewControl={false}
                rotateControl={true}
                fullscreenControl={false}
                cameraControl={false}
                mapTypeControl={false}
                mapId={props.googleMapId}
                style={props.webStyle ?? {width: "100%", height: "100%"}}
                defaultZoom={props.webDefaultZoom ?? 10}
                onBoundsChanged={onBoundsChanged}
                defaultCenter={getInitialRegionCenter(props)}>
                <MapDefaultZoomSetter {...props}/>
                <MapReferenceSetter {...props}/>
                {props.children}
            </Map>
        </APIProvider>
    );
}

function MapReferenceSetter(props: MapViewProps) {
    const map = useMap();

    useEffect(() => {
        if (props.mapRef && map) {
            props.mapRef.current = new MapWeb(map);
            return () => { if (props.mapRef) props.mapRef.current = null; };
        }
    }, [map, props.mapRef]);

    return <></>
}

function MapDefaultZoomSetter(props: MapViewProps) {
    const map = useMap();

    useEffect(() => {
        if (map != null && (props.initialRegion !== undefined || props.initialMapRect !== undefined)) {
            const region = props.initialRegion ? props.initialRegion : mapRectToRegion(props.initialMapRect!);
            map.setZoom(calculateAppropriateZoomForRegion(region, map));
        }
    }, [map, props.initialRegion, props.initialMapRect]);

    return <></>;
}

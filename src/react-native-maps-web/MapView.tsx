import {MapViewProps} from "./Types";
import {default as RNMapView} from "react-native-maps";
import {mapRectToRegion} from "./Utils";
import {useEffect, useRef} from "react";
import {MapRN} from "./MapRN";

export function MapView(props: MapViewProps) {
    const initialRegion = props.initialMapRect !== undefined ? mapRectToRegion(props.initialMapRect) : props.initialRegion;
    const rnMap = useRef<RNMapView>(null);

    useEffect(() => {
        if (props.mapRef && rnMap.current) {
            props.mapRef.current = new MapRN(rnMap.current);
        }
    }, [rnMap, props.mapRef]);

    return (
        <RNMapView
            {...props}
            onRegionChange={(region, details) => {
                props.onRegionChange?.(region, details);
                // @ts-ignore
                props.mapRef?.current?.updateCamera();
            }}
            style={props.style ?? {width: "100%", height: "100%"}}
            ref={rnMap}
            initialRegion={initialRegion}>
            {props.children}
        </RNMapView>
    );
}


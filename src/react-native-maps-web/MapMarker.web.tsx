import { MapMarkerProps } from "./Types";
import { AdvancedMarker } from '@vis.gl/react-google-maps';
import { Image } from "expo-image";

export function MapMarker(props: MapMarkerProps) {
    return (
        <AdvancedMarker
            anchorPoint={props.webAnchorPoint}
            position={{lat: props.coordinate.latitude, lng: props.coordinate.longitude}}
            title={props.title}
            onClick={() => { props.uniOnClick?.(props.id); }}
            key={props.id}>
            {props.image && <Image source={props.image} style={props.webImageStyle ?? {width: 32, height: 32}}/>}
            {props.children}
        </AdvancedMarker>
    );
}

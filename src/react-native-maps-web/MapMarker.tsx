import { MapMarkerProps } from "./Types";
import { MapMarker as RNMapMarker } from 'react-native-maps';

export function MapMarker(props: MapMarkerProps) {
    return (
        <RNMapMarker
            onPress={(event) => { props.uniOnClick?.(props.id); props.onPress?.(event); }}
            {...props}/>
    );
}

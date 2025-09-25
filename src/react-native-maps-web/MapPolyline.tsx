import {MapPolylineProps} from "./Types";
import { MapPolyline as RNMapPolyline } from "react-native-maps";

export function MapPolyline(props: MapPolylineProps) {
    return <RNMapPolyline {...props}/>;
}

import {LocationAccuracy, LocationObject, LocationPermissionResponse} from "expo-location";

export interface ForegroundLocationProviderProps {
    enabled: boolean;
    periodicity: number;
    onPermissionDenied?: (response: LocationPermissionResponse) => void;
    onLocationChange: (location: LocationObject) => void;
    onLocationError: (reason: string) => void;
    accuracy?: LocationAccuracy.High
}

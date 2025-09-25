import * as Location from 'expo-location';
import { LocationAccuracy } from 'expo-location';
import { useEffect } from "react";
import { ForegroundLocationProviderProps } from "./ForegroundLocationProviderProps";
import { useForegroundLocationProviderPermission } from "./ForegroundLocationProviderPermissions";

export function ForegroundLocationProvider(props: ForegroundLocationProviderProps) {

    const permission = useForegroundLocationProviderPermission(props);

    useEffect(
        () => {
            if (!props.enabled || !permission?.granted) return;

            let cancelled = false;
            let isRequestingLocation = false;

            Location.getLastKnownPositionAsync().then((location) => { if (!cancelled && location) props.onLocationChange(location); });

            const interval = setInterval(
                () => {
                    if (cancelled || isRequestingLocation) return;
                    isRequestingLocation = true;
                    Location.getCurrentPositionAsync({accuracy: props.accuracy ?? LocationAccuracy.High})
                        .then((location) => { if (!cancelled) { props.onLocationChange(location); } })
                        .catch((error) => { if (!cancelled) { props.onLocationError(error); }})
                        .finally(() => isRequestingLocation = false)
                },
                props.periodicity);

            return () => { clearInterval(interval); cancelled = true; }
        },
        [props.enabled, props.periodicity, props.onLocationChange, props.onLocationError, permission, props.accuracy]
    );

    return <></>
}

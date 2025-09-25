import { useEffect } from "react";
import { ForegroundLocationProviderProps } from "./ForegroundLocationProviderProps";
import { useForegroundLocationProviderPermission } from "./ForegroundLocationProviderPermissions";

export function ForegroundLocationProvider(props: ForegroundLocationProviderProps) {
    const permission = useForegroundLocationProviderPermission(props);

    useEffect(() => {
        if (!props.enabled || permission?.granted !== true) return;

            const positionCallback = (position: GeolocationPosition) => {
                props.onLocationChange({
                    coords: {
                        longitude: position.coords.longitude,
                        latitude: position.coords.latitude,
                        accuracy: null,
                        heading: null,
                        speed: null,
                        altitude: null,
                        altitudeAccuracy: null
                    },
                    timestamp: Date.now(),
                });
            }

            const errorCallback = (error: GeolocationPositionError) => props.onLocationError?.(error.message);

            const options: PositionOptions = {
                timeout: props.periodicity
            }

            const watchId = navigator.geolocation.watchPosition(positionCallback, errorCallback, options);
            return () => navigator.geolocation.clearWatch(watchId);

    }, [props.enabled, props.onLocationChange, permission]);

    return <></>;
}



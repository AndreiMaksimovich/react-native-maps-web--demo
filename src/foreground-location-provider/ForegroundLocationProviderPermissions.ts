import {ForegroundLocationProviderProps} from "@/src/foreground-location-provider/ForegroundLocationProviderProps";
import {useEffect, useState} from "react";
import {LocationPermissionResponse} from "expo-location";
import * as Location from "expo-location";

export function useForegroundLocationProviderPermission(props: ForegroundLocationProviderProps) {
    const [permission, setPermission] = useState<LocationPermissionResponse | null>(null);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            const permission = await requestForegroundLocationPermissionsAsync();
            if (cancelled) return;
            if (!permission.granted && props.onPermissionDenied) {
                props.onPermissionDenied(permission);
            }
            setPermission(permission);
        })();

        return () => { cancelled = true; };
    }, [props.enabled, props.onPermissionDenied]);

    return permission;
}

export async function requestForegroundLocationPermissionsAsync(): Promise<LocationPermissionResponse> {
    return await Location.requestForegroundPermissionsAsync();
}

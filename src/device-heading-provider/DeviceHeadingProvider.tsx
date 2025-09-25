import {useEffect, useState} from "react";
import CompassHeading from "react-native-compass-heading";
import { DeviceHeadingProviderProps } from "./DeviceHeadingProviderCommon";
import {PermissionResponse, PermissionStatus} from "expo-modules-core";

export function DeviceHeadingProvider(props: DeviceHeadingProviderProps) {
    useEffect(
        () => {
            if (!props.enabled) return;

            // @ts-ignore
            CompassHeading.start(1, ({heading}) => {
                props.onChange(heading);
            });

            return () => {
                CompassHeading.stop();
            }
        },
        [props.enabled]);

    return <></>
}

export function isHeadingProviderAvailable(): boolean {
    return true;
}

const defaultPositivePermissionResponse: PermissionResponse = {
    status: PermissionStatus.GRANTED,
    granted: true,
    expires: "never",
    canAskAgain: true,
}

export async function requestDeviceHeadingProviderPermissions(): Promise<PermissionResponse> {
    return defaultPositivePermissionResponse;
}

export function useDeviceHeadingProviderPermission(props: DeviceHeadingProviderProps) {
    const [ permissionResponse ] = useState<PermissionResponse | null>(defaultPositivePermissionResponse);
    return permissionResponse;
}

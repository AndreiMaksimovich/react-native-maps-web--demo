import { DeviceHeadingProviderProps } from "./DeviceHeadingProviderCommon";
import { PermissionResponse, PermissionStatus } from "expo-modules-core";
import {useEffect, useState} from "react";

export function DeviceHeadingProvider(props: DeviceHeadingProviderProps) {
    const permissionStatus = useDeviceHeadingProviderPermission(props);

    useEffect(
        () => {
            if (!props.enabled || !isHeadingProviderAvailable() || permissionStatus?.granted !== true) return;

            // @ts-ignore
            const sensor = new AbsoluteOrientationSensor();
            sensor.start();
            sensor.addEventListener(
                "reading",
                () => props.onChange?.(getHeadingFromQuaternion(sensor.quaternion))
            );

            return () => sensor.stop()
        },
        [props.enabled, props.onChange, permissionStatus]
    );

    return <></>
}

function getHeadingFromQuaternion(q: number[]) {
    const rollRad = Math.atan2(
        2*(q[0]*q[1] + q[2]*q[3]),
        q[0]*q[0] - q[1]*q[1] - q[2]*q[2] + q[3]*q[3]
    );

    let rollAngle = -rollRad * 180 / Math.PI;
    if (rollAngle < 0) {
        rollAngle += 360;
    }

    return rollAngle;
}

export function isHeadingProviderAvailable(): boolean {
    // @ts-ignore
    return typeof AbsoluteOrientationSensor === "function";
}

export async function requestDeviceHeadingProviderPermission(): Promise<PermissionResponse> {
    const requiredPermissions = ["accelerometer", "magnetometer", "gyroscope"];

    for (const permission of requiredPermissions) {
        // @ts-ignore
        const status = await navigator.permissions.query({ name: permission });
        if (status.state !== "granted") {
            return {
                status: PermissionStatus.DENIED,
                canAskAgain: true,
                granted: false,
                expires: "never"
            }
        }
    }

    return {
        status: PermissionStatus.GRANTED,
        granted: true,
        expires: "never",
        canAskAgain: true,
    }
}

export function useDeviceHeadingProviderPermission(props: DeviceHeadingProviderProps) {
    const [permissionResponse, setPermissionResponse] = useState<PermissionResponse | null>(null);

    useEffect(
        () => {
            if (!isHeadingProviderAvailable() || permissionResponse?.granted) return;
            let canceled = false;

            (async () => {
                const permissionsStatus = await requestDeviceHeadingProviderPermission();
                if (canceled) return;
                if (!permissionsStatus.granted) {
                    props.onPermissionDenied?.();
                }
                setPermissionResponse(permissionsStatus);
            })();

            return () => { canceled = true; };
        },
        [props.enabled, props.onPermissionDenied]);

    return permissionResponse;
}



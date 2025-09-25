export interface DeviceHeadingProviderProps {
    enabled: boolean;
    onChange: (value: number) => void;
    onPermissionDenied?: () => void;
}

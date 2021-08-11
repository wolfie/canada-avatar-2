import React from "react";

type MicInputProps = {
  hasAskedForUserMedia: boolean;
  selectedMicDeviceId: string | undefined;
  onMicDeviceIdChange: (deviceId: string) => void;
};
const MicInput: React.FC<MicInputProps> = ({
  hasAskedForUserMedia,
  onMicDeviceIdChange,
  selectedMicDeviceId,
}) => {
  const [audioDevices, setAudioDevices] = React.useState<MediaDeviceInfo[]>([]);

  React.useEffect(() => {
    hasAskedForUserMedia &&
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) =>
          devices.filter((device) => device.kind === "audioinput")
        )
        .then(setAudioDevices);
  }, [hasAskedForUserMedia]);

  React.useEffect(() => {
    if (audioDevices.length === 0 || selectedMicDeviceId) return;
    onMicDeviceIdChange(audioDevices[0].deviceId);
  }, [audioDevices, selectedMicDeviceId, onMicDeviceIdChange]);

  return (
    <div>
      <label>
        Select audio input
        <select
          onChange={(e) => onMicDeviceIdChange(e.currentTarget.value)}
          value={selectedMicDeviceId}
        >
          {audioDevices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default MicInput;

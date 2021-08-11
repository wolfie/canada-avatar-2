import React from "react";

type MicInputProps = { hasAskedForUserMedia: boolean };
const MicInput: React.FC<MicInputProps> = ({ hasAskedForUserMedia }) => {
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

  return (
    <div>
      <label>
        Select audio input
        <select>
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

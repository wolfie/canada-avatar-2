import React from "react";
import Avatar from "./Avatar";
import Config from "./Config";

function App() {
  const [analyser, setAnalyser] = React.useState<AnalyserNode>();
  const [showConfig, setShowConfig] = React.useState(true);
  const [stream, setStream] = React.useState<MediaStream>();
  const [mouthPosition, setMouthPosition] = React.useState(0.736);
  const [nosePosition, setNosePosition] = React.useState({
    x: 0.516,
    y: 0.856,
  });
  const [selectedMicDeviceId, setSelectedMicDeviceId] =
    React.useState<string>();

  const reEvaluateShowConfig = () =>
    setShowConfig(window.location.hash !== "#done");

  React.useEffect(() => {
    let oldStream: MediaStream | undefined;
    window.navigator.mediaDevices
      .getUserMedia({
        audio: selectedMicDeviceId
          ? { deviceId: { exact: selectedMicDeviceId } }
          : true,
      })
      .then((stream) => {
        oldStream = stream;
        setStream(stream);
      });

    return () => oldStream?.getAudioTracks().forEach((track) => track.stop());
  }, [selectedMicDeviceId]);

  React.useEffect(() => {
    reEvaluateShowConfig();
    const hashChangeListener = () => reEvaluateShowConfig();
    window.addEventListener("hashchange", hashChangeListener);
    return () => window.removeEventListener("hashchange", hashChangeListener);
  }, []);

  React.useEffect(() => {
    if (!stream) {
      setAnalyser(undefined);
      return;
    }

    const audioCtx = new window.AudioContext();
    const analyser = audioCtx.createAnalyser();
    analyser.minDecibels = -50;
    analyser.maxDecibels = -10;
    analyser.smoothingTimeConstant = 0.7;
    analyser.fftSize = 32;

    const source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);

    setAnalyser(analyser);
  }, [stream]);

  React.useEffect(() => {
    const keyListener = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          return (window.location.hash = "");
      }
    };
    window.addEventListener("keyup", keyListener);
    return () => window.removeEventListener("keyup", keyListener);
  }, []);

  return (
    <>
      <Avatar
        small={showConfig}
        analyser={analyser}
        showConfig={showConfig}
        mouthPosition={mouthPosition}
        nosePosition={nosePosition}
      />
      {showConfig && (
        <Config
          hasAskedForUserMedia={!!stream}
          onMouthPositionChange={setMouthPosition}
          mouthPosition={mouthPosition}
          nosePosition={nosePosition}
          onNosePositionChange={setNosePosition}
          onMicDeviceIdChange={setSelectedMicDeviceId}
          selectedMicDeviceId={selectedMicDeviceId}
        />
      )}
    </>
  );
}

export default App;

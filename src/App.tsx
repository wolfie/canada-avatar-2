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

  const reEvaluateShowConfig = () =>
    setShowConfig(window.location.hash !== "#done");

  React.useEffect(() => {
    window.navigator.mediaDevices
      .getUserMedia({ audio: true })
      //.then((stream) => stream.getTracks().forEach((track) => track.stop()))
      .then(setStream);
  }, []);

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
        />
      )}
    </>
  );
}

export default App;

import React from "react";
import styled from "styled-components";

const BACKGROUND_IMG_URL = `${process.env.PUBLIC_URL}/bg.jpg`;
const AVATAR_IMG_URL = `${process.env.PUBLIC_URL}/avatar.png`;

const AvatarWrapper = styled.div<{ $small: boolean }>`
  position: relative;
  width: ${(p) => (p.$small ? `50vw` : `100vw`)};
  height: ${(p) => (p.$small ? `28.125vw` : `56.25vw`)};
`;

const BackgroundImg = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
`;

type Direction = "down" | "up";

const AvatarImgWrapper = styled.img`
  width: 100%;
`;
const AvatarImg = () => <AvatarImgWrapper src={AVATAR_IMG_URL} />;

type AvatarProps = {
  small: boolean;
  analyser: AnalyserNode | undefined;
  showConfig?: boolean;
  mouthPosition: number;
  nosePosition: { x: number; y: number };
};
const Avatar: React.FC<AvatarProps> = ({
  small,
  analyser,
  showConfig,
  mouthPosition,
  nosePosition,
}) => {
  const [translate, setTranslate] = React.useState(0);
  const [rotate, setRotate] = React.useState(0);

  const tiltHead = () => setRotate(Math.random() * 45 - 45 / 2);
  const resetTiltHead = () => setRotate(0);
  const openMouth = (mouthOpen: number) => setTranslate(-mouthOpen * 0.2);

  React.useEffect(() => {
    if (!analyser) return;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    let prevMaxPercentage = 0;
    let prevDirection: Direction = "down";
    let animationFrameRef: number = -1;

    var draw = function () {
      animationFrameRef = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      const maxPercentage =
        Array.from(dataArray).reduce((min, val) => Math.max(min, val)) / 128;

      const direction: Direction =
        prevMaxPercentage < maxPercentage ? "up" : "down";
      const shouldTiltHead =
        direction !== prevDirection &&
        (maxPercentage < 0.5 ||
          Math.abs(prevMaxPercentage - maxPercentage) > 0.2);
      const shouldResetHeadTilt = maxPercentage < 0.2;

      if (shouldTiltHead) tiltHead();
      else if (shouldResetHeadTilt) resetTiltHead();

      prevMaxPercentage = maxPercentage;
      openMouth(maxPercentage);
    };

    draw();

    return () => cancelAnimationFrame(animationFrameRef);
  }, [analyser]);

  return (
    <AvatarWrapper $small={small}>
      <BackgroundImg src={BACKGROUND_IMG_URL} />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          overflow: "hidden",
          height: `${mouthPosition * 100}%`,
          transformOrigin: `${nosePosition.x * 100}% ${nosePosition.y * 100}%`,
          transform: `translateY(${translate * 100}%)`,
          rotate: `${rotate}deg`,
        }}
      >
        {showConfig && (
          <div
            style={{
              position: "absolute",
              height: "5px",
              width: "5px",
              backgroundColor: "red",
              left: `calc(${nosePosition.x * 100}% - 2.5px)`,
              top: `calc(${nosePosition.y * 100}% - 2.5px)`,
            }}
          />
        )}
        <AvatarImg />
      </div>
      <div
        style={{
          position: "absolute",
          top: `${mouthPosition * 100}%`,
          bottom: 0,
          left: 0,
          width: "100%",
          overflow: "hidden",
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        {showConfig && (
          <div
            style={{
              backgroundColor: "red",
              height: "1px",
              width: "100%",
              top: 0,
              left: 0,
              position: "absolute",
            }}
          />
        )}
        <AvatarImg />
      </div>
    </AvatarWrapper>
  );
};

export default Avatar;

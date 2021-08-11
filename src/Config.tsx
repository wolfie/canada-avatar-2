import React from "react";
import MicInput from "./MicInput";
import styled from "styled-components";

const PRECISION = 1000;

const StyledInput = styled.input`
  width: 80vw;
`;

const CodePreWrapper = styled.pre`
  background-color: black;
  color: #d2ffd9;
`;

const ConfigWrapper = styled.div`
  padding: 20px;

  & > pre {
    margin-left: -20px;
    margin-right: -20px;
    padding: 20px;
  }
`;

const Button = styled.button`
  padding: 0.5em 1em;
  border-radius: 4px;
  margin-top: 1em;
`;

type InputProps = {
  label: string;
  onChange: (value: number) => void;
  value: number;
};
const Input: React.FC<InputProps> = ({ label, onChange, value }) => (
  <div>
    <label>
      {label}
      <StyledInput
        type="range"
        min={0}
        max={PRECISION}
        step={1}
        value={value * PRECISION}
        onChange={(e) => onChange(parseInt(e.currentTarget.value) / PRECISION)}
      />
    </label>
  </div>
);

type ConfigProps = {
  hasAskedForUserMedia: boolean;
  mouthPosition: number;
  onMouthPositionChange: (value: number) => void;
  nosePosition: { x: number; y: number };
  onNosePositionChange: (val: { x: number; y: number }) => void;
  selectedMicDeviceId: string | undefined;
  onMicDeviceIdChange: (deviceId: string) => void;
};
const Config: React.FC<ConfigProps> = ({
  hasAskedForUserMedia,
  mouthPosition,
  onMouthPositionChange,
  nosePosition,
  onNosePositionChange,
  selectedMicDeviceId,
  onMicDeviceIdChange,
}) => (
  <ConfigWrapper>
    <MicInput
      hasAskedForUserMedia={hasAskedForUserMedia}
      onMicDeviceIdChange={onMicDeviceIdChange}
      selectedMicDeviceId={selectedMicDeviceId}
    />
    <Input
      label="Mouth position"
      onChange={onMouthPositionChange}
      value={mouthPosition}
    />
    <Input
      label="Nose X"
      onChange={(x) => onNosePositionChange({ ...nosePosition, x })}
      value={nosePosition.x}
    />
    <Input
      label="Nose Y"
      onChange={(y) => onNosePositionChange({ ...nosePosition, y })}
      value={nosePosition.y}
    />

    <Button onClick={() => (window.location.hash = "#done")}>DONE</Button>

    <CodePreWrapper>
      <code>
        {`const [mouthPosition, setMouthPosition] = React.useState(${mouthPosition});\n` +
          `const [nosePosition, setNosePosition] = React.useState(${JSON.stringify(
            nosePosition
          )});`}
      </code>
    </CodePreWrapper>
  </ConfigWrapper>
);

export default Config;

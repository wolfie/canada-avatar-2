import React from "react";
import MicInput from "./MicInput";
import styled from "styled-components";

const PRECISION = 1000;

const StyledInput = styled.input`
  width: 80vw;
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
};
const Config: React.FC<ConfigProps> = ({
  hasAskedForUserMedia,
  mouthPosition,
  onMouthPositionChange,
  nosePosition,
  onNosePositionChange,
}) => (
  <>
    <a href="#done">Done!</a>
    <MicInput hasAskedForUserMedia={hasAskedForUserMedia} />
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
  </>
);

export default Config;

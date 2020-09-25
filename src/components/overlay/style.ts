import { css, keyframes, SerializedStyles } from '@emotion/core';

const animationDuration = '0.3s';

const animationMacro = (keyFrames: SerializedStyles) => css`-webkit-animation: ${keyFrames} ${animationDuration} ease-in-out;
  -moz-animation: ${keyFrames} ${animationDuration} ease-in-out;
  -o-animation: ${keyFrames} ${animationDuration} ease-in-out;
  animation: ${keyFrames} ${animationDuration} ease-in-out;
  ` ;

export const container = css`
  display:none;
  background-color: black;
  opacity: 70%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  width: 100%;
  height: 100%;
`;

const overlayFadeIn = keyframes`
  from { opacity: 0.001 }
  to { opacity: 0.7 }
`;

const overlayFadeOut = keyframes`
  from { opacity: 0.7 }
  to { opacity: 0 }
`;

export const show = css`
  display: block;
  ${animationMacro(overlayFadeIn)}
`;

export const hide = css`
  ${animationMacro(overlayFadeOut)}
  display: none;
`;

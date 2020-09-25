/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { container, show, hide } from './style';
import { typeOverlay } from '../../types'

const OverLay = (param: typeOverlay) => (
  <div
    data-testid="dt-overlay"
    css={
      [
        container,
        css`${param.visible ? show : hide}`
      ]
    }
  />
);

export default OverLay;

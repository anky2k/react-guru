/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { useRef, useEffect, FunctionComponent } from 'react';
import useCoachMarks from '../../hooks/use-coachmarks'
import Button from '../button'
import { typeElemDim, typeCoachMark } from '../../types'

const toolTipSize = {
  width: 150,
  height: 40
};

const tooltip = css`      
    position: absolute;
    z-index: 101;
    max-width: 300;
    overflow: hidden;
    transform:translateY(-50%);
    padding:0.8em;
    border-radius:5px;
    background:#fff;
    color: #000;
    text-align:center;
    flex-flow: column;
    gap: 8px;
    display:none; /* hide by default */
  }  
`;

const toolTipButtons = css`
    display: flex;
    flex-flow: row;
    justify-content: center;
    gap: 8px;
`;

function moveToBottomRightOfElement(left: number, top: number, bottom: number, right: number, elementBeingCoached: HTMLElement): typeElemDim {
  const newTop = (top >= 0 ? top + toolTipSize.height : top + toolTipSize.height + Math.abs(top) + 5);
  const newLeft = left + elementBeingCoached.offsetWidth + 20;
  return {
    left: newLeft,
    top: newTop,
    bottom,
    right
  };
}

function moveToBottomLeftOfElement(left: number, top: number, bottom: number, right: number, elementBeingCoached: HTMLElement): typeElemDim {
  const newTop = (top >= 0 ? top + toolTipSize.height : top + toolTipSize.height + Math.abs(top) + 5);
  const newLeft = left - toolTipSize.width - elementBeingCoached.offsetWidth;
  return {
    left: newLeft,
    top: newTop,
    bottom,
    right
  };
}

function moveToTopLeftOfElement(left: number, top: number, bottom: number, right: number, elementBeingCoached: HTMLElement): typeElemDim {
  const newTop = top - toolTipSize.height - 20;
  const newLeft = left - toolTipSize.width - elementBeingCoached.offsetWidth;
  return {
    left: newLeft,
    top: newTop,
    bottom,
    right
  };
}

function moveToTopRightOfElement(left: number, top: number, bottom: number, right: number, elementBeingCoached: HTMLElement): typeElemDim {
  const newTop = top - toolTipSize.height - 20;
  const newLeft = left - toolTipSize.width - elementBeingCoached.offsetWidth;
  return {
    left: newLeft,
    top: newTop,
    bottom,
    right
  };
}

function edgeDetection(left: number, top: number, bottom: number, right: number, elementBeingCoached: HTMLElement): typeElemDim {
  const pageDimensions = {
    width: document.body.clientWidth,
    height: document.body.clientHeight
  };

  // top left edge
  if (top < toolTipSize.height && left <= toolTipSize.width) {
    return moveToBottomRightOfElement(left, top, bottom, right, elementBeingCoached);
  }

  // top right edge
  if (top < toolTipSize.height && left + toolTipSize.width >= pageDimensions.width) {
    return moveToBottomLeftOfElement(left, top, bottom, right, elementBeingCoached);
  }

  // bottom left edge
  if (top + toolTipSize.height >= pageDimensions.height && left <= toolTipSize.width) {
    return moveToTopRightOfElement(left, top, bottom, right, elementBeingCoached);
  }

  // bottom right edge
  if (top + toolTipSize.height >= pageDimensions.height && left + toolTipSize.width >= pageDimensions.width) {
    return moveToTopLeftOfElement(left, top, bottom, right, elementBeingCoached);
  }

  return {
    left,
    top,
    bottom,
    right
  };
}

function placeToolTip(el: HTMLElement | null, tooltip: HTMLElement | null) {
  //get the position of the placeholder element
  const elementBeingCoached = el?.children[0] as HTMLElement;
  const elemDimensions = elementBeingCoached.getBoundingClientRect();
  const pos = {
    top: elemDimensions.top + window.pageYOffset,
    right: elemDimensions.right + window.pageXOffset,
    bottom: elemDimensions.bottom + window.pageYOffset,
    left: elemDimensions.left + window.pageXOffset
  };

  const toolTipLeft = pos.left;
  const toolTipTop = pos.top - toolTipSize.height - 10;
  const toolTipBottom = pos.bottom;
  const toolTipRight = pos.right;

  const { left, top } = edgeDetection(toolTipLeft, toolTipTop, toolTipBottom, toolTipRight, elementBeingCoached);
  if (tooltip) {
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
    tooltip.style.position = 'absolute';
  }
}

const CoachMark: FunctionComponent<typeCoachMark> = ({ seqId, msg, uri = '', children }) => {
  const seqRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const { set, next, finish } = useCoachMarks();

  useEffect(() => {
    set(tooltipRef.current, seqRef.current, uri);
    placeToolTip(seqRef.current, tooltipRef.current);
  }, []);

  return (
    <div>
      <div ref={tooltipRef} css={tooltip} data-seqid={seqId} >
        <div>
          {msg}
        </div>
        <div css={toolTipButtons}>
          <Button
            type="outlined"
            size="small"
            label="skip"
            onClick={finish}
          />
          <Button
            type="contained"
            size="small"
            label="next"
            onClick={next}
          />
        </div>
      </div>
      <div ref={seqRef}>
        {children}
      </div>
    </div >
  );
};

export default CoachMark;

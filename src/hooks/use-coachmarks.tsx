import React, { createContext, useContext, FunctionComponent, useRef } from 'react';
import { typePage, typeMark, typeMarkMeta } from '../types'
import useOverLay from './use-overlay';

const trimLastChar = (str: string): string => (str.substring(0, str.length - 1))

const setCss = (elem: HTMLElement, cssRules: Object): void => {
  let styles: string = ''
  Object.entries(cssRules).forEach(entry => {
    const styleProp = entry[0];
    const propValue = entry[1];
    styles = `${styleProp}:${propValue};${styles}`
  });
  elem.setAttribute('style', trimLastChar(styles))
};

const push = (coachMarks: Array<typePage>, toolTipRef: HTMLElement | null, elemRef: HTMLElement | null, uri: string) => {
  const coachMark: typeMark = {
    toolTipRef,
    elemRef,
    seqId: ((toolTipRef && toolTipRef.getAttribute('data-seqid')) || '0')
  };

  const key: string = uri || window.location.pathname;

  const page: typePage = {
    'lastVisited': 0,
    'count': coachMarks.length + 1,
    'uri': key,
    'marks': []
  };

  // via insertion sort basis seqid
  if (coachMarks.length === 0) {
    page.marks.push(coachMark);
    coachMarks.push(page);
  } else {
    coachMarks.forEach(mark => {
      if (mark.uri === key) {
        mark.marks.push(coachMark);
      }
    });
  }
};

const CoachMarkContext = createContext({
  play: (): void => { },
  set: (tooltipRef: HTMLElement | null, elemRef: HTMLElement | null, uri: string): void => {
    console.log(tooltipRef, elemRef, uri);
  },
  next: (): void => { },
  finish: (): void => { }
});

export const CoachMarkProvider: FunctionComponent = ({ children }) => {
  const coachMarks = useRef<Array<typePage>>([]);

  const { show: showOverLay, hide: hideOverLay } = useOverLay();

  const getMarkersForPage = (path?: string): Array<typeMark> => {
    const uri = path || window.location.pathname;
    const entry = coachMarks.current.filter(item => item.uri === uri)[0];
    return entry?.marks || []
  };

  const getMarkersMetaForPage = (path?: string): typeMarkMeta => {
    const uri = path || window.location.pathname;
    const entry = coachMarks.current.filter(item => item.uri === uri)[0];
    const { lastVisited, count } = entry;
    return {
      lastVisited,
      count
    };
  };

  const set = (tooltipRef: HTMLElement | null, elemRef: HTMLElement | null, uri: string): void => {
    push(coachMarks.current, tooltipRef, elemRef, uri)
  }

  const getNextMark = (): number => {
    const { lastVisited } = getMarkersMetaForPage();
    return lastVisited;
  };

  const updateLastActive = () => {
    coachMarks.current.forEach(item => {
      if (item.uri === window.location.pathname) {
        item.lastVisited = item.lastVisited + 1;
      }
    });
  };

  const highlightElement = (idx: number) => {
    const markers = getMarkersForPage();
    const el = markers[idx] && markers[idx]['elemRef'] && markers[idx]['elemRef'];
    const elementBeingCoached = el?.children[0];
    const elemDimension = elementBeingCoached?.getBoundingClientRect();
    const parentOfEl = el?.children[0]?.parentElement;
    const styles = {
      'z-index': 100,
      'background': 'white',
      'position': 'relative',
      'transition': 'all .4s ease-in-out',
      'border-radius': '3px',
      'padding': '2px',
      'width': `${elemDimension?.width}px`,
      'height': `${elemDimension?.height}px`
    };
    if (parentOfEl) {
      setCss(parentOfEl, styles);
    }
    updateLastActive();
  };

  const resetPrevElem = (idx: number) => {
    const markers = getMarkersForPage();
    const el = markers[idx] && markers[idx]['elemRef'] && markers[idx]['elemRef'];
    const elementBeingCoached = el?.children[0]?.parentElement;
    const styles = {
      'z-index': 0,
      'background': '',
      'position': '',
      'transition': '',
      'border-radius': '0px',
      'padding': '0px',
      'width': '',
      'height': ''
    };
    if (elementBeingCoached) {
      setCss(elementBeingCoached, styles);
    }
  };

  const showToolTip = (marker: typeMark) => {
    if (marker['toolTipRef'])
      marker['toolTipRef'].style.display = 'flex';
  };

  const hideToolTip = (marker: typeMark) => {
    if (marker['toolTipRef'])
      marker['toolTipRef'].style.display = 'none';
  };

  const play = (uri?: string): void => {
    const markers = getMarkersForPage(uri);
    showOverLay();
    highlightElement(0);
    markers[0] && showToolTip(markers[0]);
  };

  const clearMarkers = (uri?: string) => {
    let itemIndex = 0;
    coachMarks.current.some((item, index) => {
      if (item.uri === uri) {
        itemIndex = index;
        return true;
      }
      return false
    });
    coachMarks.current.splice(itemIndex, 1);
  };

  const resetAllCoachedElements = (uri?: string) => {
    const markers = getMarkersForPage(uri);
    markers.forEach(el => {
      const elemRef = el.elemRef;
      const elementBeingCoached = elemRef?.children[0]?.parentElement;
      if (elementBeingCoached) {
        elementBeingCoached.style.zIndex = '';
        elementBeingCoached.style.background = '';
        elementBeingCoached.style.position = '';
      }
    });
  };

  const finish = (uri?: string): void => {
    const key = uri || window.location.pathname;
    const markers = getMarkersForPage(key);
    markers.forEach(item => {
      if (item.toolTipRef)
        item.toolTipRef.style.display = 'none'
    });
    hideOverLay();
    resetAllCoachedElements(key);
    clearMarkers(key);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  };

  const next = (): void => {
    const markers = getMarkersForPage();
    const { lastVisited } = getMarkersMetaForPage();
    const index = getNextMark();
    const prev = index - 1;

    markers[prev] && hideToolTip(markers[prev]);
    resetPrevElem(prev);

    if (lastVisited === markers.length) {
      // mark seen here
      finish();
      return;
    }

    markers[index] && showToolTip(markers[index]);

    const toolTip = markers[index]['toolTipRef']
    const toolTipLocation = toolTip?.getBoundingClientRect()
    if (toolTipLocation) {
      const { top, left } = toolTipLocation
      if (toolTipLocation) {
        window.scrollTo({
          top,
          left,
          behavior: 'smooth'
        })
      }
    }
    highlightElement(index);
  };

  return (
    <CoachMarkContext.Provider value={{ play, set, next, finish }}>
      {children}
    </CoachMarkContext.Provider>
  );
};

export default () => useContext(CoachMarkContext);

import 'react-app-polyfill/ie11';
import React, { useEffect } from 'react';
import * as ReactDOM from 'react-dom';
import { CoachMarkProvider, CoachMark, useCoachMarks, OverLayProvider } from '../src';

const TestComp = () => {
  const { play, finish } = useCoachMarks();

  useEffect(() => {
    const key = window.location.pathname;
    play(key);
    return () => finish(key);
  }, []);

  return (
    <CoachMark seqId='1' msg="this is an element">
      <div style={{
        height: '50px',
        width: '80px'
      }}>
        {'Element 1'}
      </div>
    </CoachMark>
  )
}

const App = () => {
  return (
    <div>
      <OverLayProvider>
        <CoachMarkProvider>
          <TestComp />
        </CoachMarkProvider>
      </OverLayProvider>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

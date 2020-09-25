import React, {
  createContext, useContext, useState, FunctionComponent
} from 'react';
import OverLay from '../components/overlay';
import { typeOverlay } from '../types'

const OverLayContext = createContext({
  hide: () => { },
  show: () => { }
});

export const OverLayProvider: FunctionComponent = ({ children }) => {
  const [state, setState] = useState<typeOverlay>({
    visible: false
  });


  const show = () => {
    setState({
      visible: true
    });
  };

  const hide = () => {
    setState({
      visible: false
    });
  };

  return (
    <OverLayContext.Provider value={{ show, hide }}>
      {children}
      <OverLay visible={state.visible} />
    </OverLayContext.Provider>
  );
};

export default () => useContext(OverLayContext);

import React from 'react';

import { IconStyle } from './assets/iconfont/iconfont'
import { GlobalStyle } from './style.js'

function App () {
  return (
    <div className="App">
      <GlobalStyle></GlobalStyle>
      <IconStyle></IconStyle>
      <i className="iconfont">&#xe653;</i>
    </div>
  );
}

export default App;

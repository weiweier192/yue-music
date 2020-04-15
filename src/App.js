import React from 'react';

import { IconStyle } from './assets/iconfont/iconfont'
import { GlobalStyle } from './style.js'

import {renderRoutes} from 'react-router-config'
import routes from './routes/index.js'
import {HashRouter} from 'react-router-dom'

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

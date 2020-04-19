import React from 'react';
import { Provider } from 'react-redux'

import store from './store/index.js'

import { IconStyle } from './assets/iconfont/iconfont'
import { GlobalStyle } from './style.js'

import { renderRoutes } from 'react-router-config'
import routes from './routes/index.js'
import { HashRouter } from 'react-router-dom'
import {Data} from './application/Singers/data.js'

function App () {
  return (
    <Provider store={store}>
      <HashRouter>
        <div className="App">
          <GlobalStyle></GlobalStyle>
          <IconStyle></IconStyle>
          <Data>
            {renderRoutes(routes)}
          </Data>
        </div>
      </HashRouter>
    </Provider>
  )
}

export default App;

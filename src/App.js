import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
//import { Provider } from 'react-redux';
//import store from './store/index.js'

import { Home } from './components/Home'

class App extends Component {
  render() {
    return (
      //<Provider store={store}>
          <BrowserRouter>
            <Route path='' exact component={Home}/>
          </BrowserRouter>
      //</Provider>
    )
  }
}

export default App;
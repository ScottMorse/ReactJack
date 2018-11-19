import React from 'react'
import { createStore, combineReducers } from 'redux'
import reducers from '../reducers/reducers.js'

const store = createStore(
    combineReducers({
        state: reducers
    }),
    window.__REDUX_DEVTOOLS_EXTENSIONS__ && window.__REDUX_DEVTOOLS_EXTENSIONS__()
)

export default store
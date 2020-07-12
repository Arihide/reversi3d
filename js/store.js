import { applyMiddleware, createStore, compose } from "redux"

import reducer from "./reducers"

const middleware = []

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(
    reducer,
    composeEnhancers(applyMiddleware(...middleware))
)

export default store

import { appReducer } from './reducers'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'

const consoleMessages = store => next => action => {
  let result

  console.groupCollapsed(`dispatching action => ${action ? action.type : ''}`)
  console.log(action.payload)
  result = next(action)
  console.log(result)
  // let { allSkiDays, goal, errors, resortNames } = store.getState()

  // console.log(`

  // 	ski days: ${allSkiDays.length}
  // 	goal: ${goal}
  // 	fetching: ${resortNames.fetching}
  // 	suggestions: ${resortNames.suggestions}
  // 	errors: ${errors.length}

  // `)

  console.groupEnd()

  return result
}

const crashReporter = store => next => action => {
  try {
    return next(action)
  } catch (err) {
    console.error('Caught an exception!', err)
    window.Raven.captureException(err, {
      extra: {
        action,
        state: store.getState()
      }
    })
    throw err
  }
}

export default (initialState = {}) => {
  return applyMiddleware(thunk, consoleMessages, crashReporter)(createStore)(
    appReducer,
    initialState
  )
}

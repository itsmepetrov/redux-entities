import isFunction from 'lodash.isfunction'
import mapValues from 'lodash.mapvalues'
import merge from 'lodash.merge'
import get from 'lodash.get'

const getEntities = (action, name) => get(action, `payload.entities.${name}`)

export const actionless = (state = {}) => state

export function entitiesReducer(reducer, entityName) {
  return (state, action) => {
    const entities = isFunction(entityName) ? entityName(action) : getEntities(action, entityName)
    const nextState = entities ? merge({}, state, entities) : state
    return reducer(nextState, action)
  }
}

export function combineEntitiesReducers(reducers) {
  return (state = {}, action) => mapValues(
    mapValues(reducers, entitiesReducer),
    (reducer, key) => reducer(state[key], action)
  )
}

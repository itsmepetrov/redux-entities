import isFunction from 'lodash/isFunction'
import mapValues from 'lodash/mapValues'
import get from 'lodash/get'

function selectEntities(action, name) {
  const entities = get(action, `payload.entities.${name}`)
  if (entities) {
    return entities;
  }
}

export function entitiesReducer(reducer, entitiesName) {
  return (state, action) => {
    let newState = state;
    const entities = isFunction(entitiesName) ?
      entitiesName(action) : selectEntities(action, entitiesName);

    if (entities) {
        newState = Object.assign({}, newState, entities);
    }

    return reducer(newState, action);
  };
}

export function combineEntitiesReducers(reducers) {
  const entitiesReducers = mapValues(reducers, entitiesReducer);
  return (state = {}, action) => mapValues(
    entitiesReducers,
    (reducer, key) => reducer(state[key], action)
  );
}

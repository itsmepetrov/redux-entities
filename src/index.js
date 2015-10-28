import isFunction from 'lodash/lang/isFunction';
import mapValues from 'lodash/object/mapValues';

function selectEntities(action, name) {
    if (action.payload && action.payload.entities && action.payload.entities[name]) {
        return action.payload.entities[name];
    }
}

export function entitiesReducer(reducer, entitiesName) {
    return (state, action) => {
        let newState = state;
        const entities = isFunction(entitiesName) ? entitiesName(action) : selectEntities(action, entitiesName);

        if (entities) {
            newState = Object.assign({}, newState, entities);
        }

        return reducer(newState, action);
    };
}

export function combineEntitiesReducers(reducers) {
    const entitiesReducers = mapValues(reducers, entitiesReducer);
    return (state = {}, action) => mapValues(entitiesReducers,
        (reducer, key) => reducer(state[key], action)
    );
}

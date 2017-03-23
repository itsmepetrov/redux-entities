# Redux Entities

[![build status](https://img.shields.io/travis/itsmepetrov/redux-entities/master.svg?style=flat-square)](https://travis-ci.org/itsmepetrov/redux-entities)
[![npm version](https://img.shields.io/npm/v/redux-entities.svg?style=flat-square)](https://www.npmjs.com/package/redux-entities)

Higher-order reducer for store entities received from [normalizr](https://github.com/paularmstrong/normalizr) and makes it easy to handle them.

### Installation

```
npm install --save redux-entities
```

## Usage

### Use with `entitiesReducer`

```js
import { combineReducers } from 'redux';
import { entitiesReducer } from 'redux-entities';
import { merge, omit } from 'lodash';

function contacts(state = {}, action) {
  const { type, payload } = action;

  switch (type) {

  case UPDATE_CONTACT:
  case REMOVE_CONTACT:
    return merge({}, state, { [payload.id]: {
      ...state[payload.id],
      isPending: true
    }});

  case UPDATE_CONTACT_SUCCESS:
    return merge({}, state, { [payload.id]: {
      ...state[payload.id],
      isPending: false
    }});

  case REMOVE_CONTACT_SUCCESS:
    return omit(state, meta.id);

  default:
    return state;
  }
}

export default combineReducers({
  contacts: entitiesReducer(contacts, 'contacts')
});

```

### Use with `combineEntitiesReducers`

```js
import { combineEntitiesReducers } from 'redux-entities';
import { contacts, groups, images, notes } from './entities';

export default combineEntitiesReducers({
  contacts,
  groups,
  images,
  notes
});

```

## Immutable

If you want to use `Immutable` with `Redux` please check out this version of the library: [redux-entities-immutable](https://github.com/beautyfree/redux-entities-immutable)



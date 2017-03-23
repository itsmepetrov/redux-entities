/* eslint-env mocha */
import { expect } from 'chai';
import { merge } from 'lodash';
import { entitiesReducer, combineEntitiesReducers, actionless } from '../src';

describe('redux-entities', () => {
  const normalizedObject = {
    entities: {
      contacts: {
        1: {
          id: 1,
          name: 'Anton'
        },
        2: {
          id: 2,
          name: 'Sergey'
        }
      },
      notes: {
        10: {
          id: 10,
          title: 'Run tests'
        },
        20: {
          id: 20,
          title: 'Run lint'
        }
      }
    }
  }

  const normalizedObjectWithNewFields = {
    entities: {
      contacts: {
        1: {
          id: 1,
          phone: '54321'
        },
        2: {
          id: 2,
          phone: '12345'
        }
      },
    }
  }

  const fillEntitiesAction = {
    type: 'FILL_ENTITIES',
    payload: normalizedObject
  }

  const fillEntitiesNestedAction = {
    type: 'FILL_ENTITIES',
    payload: {
      nested: normalizedObject
    }
  }

  const fillEntitiesWithNewFieldsAction = {
    type: 'FILL_ENTITIES',
    payload: {
      nested: normalizedObjectWithNewFields
    }
  }

  const updateContactAction = {
    type: 'UPDATE_CONTACT',
    payload: {
      id: 1,
      name: 'Andrey'
    }
  }

  const contactsReducer = (state = {}) => state;
  const notesReducer = (state = {}) => state;
  const contactsWithUpdateReducer = (state = {}, action) => {
    const { type, payload } = action;
    if (type === 'UPDATE_CONTACT') {
      const { id, ...rest } = payload
      return {
        ...state,
        [id]: {
          ...state[id],
          ...rest
        }
      }
    }
    return state
  }

  describe('entitiesReducer', () => {
    it('should return named entities object', () => {
      const reducer = entitiesReducer(
        contactsReducer,
        'contacts'
      )

      const state = reducer({}, fillEntitiesAction)

      expect(state).to.deep.equal(normalizedObject.entities.contacts)
    })

    it('can extract entities by custom path', () => {
      const reducer = entitiesReducer(
        contactsReducer,
        (action) => action.payload.nested.entities.contacts
      )

      const state = reducer({}, fillEntitiesNestedAction)

      expect(state).to.deep.equal(normalizedObject.entities.contacts)
    })

    it('can merge entities fields', () => {
      const reducer = entitiesReducer(
        contactsReducer,
        (action) => action.payload.nested.entities.contacts
      )

      const state = reducer({}, fillEntitiesNestedAction)
      const updatedState = reducer(state, fillEntitiesWithNewFieldsAction)

      expect(updatedState).to.deep.equal(
        merge({}, normalizedObject, normalizedObjectWithNewFields).entities.contacts
      )
    })

    it('can update specific entitie', () => {
      const reducer = entitiesReducer(
        contactsWithUpdateReducer,
        'contacts'
      )

      const state = reducer({}, fillEntitiesAction)
      const updatedState = reducer(state, updateContactAction)

      expect(updatedState[1]).to.deep.equal({ id: 1, name: 'Andrey' })
    })
  })

  describe('combineEntitiesReducers', () => {
    it('should return entities object', () => {
      const reducer = combineEntitiesReducers({
        contacts: contactsReducer,
        notes: notesReducer,
      })

      const state = reducer({}, fillEntitiesAction)

      expect(state).to.deep.equal(normalizedObject.entities)
    })

    it('can update specific entitie', () => {
      const reducer = combineEntitiesReducers({
        contacts: contactsWithUpdateReducer,
        notes: notesReducer,
      })

      const state = reducer({}, fillEntitiesAction)
      const updatedState = reducer(state, updateContactAction)

      expect(updatedState.contacts[1]).to.deep.equal({ id: 1, name: 'Andrey' })
    })
  })

  describe('actionless', () => {
    it('should return empty object', () => {
      const state = actionless()

      expect(state).to.deep.equal({})
    })

    it('should return passed object', () => {
      const state = actionless(normalizedObject.entities.contacts)

      expect(state).to.deep.equal(normalizedObject.entities.contacts)
    })
  })
})

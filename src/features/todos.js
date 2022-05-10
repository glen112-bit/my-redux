import { combineReducers } from 'redux'
import {
    makeFetchingReducer,
    makeSetReducer,
    reduceReducers,
    makeCrudReducer,
} from './utils'

export const setPending = () => ({ type: 'todos/pending' })

export const setFulfilled = (payload) => ({ type: 'todos/fulfilled', payload })

export const setError = (e) => ({ type: 'todos/rejected', error: e.message })

export const setComplete = (payload) => ({ type: 'todos/complete', payload })

export const setFilter = (payload) => ({ type: 'filter/set', payload })

export const setAdd = (payload) => ({ type: 'todo/add', payload })

export const fetchThunk = () => async (dispatch) => {
    // console.log('soy un thunk', dispatch)
    dispatch(setPending())
    try {
        const response = await fetch(
            'https://jsonplaceholder.typicode.com/todos'
        )
        const data = await response.json()
        // console.log(data)
        const todos = data.slice(0, 10)
        dispatch(setFulfilled(todos))
    } catch (e) {
        dispatch(setError())
    }
}

export const filterReducer = makeSetReducer(['filter/set'])

export const fetchingReducer = makeFetchingReducer([
    'todos/pending',
    'todos/fulfilled',
    'todos/rejected',
])

const fulfilledReducer = makeSetReducer(['todos/fulfilled'])
const crudReducer = makeCrudReducer(['todo/add', 'todo/complete'])

export const todosReducer = reduceReducers(crudReducer, fulfilledReducer)
// => {
// switch (action.type) {
// case 'todos/fulfilled': {
// return action.payload
// }
// default:
// return state
// }
// }

export const reducer = combineReducers({
    entities: combineReducers({
        entities: todosReducer,
        status: fetchingReducer,
    }),
    filter: filterReducer,
})

export const selectTodos = (state) => {
    const {
        todos: { entities },
        filter,
    } = state
    // console.log(entities, filter)
    if (filter === 'complete') {
        return entities.filter((todo) => todo.completed)
    }
    if (filter === 'incomplete') {
        return entities.filter((todo) => !todo.completed)
    }
    return entities
}

export const selectStatus = (state) => state.todos.status

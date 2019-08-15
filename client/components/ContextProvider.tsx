import * as React from 'react';
import uuid from 'uuid/v4';
import { ContextState } from 'client/types';

const StateContext = React.createContext<ContextState | undefined>(undefined);
const DispatchContext = React.createContext<any>(undefined);

function reducer(state: ContextState, action: any) {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            id: uuid(),
            type: action.messageType,
            content: action.content,
            time: action.time,
          },
        ],
      };
    case 'REMOVE_MESSAGE':
      return {
        ...state,
        messages: state.messages.filter(m => m.id !== action.id),
      };
    case 'SET_MODAL':
      return {
        ...state,
        modal: action.modal,
      };
    case 'LOAD_USER':
      return {
        ...state,
        currentUser: action.user,
      };
    case 'CLEAR_USER':
      return {
        ...state,
        currentUser: null,
      };
    default:
      return state;
  }
}

const initialState = {
  messages: [],
  modal: null,
  currentUser: null,
};

export function ContextProvider({ children }: { children: React.ReactChild }) {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export function useCtxState() {
  const context = React.useContext(StateContext);

  if (context === undefined) {
    throw new Error('useState must be used within a ContextProvider');
  }

  return context;
}

export function useCtxDispatch() {
  const context = React.useContext(DispatchContext);

  if (context === undefined) {
    throw new Error('useDispatch must be used within a ContextProvider');
  }

  return context;
}

export function useContext() {
  return [useCtxState(), useCtxDispatch()];
}

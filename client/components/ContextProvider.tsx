import * as React from 'react';
import { ContextState } from 'client/types';

const StateContext = React.createContext<ContextState | undefined>(undefined);
const DispatchContext = React.createContext<any>(undefined);

function reducer(state: ContextState, action: any) {
  switch (action.type) {
    case 'SET_MESSAGE':
      return {
        ...state,
        message: {
          type: action.type,
          content: action.content,
        },
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
    default:
      return state;
  }
}

const initialState = {
  message: null,
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
    throw new Error('useDispatch must be used within a CountProvider');
  }

  return context;
}

export function useContext() {
  return [useCtxState(), useCtxDispatch()];
}

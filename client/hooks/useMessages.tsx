import * as React from 'react';
import { useCtxDispatch } from 'client/components/ContextProvider';

export default function useMessages({ length }: { length: number }) {
  const dispatch = useCtxDispatch();

  const showConfirm = React.useCallback((content: string) => {
    dispatch({
      type: 'ADD_MESSAGE',
      messageType: 'confirm',
      time: length,
      content,
    });
  }, []);

  const showError = React.useCallback((content: string) => {
    dispatch({
      type: 'ADD_MESSAGE',
      messageType: 'error',
      time: length,
      content: content.replace(/^GraphQL error: /, ''),
    });
  }, []);

  const showInfo = React.useCallback((content: string) => {
    dispatch({
      type: 'ADD_MESSAGE',
      messageType: 'info',
      time: length,
      content,
    });
  }, []);

  return { showConfirm, showError, showInfo };
}

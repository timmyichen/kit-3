import * as React from 'react';
import { ModalProps, Modal } from 'semantic-ui-react';
import { useCtxDispatch } from './ContextProvider';

export default function CtxModal({ children, ...props }: ModalProps) {
  const dispatch = useCtxDispatch();

  const onClose = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    data: ModalProps,
  ) => {
    if (props.onClose) {
      props.onClose(e, data);
    }

    closeModal(dispatch);
  };

  return (
    <Modal open closeIcon {...props} onClose={onClose}>
      {children}
    </Modal>
  );
}

export function closeModal(dispatch: (action: any) => void) {
  dispatch({
    type: 'SET_MODAL',
    modal: null,
  });
}

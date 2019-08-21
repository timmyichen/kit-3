import * as React from 'react';
import { useCtxState, useCtxDispatch } from './ContextProvider';
import { Message as MessageType } from 'client/types';
import { Message } from 'semantic-ui-react';

function MessageRoll() {
  const { messages } = useCtxState();
  const dispatch = useCtxDispatch();
  const [loadedMessageIds, setLoadedMessageIds] = React.useState<Array<string>>(
    messages.map(m => m.id),
  );

  const dismissMessage = (id: string) => {
    dispatch({
      type: 'REMOVE_MESSAGE',
      id,
    });

    setLoadedMessageIds(loadedMessageIds.filter(m => m !== id));
  };

  React.useEffect(() => {
    const lastMessage = messages[messages.length - 1];

    if (!lastMessage || loadedMessageIds.includes(lastMessage.id)) {
      return;
    }

    setTimeout(() => dismissMessage(lastMessage.id), lastMessage.time);
  }, [messages]);

  return (
    <div className="message-roll-wrapper">
      {messages.map(msg => (
        <Msg
          msg={msg}
          key={`msg-${msg.id}`}
          onDismiss={() => dismissMessage(msg.id)}
        />
      ))}
      <style jsx>{`
        .message-roll-wrapper {
          position: fixed;
          top: 80px;
          right: 20px;
          z-index: 999;
        }
        .message-roll-wrapper :global(.ui.message) {
          z-index: 999;
        }
        .message-roll-wrapper :global(.ui.message > p) {
          margin-top: 0px !important;
          margin-right: 15px;
        }
      `}</style>
    </div>
  );
}

export default MessageRoll;

function Msg({
  msg,
  onDismiss,
}: {
  msg: MessageType;
  onDismiss: (id: string) => void;
}) {
  const { type, content } = msg;
  let color: 'red' | 'green' | 'blue';

  switch (type) {
    case 'confirm':
      color = 'green';
      break;
    case 'error':
      color = 'red';
      break;
    default:
      color = 'blue';
  }

  return (
    <Message color={color} onDismiss={() => onDismiss(msg.id)}>
      <p>{content}</p>
    </Message>
  );
}

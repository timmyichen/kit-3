import { CurrentUser } from 'client/types';
import { useCtxDispatch } from './ContextProvider';

export default ({ user }: { user: CurrentUser }) => {
  const dispatch = useCtxDispatch();

  dispatch({
    type: 'LOAD_USER',
    user: user,
  });

  return null;
};

import { User } from 'client/types';
import { useCtxDispatch } from './ContextProvider';

export default ({ user }: { user: User }) => {
  const dispatch = useCtxDispatch();
  dispatch({
    type: 'LOAD_USER',
    user: user,
  });

  return null;
};

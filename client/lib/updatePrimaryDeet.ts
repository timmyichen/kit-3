import { DataProxy } from 'apollo-cache';
import {
  CurrentUserDeetsDocument,
  CurrentUserDeetsQuery,
} from 'generated/generated-types';
import cloneDeep from 'lodash/cloneDeep';

type MutationName =
  | 'upsertAddress'
  | 'upsertPhoneNumber'
  | 'upsertEmailAddress';

const query = { query: CurrentUserDeetsDocument };

export default (cache: DataProxy, data: any, mutationName: MutationName) => {
  let q: CurrentUserDeetsQuery | null = null;
  try {
    q = cache.readQuery(query);
  } catch (e) {
    console.error(e);
    return;
  }

  if (q) {
    const copy = cloneDeep(q);
    const response = data[mutationName];

    const targetId = copy.userDeets.findIndex(d => d.id === response.id);

    if (targetId < 0) {
      return;
    }

    copy.userDeets = copy.userDeets.map(d => ({
      ...d,
      isPrimary: false,
    }));
    copy.userDeets[targetId].isPrimary = true;

    cache.writeQuery({
      ...query,
      data: copy,
    });
  }
};

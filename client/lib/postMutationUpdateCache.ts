import { DataProxy } from 'apollo-cache';
import cloneDeep from 'lodash/cloneDeep';

function postMutationUpdateCache<QueryType, ObjectType>({
  cache,
  query,
  fieldName,
  isPaginated,
  type,
  targetObj,
}: {
  cache: DataProxy;
  query: DataProxy.Query<any>;
  fieldName: string;
  isPaginated?: boolean;
  type: 'unshift' | 'remove' | 'replace';
  targetObj: ObjectType;
}) {
  let q: QueryType | null = null;
  try {
    q = cache.readQuery(query);
  } catch (e) {
    console.error(e);
    return;
  }

  if (q) {
    if (!(fieldName in q)) {
      return console.error(`Cannot find ${fieldName} in ${JSON.stringify(q)}`);
    }
    const copy = cloneDeep(q);
    let arr: Array<ObjectType>;
    if (isPaginated) {
      arr = (copy as any)[fieldName].items;
    } else {
      arr = (copy as any)[fieldName];
    }

    switch (type) {
      case 'unshift':
        arr.unshift(targetObj);
        break;
      case 'remove':
        const removeIndex = arr.findIndex(o => {
          // @ts-ignore
          return o.id === targetObj.id;
        });
        arr.splice(removeIndex, 1);
        break;
      case 'replace':
        // @ts-ignore
        const i = arr.findIndex(e => e.id === targetObj.id);
        arr[i] = targetObj;
        break;
    }

    if (isPaginated) {
      (copy as any)[fieldName].items = arr;
    } else {
      (copy as any)[fieldName] = arr;
    }
    cache.writeQuery({
      ...query,
      data: copy,
    });
  }
}

export default postMutationUpdateCache;

import * as express from 'express';
import { Op } from 'sequelize';
const DataLoader = require('dataloader');

export type ReqWithLoader = express.Request & {
  loader(
    m: any,
  ): {
    loadBy(key: string, value: any, scope?: Scope): typeof DataLoader;
    loadManyBy(key: string, value: any, scope?: Scope): typeof DataLoader;
  };
};

interface Scope {
  [s: string]: any;
}

interface Options {
  key: string;
  many?: boolean;
  model: any;
  scope?: Scope;
}

const genLoaderKey = ({ key, many, model, scope }: Options) => {
  let loaderKey = `${model.getTableName()}:${key}`;
  if (many) {
    loaderKey += ':many';
  }
  if (scope && Object.keys(scope).length) {
    loaderKey += Object.keys(scope)
      .sort()
      .reduce((arr: Array<string>, k) => {
        arr.push(`${k}=${scope[k]}`);
        return arr;
      }, [])
      .join(':');
  }

  return loaderKey;
};

export const loader = () => {
  const loaders: { [k: string]: typeof DataLoader } = {};

  const getLoader = ({ key, many, model, scope }: Options) => {
    let loaderKey = genLoaderKey({ key, many, model, scope });

    if (loaders[loaderKey]) {
      return loaders[loaderKey];
    }

    const loader = new DataLoader(async (keys: Array<any>) => {
      console.log(scope);
      const where = {
        ...scope,
        [key]: { [Op.in]: keys },
      };

      const models = await model.findAll({ where });

      const modelsMap = models.reduce(
        (obj: { [k: string]: any }, item: any) => {
          const modelKey = item[key];

          if (many) {
            obj[modelKey] = obj[modelKey] || [];
            obj[modelKey].push(item);
          } else {
            obj[modelKey] = item;
          }

          return obj;
        },
        {},
      );

      return keys.map(k => modelsMap[k]);
    });

    loaders[loaderKey] = loader;

    return loader;
  };

  return (model: any) => ({
    loadBy: (key: string, value: any, scope: Scope = {}) =>
      getLoader({ model, key, scope }).load(value),
    loadManyBy: (key: string, value: any, scope: Scope = {}) =>
      getLoader({ model, key, many: true, scope }).load(value),
  });
};

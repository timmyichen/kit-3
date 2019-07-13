export const isBrowser = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

export const splitColumns = (arr: Array<React.ReactNode>, cols: number) => {
  const columns: Array<Array<React.ReactNode>> = [];

  for (let i = 0; i < arr.length; i++) {
    if (!columns[i % cols]) {
      columns[i % cols] = [];
    }

    const item = arr[i];
    columns[i % cols].push(item);
  }

  return columns;
};

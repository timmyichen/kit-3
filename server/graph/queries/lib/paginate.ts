export default async function paginate({
  model,
  where,
  count,
}: {
  model: any;
  where: any;
  count: number;
}) {
  const results = await model.findAll({
    where,
    order: [['updated_at', 'desc']],
    limit: count + 1,
  });

  const hasNext = results.length === count + 1;
  const nextCursor = hasNext ? results[results.length - 1].updated_at : null;

  return {
    items: results.slice(0, count),
    pageInfo: {
      hasNext,
      nextCursor,
    },
  };
}

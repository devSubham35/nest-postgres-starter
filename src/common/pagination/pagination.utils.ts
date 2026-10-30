export async function paginate<T>(
  query: {
    skip(value: number): {
      limit(value: number): {
        exec(): Promise<T[]>;
      };
    };
  },
  countQuery: {
    exec(): Promise<number>;
  },
  page: number,
  limit: number,
) {
  const skip = (page - 1) * limit;

  const [results, total] = await Promise.all([
    query.skip(skip).limit(limit).exec(),
    countQuery.exec(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: {
      results,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
      },
    },
  };
}
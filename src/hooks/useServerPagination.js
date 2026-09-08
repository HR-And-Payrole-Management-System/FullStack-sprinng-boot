import { useEffect, useState, useCallback } from 'react';

// Wraps the fetch-on-page-or-filter-change pattern used across
// EmployeeList / AttendanceList into one reusable hook.
//
// fetchFn(params) must return a PageResponse-shaped object:
// { content, page, totalPages, totalElements }
export function useServerPagination(fetchFn, params, deps = []) {
  const [pageData, setPageData] = useState({
    content: [],
    page: 0,
    totalPages: 0,
    totalElements: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchFn(params)
      .then(setPageData)
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    load();
  }, [load]);

  return { pageData, loading, error, reload: load };
}
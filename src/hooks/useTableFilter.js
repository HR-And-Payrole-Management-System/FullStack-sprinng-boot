import { useMemo, useState } from 'react';

// Generic client-side search + multi-select filter for small lists
// that don't have server pagination (Company, Branch, Department...).
//
// matchFn(item, search) decides whether an item matches the free-text search.
// filterFns is a map of { filterKey: (item, filterValue) => boolean }.
export function useTableFilter(items, { matchFn, filterFns = {} } = {}) {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({});

  const setFilter = (key, value) => setFilters((f) => ({ ...f, [key]: value }));

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return items.filter((item) => {
      if (q && matchFn && !matchFn(item, q)) return false;

      for (const [key, value] of Object.entries(filters)) {
        if (!value || value === 'All') continue;
        const fn = filterFns[key];
        if (fn && !fn(item, value)) return false;
      }

      return true;
    });
  }, [items, search, filters, matchFn, filterFns]);

  return { search, setSearch, filters, setFilter, filtered };
}
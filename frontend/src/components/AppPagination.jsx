import { Pagination } from 'react-bootstrap';

// Shows at most `maxButtons` page numbers around the current page,
// instead of one button per page (which breaks once totalPages is large).
function AppPagination({ page, totalPages, onChange, maxButtons = 5 }) {
  if (totalPages <= 1) return null;

  const half = Math.floor(maxButtons / 2);
  let start = Math.max(0, page - half);
  let end = Math.min(totalPages - 1, start + maxButtons - 1);
  start = Math.max(0, end - maxButtons + 1);

  const pages = [];
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <Pagination className="justify-content-end mb-0">
      <Pagination.First disabled={page === 0} onClick={() => onChange(0)} />
      <Pagination.Prev disabled={page === 0} onClick={() => onChange(page - 1)} />

      {start > 0 && <Pagination.Ellipsis disabled />}
      {pages.map((i) => (
        <Pagination.Item key={i} active={i === page} onClick={() => onChange(i)}>
          {i + 1}
        </Pagination.Item>
      ))}
      {end < totalPages - 1 && <Pagination.Ellipsis disabled />}

      <Pagination.Next disabled={page >= totalPages - 1} onClick={() => onChange(page + 1)} />
      <Pagination.Last disabled={page >= totalPages - 1} onClick={() => onChange(totalPages - 1)} />
    </Pagination>
  );
}

export default AppPagination;
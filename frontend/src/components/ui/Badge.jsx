export default function Badge({ children, dot }) {
  return (
    <span className="badge-pill inline-flex items-center gap-1.5">
      {dot && <span className="w-2 h-2 rounded-full bg-(--color-primary)" />}
      {children}
    </span>
  );
}
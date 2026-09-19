export default function Button({ children, icon: Icon, variant = "primary", ...props }) {
  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    dark: "btn-dark",
    outline: "btn-outline",
  };
  const base = variants[variant] || "btn-secondary";
  return (
    <button className={`${base} inline-flex items-center gap-2`} {...props}>
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
}
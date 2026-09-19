function Footer() {
  return (
    <footer
      className="ent-footer text-center py-3 small"
      style={{
        borderTop: '1px solid var(--color-border)',
        color: 'var(--color-text-subtle)',
        background: 'var(--color-surface)',
      }}
    >
      © {new Date().getFullYear()} HRMS. All rights reserved.
    </footer>
  );
}

export default Footer;
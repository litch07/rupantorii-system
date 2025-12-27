export default function Button({ children, variant = "primary", className = "", ...props }) {
  const styles =
    variant === "outline"
      ? "btn-outline"
      : "btn-primary";

  return (
    <button className={`${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}

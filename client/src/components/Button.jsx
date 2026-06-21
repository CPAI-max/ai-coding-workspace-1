export default function Button({ children, className = "", variant = "primary", ...props }) {
  const variants = {
    primary: "bg-ink text-white hover:bg-black",
    secondary: "border border-line bg-white text-ink hover:border-ink",
    ghost: "text-ink hover:bg-black/5",
    danger: "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
  };

  return (
    <button
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

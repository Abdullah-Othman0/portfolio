type Props = { name: string; className?: string; filled?: boolean };

export function Icon({ name, className, filled }: Props) {
  return (
    <span
      className={`material-symbols-outlined ${className ?? ""}`}
      style={filled ? { fontVariationSettings: '"FILL" 1' } : undefined}
      aria-hidden
    >
      {name}
    </span>
  );
}

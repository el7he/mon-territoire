
interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  label?: string;
}

export function Spinner({ size = "md", label = "Chargement en cours..." }: SpinnerProps) {

  const dimensions = size === "sm" ? 24 : size === "lg" ? 56 : 36;

  return (
    <div
      className="fr-py-4w"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
      role="status"
    >
      {/* Cercle SVG animé autonome */}
      <svg
        width={dimensions}
        height={dimensions}
        viewBox="0 0 48 48"
        style={{
          animation: "spin-dsfr 1s linear infinite",
          display: "block",
        }}
        aria-hidden="true"
      >
        <circle
          cx="24"
          cy="24"
          r="18"
          stroke="#000091"
          strokeWidth="4"
          fill="none"
          strokeDasharray="80 35"
        />
      </svg>

      <style>{`
        @keyframes spin-dsfr {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {label && <p className="fr-text--sm fr-mt-2w fr-mb-0">{label}</p>}
    </div>
  );
}
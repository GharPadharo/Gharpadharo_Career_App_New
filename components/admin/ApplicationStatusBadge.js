/**
 * ApplicationStatusBadge Component
 * 
 * Simplified, accessible status badge for job applications:
 * - new: subtle brand purple treatment with attention-grabbing dot (unread)
 * - viewed: subtle neutral gray treatment with soft dot (opened/read)
 * 
 * Never relies solely on color; always includes clear text labels.
 */
export default function ApplicationStatusBadge({ status = "new", className = "" }) {
  const isNew = (status || "new").toLowerCase() === "new";

  const config = isNew
    ? {
        label: "New",
        bg: "bg-[#525599]/10 text-primary border-[#525599]/25 font-bold shadow-2xs",
        dot: "bg-primary animate-pulse",
      }
    : {
        label: "Viewed",
        bg: "bg-slate-100 text-slate-600 border-slate-200 font-medium",
        dot: "bg-slate-400",
      };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs border ${config.bg} ${className} whitespace-nowrap`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  );
}

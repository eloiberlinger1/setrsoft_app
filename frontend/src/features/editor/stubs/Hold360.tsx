// Stub placeholder until a real 3D hold-preview widget is implemented.
export default function Hold360({
  cdn_ref: _cdn_ref,
  hold: _hold,
  className,
  setCurrentDownloadUrl: _setCurrentDownloadUrl,
}: {
  cdn_ref?: string;
  hold?: unknown;
  className?: string;
  setCurrentDownloadUrl?: (url: string) => void;
}) {
  return (
    <div
      className={`flex items-center justify-center bg-surface-low text-on-surface-variant text-xs rounded ${className ?? ''}`}
      style={{ minHeight: 80 }}
    >
      3D preview
    </div>
  );
}

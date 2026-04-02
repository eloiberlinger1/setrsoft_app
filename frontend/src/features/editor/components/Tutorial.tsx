import { useState } from "react";

const controls = [
  { key: "Clic gauche", action: "Tourner la vue" },
  { key: "Clic droit / Ctrl + Clic", action: "Déplacer latéralement (pan)" },
  { key: "Molette", action: "Zoomer / Dézoomer" },
  { key: "Double clic", action: "Centrer le modèle" },
];

function Tutorial() {
  const [show, setShow] = useState(false);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      {show && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-surface-high/90 backdrop-blur-md border border-ghost-border/20 p-4 min-w-[260px] max-w-[320px]">
          <div className="flex items-center mb-3 gap-2">
            <span className="material-symbols-outlined text-mint text-base">help_outline</span>
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Contrôles 3D</span>
            <button
              onClick={() => setShow(false)}
              className="ml-auto p-1 text-on-surface-variant hover:text-on-surface transition-colors"
              aria-label="Fermer l'aide"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <ul className="space-y-2">
            {controls.map((ctrl, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="text-xs font-bold text-on-surface min-w-[95px]">{ctrl.key}:</span>
                <span className="text-xs text-on-surface-variant">{ctrl.action}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-surface-high/80 backdrop-blur-md p-1 rounded-full border border-ghost-border/10 flex items-center gap-1">
        <button className="p-2 text-on-surface-variant hover:text-on-surface transition-colors" title="Caméra">
          <span className="material-symbols-outlined text-xl">videocam</span>
        </button>
        <button className="p-2 text-on-surface-variant hover:text-on-surface transition-colors" title="Éclairage">
          <span className="material-symbols-outlined text-xl">lightbulb</span>
        </button>
        <button className="p-2 text-on-surface-variant hover:text-on-surface transition-colors" title="Calques">
          <span className="material-symbols-outlined text-xl">layers</span>
        </button>
        <div className="w-px h-6 bg-ghost-border/20 mx-1"></div>
        <button
          onClick={() => setShow((v) => !v)}
          className={`p-2 transition-colors ${show ? "text-mint" : "text-on-surface-variant hover:text-on-surface"}`}
          title="Aide sur les contrôles 3D"
          aria-label="Aide sur les contrôles 3D"
        >
          <span className="material-symbols-outlined text-xl">help_outline</span>
        </button>
      </div>
    </div>
  );
}

export default Tutorial;

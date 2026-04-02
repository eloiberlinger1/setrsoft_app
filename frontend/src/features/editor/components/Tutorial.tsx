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
    <>
      {/* Bulle flottante */}
      <div
        style={{
          position: "fixed",
          bottom: "36px",
          left: "32px",
          zIndex: 9999,
        }}
      >
        <button
          onClick={() => setShow((v) => !v)}
          className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl shadow-lg hover:bg-blue-700 transition"
          aria-label="Aide sur les contrôles 3D"
        >
          ?
        </button>
      </div>

      {/* Fenêtre d'aide */}
      {show && (
        <div
          style={{
            position: "fixed",
            bottom: "92px",
            left: "32px",
            background: "white",
            borderRadius: "16px",
            boxShadow: "0 6px 32px rgba(0,0,0,0.18)",
            padding: "24px",
            minWidth: "260px",
            maxWidth: "320px",
            zIndex: 9999,
          }}
        >
          <div className="flex items-center mb-3">
            <span className="text-blue-600 text-2xl font-bold mr-2">?</span>
            <span className="font-semibold text-gray-900">Contrôles 3D</span>
            <button
              onClick={() => setShow(false)}
              className="ml-auto px-2 py-1 text-sm text-gray-500 hover:text-red-500"
              aria-label="Fermer l'aide"
            >
              ✕
            </button>
          </div>
          <ul className="space-y-2 text-sm">
            {controls.map((ctrl, idx) => (
              <li key={idx} className="flex">
                <span className="font-semibold min-w-[95px]">{ctrl.key}: </span>
                <span className="ml-2 text-gray-700">{ctrl.action}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default Tutorial;
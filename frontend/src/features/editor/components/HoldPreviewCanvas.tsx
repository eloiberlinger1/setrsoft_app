import { Canvas } from "@react-three/fiber";
import { View } from "@react-three/drei";

/**
 * Single shared WebGL canvas for all Hold360 previews in the editor.
 * Renders as a fixed full-screen overlay (pointer-events: none) so it
 * composites over any UI without blocking interaction.
 *
 * Each Hold360 registers a <View> div; this canvas renders them all
 * via scissor testing — only the pixels inside each View are drawn.
 */
export default function HoldPreviewCanvas() {
  return (
    <Canvas
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 9999,
      }}
      gl={{
        alpha: true,
        antialias: false,
        powerPreference: "low-power",
      }}
      eventSource={document.body}
    >
      <View.Port />
    </Canvas>
  );
}

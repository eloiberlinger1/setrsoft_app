import { useEffect, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { posthog } from "@/shared/analytics/posthog";

import useWallSessionQuery from "./utils/WallSessionQuery";
import { usePlacementStore } from "./store";
import { useHandleLoadSession } from "./utils/HandleLoadSession";

import MainCanvas from "./components/MainCanvas";
import Sidebar from "./components/Sidebar";
import HoldInspector from "./components/HoldInspector";
import FileManager from "./components/FileManager";
import { useTranslation } from "react-i18next";
import Tutorial from "./components/Tutorial";

interface HoldInstance {
  id: string;
  hold_instance_id?: string;
  hold_type?: {
    glb_url?: string;
  };
  [key: string]: unknown;
}

const tools = [
  { id: "select", icon: "near_me", label: "Select", fill: true },
  { id: "translate", icon: "open_with", label: "Translate" },
  { id: "rotate", icon: "sync", label: "Rotate" },
  { id: "scale", icon: "aspect_ratio", label: "Scale" },
];

const viewTools = [
  { id: "orbit", icon: "3d_rotation", label: "View Orbit" },
  { id: "grid", icon: "grid_4x4", label: "Grid Toggle" },
];

function EditorApp() {
  const { wallId } = useParams<{ wallId: string }>();
  const { fetchWallSession } = useWallSessionQuery();
  const { t } = useTranslation();
  const [wallModels, setWallModels] = useState<string[]>([]);
  const [activeTool, setActiveTool] = useState("select");

  const setObjects = usePlacementStore((s) => s.setObjects);
  const setWallColors = usePlacementStore((s) => s.setWallColors);
  const setHoldColors = usePlacementStore((s) => s.setHoldColors);
  const setColoredTexture = usePlacementStore((s) => s.setColoredTexture);
  const setHasUnsavedChanges = usePlacementStore((s) => s.setHasUnsavedChanges);
  const hasUnsavedChanges = usePlacementStore((s) => s.hasUnsavedChanges);

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["wallsession", wallId],
    queryFn: () => fetchWallSession(wallId as string),
    enabled: !!wallId,
  });

  const session_data = data?.wall_session || data;
  const { handleLoad } = useHandleLoadSession(session_data);
  const sessionOpenedRef = useRef(false);

  useEffect(() => {
    if (wallId) {
      setObjects([]);
      setWallColors({});
      setHoldColors({});
      setColoredTexture(true);
      setHasUnsavedChanges(false);
    }
  }, [wallId, setObjects, setWallColors, setHoldColors, setColoredTexture, setHasUnsavedChanges]);

  useEffect(() => {
    if (session_data?.id && wallModels.length > 0) {
      handleLoad();
      if (!sessionOpenedRef.current) {
        sessionOpenedRef.current = true;
        posthog.capture('editor session opened', { wall_id: wallId, session_id: session_data.id });
      }
    }
  }, [session_data?.id, wallModels.length, handleLoad]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
        return t("You have unsaved changes. Are you sure you want to leave?");
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges, t]);

  const holdModels: Array<Record<string, HoldInstance>> = [];
  const holdModelsGLBURL: string[] = [];

  useEffect(() => {
    const glbUrl = session_data?.related_wall?.glb_url;
    setWallModels(glbUrl ? [glbUrl] : []);
  }, [session_data?.related_wall?.glb_url]);

  if (session_data?.related_holds_collection) {
    session_data.holds_collection_instances?.forEach((hold: any) => {
      hold.hold_instance_id = hold.id;
      holdModels.push(hold);
      if (hold.hold_type?.glb_url) {
        holdModelsGLBURL.push(hold.hold_type.glb_url);
      }
    });
  }

  const { preload } = useGLTF;
  useEffect(() => {
    [...wallModels, ...holdModelsGLBURL].forEach((url) => {
      preload(url);
    });
  }, [preload, wallModels, holdModelsGLBURL]);

  useEffect(() => {
    const handleGlobalPreload = (event: CustomEvent) => {
      const { glbUrl } = event.detail;
      if (glbUrl) preload(glbUrl);
    };
    window.addEventListener("preloadGLB", handleGlobalPreload as EventListener);
    return () =>
      window.removeEventListener("preloadGLB", handleGlobalPreload as EventListener);
  }, [preload]);

  if (isLoading) return <div className="flex h-screen w-screen bg-surface items-center justify-center text-on-surface-variant">{t("Loading wall session")}...</div>;
  if (isError)
    return (
      <div className="flex h-screen w-screen bg-surface items-center justify-center text-on-surface-variant">
        {t("Error loading wall session:", { error: (error as Error).message })}
      </div>
    );

  return (
    <div className="flex flex-col h-screen w-screen bg-surface overflow-hidden">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-surface/60 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] h-16 flex-shrink-0">
        <div className="flex justify-between items-center w-full px-8 h-full max-w-full">
          <div className="flex items-center gap-8">
            <span className="text-xl font-black tracking-tighter text-on-surface">SetRsoft</span>
            <div className="hidden md:flex items-center gap-6">
              <span className="font-bold tracking-tight uppercase text-sm text-mint border-b-2 border-mint pb-1 cursor-default">
                Editor
              </span>
              <span className="font-bold tracking-tight uppercase text-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer">
                Database
              </span>
              <span className="font-bold tracking-tight uppercase text-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer">
                Inventory
              </span>
              <span className="font-bold tracking-tight uppercase text-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer">
                Docs
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <FileManager session_data={session_data} />
          </div>
        </div>
      </nav>

      {/* Main Workspace */}
      <main className="flex flex-1 pt-16 h-screen overflow-hidden">
        {/* Left Toolbar */}
        <aside className="w-16 bg-surface-lowest flex flex-col items-center py-4 gap-4 z-30 flex-shrink-0">
          <div className="flex flex-col gap-2">
            {tools.map((tool, i) => (
              <>
                {i === 1 && (
                  <div key="sep" className="h-px w-6 bg-ghost-border/20 self-center my-1" />
                )}
                <button
                  key={tool.id}
                  title={tool.label}
                  onClick={() => setActiveTool(tool.id)}
                  className={`w-10 h-10 flex items-center justify-center transition-all active:scale-95 ${
                    activeTool === tool.id
                      ? "bg-surface-high text-mint rounded-lg"
                      : "text-on-surface-variant hover:bg-surface-low"
                  }`}
                >
                  <span
                    className="material-symbols-outlined"
                    style={activeTool === tool.id && tool.fill ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {tool.icon}
                  </span>
                </button>
              </>
            ))}
          </div>
          <div className="mt-auto flex flex-col gap-2">
            {viewTools.map((tool) => (
              <button
                key={tool.id}
                title={tool.label}
                className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:bg-surface-low transition-all"
              >
                <span className="material-symbols-outlined">{tool.icon}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Central Viewport */}
        <section className="flex-1 relative bg-surface viewport-grid overflow-hidden">
          <MainCanvas wallModels={wallModels} />
          <HoldInspector />
          <Tutorial />
        </section>

        {/* Right Sidebar */}
        <aside className="w-80 bg-surface-low flex flex-col z-30 flex-shrink-0">
          <Sidebar
            wallModels={wallModels}
            holdModels={holdModels}
            session_data={session_data}
          />
        </aside>
      </main>
    </div>
  );
}

export default EditorApp;

import { useEditorAuth } from "../mocks/useEditorAuth";

const MOCK_SESSION = {
  id: null,
  related_wall: null,
  related_holds_collection: false,
  holds_collection_instances: [],
  gym: { id: "1" },
};

export default function useWallSessionQuery() {
  const { authenticatedFetch } = useEditorAuth();
  const API_URL = import.meta.env.VITE_API_BASE;

  const fetchWallSession = async (wallId: string) => {
    const url = `${API_URL}/gym/wallsession/${wallId}/`;
    try {
      const response = await authenticatedFetch(url);
      if (!response.ok) {
        console.warn("[WallSession] Response not OK, using MOCK_SESSION");
        return { ...MOCK_SESSION, wall_id: wallId };
      }
      const data = await response.json();
      return data;
    } catch (err) {
      console.error("[WallSession] Fetch failed:", err);
      return { ...MOCK_SESSION, wall_id: wallId };
    }
  };

  return { fetchWallSession };
}

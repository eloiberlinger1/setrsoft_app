import { useEditorAuth } from "../mocks/useEditorAuth";

export default function useHoldsStockQuery() {
  const { authenticatedFetch } = useEditorAuth();
  const API_URL = import.meta.env.VITE_API_BASE;

  const fetchHoldsStock = async ({
    gymId,
    page = 1,
    pageSize = 100,
    sorting = "all",
    state,
    color,
    manufacturer,
  }: {
    gymId: string;
    page?: number;
    pageSize?: number;
    sorting?: string;
    state?: string;
    color?: string;
    manufacturer?: string;
  }) => {
    try {
      const url = new URL(`${API_URL}/gym/stock-explore/${gymId}/`);
      url.searchParams.set("page", String(page));
      url.searchParams.set("page_size", String(pageSize));
      url.searchParams.set("sorting", sorting);
      if (state) url.searchParams.set("state", state);
      if (color) url.searchParams.set("color", color);
      if (manufacturer) url.searchParams.set("manufacturer", manufacturer);

      const response = await authenticatedFetch(url.toString());
      if (!response.ok) return [];
      const data = await response.json();
      return data.stock ?? [];
    } catch {
      return [];
    }
  };

  return { fetchHoldsStock };
}

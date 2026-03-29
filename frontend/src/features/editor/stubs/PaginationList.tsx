// Stub placeholder — no pagination UI yet.
export default function PaginationList({
  holds_number: _holds_number,
  currentPage: _currentPage,
  setCurrentPage: _setCurrentPage,
  children,
}: {
  holds_number?: number;
  currentPage?: number;
  setCurrentPage?: (page: number) => void;
  children?: React.ReactNode;
}) {
  return <>{children}</>;
}

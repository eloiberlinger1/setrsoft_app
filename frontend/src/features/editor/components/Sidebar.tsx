import SidebarHoldsSection from "./SidebarHoldsSection";
import AddHoldModal from "./AddHoldModal";
import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";

type HoldModel = {
  name: string;
  file: string;
  hold_type: Record<string, any>;
  hold_instance_id: string;
  id?: string;
};

const Sidebar = ({
  wallModels: _wallModels,
  holdModels,
  session_data,
}: {
  wallModels: string[];
  holdModels: Array<Record<string, any>>;
  session_data: any;
}) => {
  const { t } = useTranslation();

  const processedHoldModels: HoldModel[] = holdModels.map((hold) => ({
    name: hold.hold_type.manufacturer_ref,
    file: hold.hold_type.cdn_ref,
    hold_type: hold.hold_type,
    hold_instance_id: hold.id,
    id: hold.id,
  }));

  const holdsSectionRef = useRef<{
    addHold: (hold: HoldModel) => void;
    getCurrentHolds: () => HoldModel[];
  }>(null);

  const [addHoldModalOpen, setAddHoldModalOpen] = useState(false);

  const handleHoldAddedFromModal = (newHold: HoldModel) => {
    if (holdsSectionRef.current) {
      holdsSectionRef.current.addHold(newHold);
    }
  };

  return (
    <div className="bg-white border-r border-gray-200 h-full flex flex-col shadow-sm">
      <div className="px-6 py-4 border-b border-gray-100">
        <h1 className="text-lg font-semibold text-gray-900">
          {t("SetRsoft Creator Studio")}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {t("Click on a hold and drag it to the left")}
        </p>

        <AddHoldModal
          isOpen={addHoldModalOpen}
          onClose={() => setAddHoldModalOpen(false)}
          session_data={session_data}
          onHoldAdded={handleHoldAddedFromModal}
          currentHolds={
            holdsSectionRef.current?.getCurrentHolds() || processedHoldModels
          }
        />

        <div className="flex gap-2 mt-4">
          <button
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
            onClick={() => setAddHoldModalOpen(true)}
          >
            {t("Add holds to quick access")}
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-6 space-y-8">
          <SidebarHoldsSection
            holdModels={processedHoldModels}
            session_data={session_data}
            ref={holdsSectionRef}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

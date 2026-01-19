import React from "react";
import RightDrawer from "../RightDrawer";
import ServiceSearch from "./components/ServiceSearch";

function Ai({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <RightDrawer open={open} onClose={onClose} title="AI Service Assistant">
      <ServiceSearch />
    </RightDrawer>
  );
}

export default Ai;

"use client";

import React from "react";
import MainLayout from "@/app/mainLayout";
import MyDocumentsView from "@/components/pages/myDocuments";

function MyDocuments() {
  return (
    <MainLayout>
      <MyDocumentsView />
    </MainLayout>
  );
}

export default MyDocuments;
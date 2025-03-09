import  { useState } from 'react';
import api from "@/api";
import TableUI from "@/components/table/TableUI";
import { t } from "i18next";
import { columns } from "./columns";
import FormHeader from "@/components/common/FormHeader";

const subTab = ["pending", "completed", "cancelled"];

const PurchasesView = () => {
  const [tab, setTab] = useState("pending");

  // Fetch data based on the selected tab
  const { data, isFetching, isRefetching, refetch } = api.purchaseItem.getPurchases.useQuery(tab, {
    queryKey: ["getPurchases", tab], // Ensure queryKey is provided
    enabled: true, // Always enabled for the default tab
  });

  const handleTabClick = (status:any) => {
    setTab(status); // Update the tab state
  };

  return (
    <section className="m-4">
      <FormHeader
        title={t("title.purchasing-transactions")}
        onRefresh={() => refetch()}
        isLoading={isFetching || isRefetching}
      />
      <div className="p-6 bg-white rounded-b-lg">
        <div className="flex space-x-4 mb-4">
          {subTab.map((status) => (
            <button
              key={status}
              onClick={() => handleTabClick(status)}
              className={`px-4 py-2 rounded ${
                tab === status
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {t(`fields.supplier-management.subTab.${status}`)}
            </button>
          ))}
        </div>
        <TableUI
          data={data || []} // Fallback to empty array if data is undefined
          columns={columns}
          loading={isFetching}
          header={t("title.purchasing-transactions")}
          columnVisibility={{ created_at: false }}
          filterColumns={["firstName"]}
          sortColumn="created_at"
          newCreate="/supplier-management/purchasehistories/supplierlist"
          excelExport={true}
          fileName={'PurchaseTransactions'}
          exportedData={data || []} // Fallback to empty array if data is undefined
        />
      </div>
    </section>
  );
};

export default PurchasesView;
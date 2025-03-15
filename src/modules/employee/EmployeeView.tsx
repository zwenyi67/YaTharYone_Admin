import api from "@/api";
import TableUI from "@/components/table/TableUI";
import { t } from "i18next";
import { columns } from "./columns";
import FormHeader from "@/components/common/FormHeader";
import { useState } from "react";

const subTab = [
  {
    id: 1,
    name: "waiter",
  },
  {
    id: 2,
    name: "chef",
  },
  {
    id: 3,
    name: "cashier",
  },
];

const EmployeeView = () => {
  const [tab, setTab] = useState(1); // Default tab is Waiter (id: 1)

  // Fetch data based on the selected tab
  const { data, isFetching, isRefetching, refetch } = api.employee.getEmployees.useQuery(tab, {
    queryKey: ["getEmployees", tab], // Dynamic queryKey
    enabled: true, // Always enabled for the default tab
  });

  const handleTabClick = (id: number) => {
    setTab(id); // Update the tab state
  };

  console.log("Rendering EmployeeView with tab:", tab);

  return (
    <section className="m-4">
      <FormHeader
        title={t("title.employee-management")}
        onRefresh={() => refetch()}
        isLoading={isFetching || isRefetching}
      />
      <div className="p-6 bg-white rounded-lg">
        <div className="flex space-x-4 mb-4">
          {subTab.map((status) => (
            <button
              key={status.id}
              onClick={() => handleTabClick(status.id)}
              className={`px-4 py-2 rounded ${tab === status.id
                  ? "bg-secondary text-white"
                  : "bg-gray-200 text-gray-700"
                }`}
            >
              {t(`fields.employee-management.subTab.${status.name}`)}
            </button>
          ))}
        </div>
        <TableUI
          data={data || []} // Fallback to empty array if data is undefined
          columns={columns}
          loading={isFetching}
          header={t("title.employee-management")}
          columnVisibility={{ created_at: false }}
          filterColumns={["firstName"]}
          sortColumn="created_at"
          newCreate="/employee-management/create"
          excelExport={true}
          fileName={"EmployeeData"}
          exportedData={data || []} // Fallback to empty array if data is undefined
        />
      </div>
    </section>
  );
};

export default EmployeeView;
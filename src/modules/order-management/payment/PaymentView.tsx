import api from "@/api"
import TableUI from "@/components/table/TableUI"
import { t } from "i18next"
import { columns } from "./columns"
import FormHeader from "@/components/common/FormHeader"
import { useState } from "react"

const subTab = ["pending", "completed", "refunded" ];

const PaymentView = () => {

	const [tab, setTab] = useState("pending");

	// Fetch data based on the selected tab
	const { data, isFetching, isRefetching, refetch } = api.order.getPayments.useQuery(tab, {
		queryKey: ["getPyaments", tab],
		enabled: true,
	  });

	const handleTabClick = (status: any) => {
		setTab(status); // Update the tab state
	};


	return (
		<section className="m-4">
			<FormHeader
				title={t("title.order-management")}
				onRefresh={() => refetch()}
				isLoading={isFetching || isRefetching}
			/>
			<div className="p-6 bg-white rounded-b-lg">
				<div className="flex space-x-4 mb-4">
					{subTab.map((status) => (
						<button
							key={status}
							onClick={() => handleTabClick(status)}
							className={`px-4 py-2 rounded ${tab === status
									? "bg-secondary text-white"
									: "bg-gray-200 text-gray-700"
								}`}
						>
							{t(`fields.supplier-management.subTab.${status}`)}
						</button>
					))}
				</div>
				<TableUI
					data={data || []}
					columns={columns}
					loading={isFetching}
					header={t("title.inventory-management")}
					columnVisibility={{ }}
					filterColumns={["name"]}
					sortColumn="created_at"
					excelExport={true}
					fileName={'EmployeeData'}
					exportedData={data || []}
				// excludedColumns={excludedColumns}
				>
				</TableUI>


			</div>
		</section>
	)
}

export default PaymentView

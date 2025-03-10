import api from "@/api"
import TableUI from "@/components/table/TableUI"
import { t } from "i18next"
import { columns } from "./columns"
import FormHeader from "@/components/common/FormHeader"

const OrderView = () => {

	const { data, isFetching, refetch, isRefetching } = api.order.getOrders.useQuery()

	return (
		<section className="m-4">
			<FormHeader
				title={t("title.order-management")}
				onRefresh={() => refetch()}
				isLoading={isFetching || isRefetching}
			/>
			<div className="p-6 bg-white rounded-b-lg">
				<TableUI
					data={data}
					columns={columns}
					loading={isFetching}
					header={t("title.inventory-management")}
					columnVisibility={{ created_at: false }}
					filterColumns={["name"]}
					sortColumn="created_at"
					excelExport={true}
					fileName={'EmployeeData'}
					exportedData={data}
				// excludedColumns={excludedColumns}
				>
				</TableUI>


			</div>
		</section>
	)
}

export default OrderView

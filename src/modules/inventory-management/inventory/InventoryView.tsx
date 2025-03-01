import api from "@/api"
import TableUI from "@/components/table/TableUI"
import { t } from "i18next"
import { columns } from "./columns"
import FormHeader from "@/components/common/FormHeader"

const InventoryView = () => {

	const { data, isFetching, refetch, isRefetching } = api.inventory.getInventories.useQuery();

	const excludedColumns = [
		"inventory_item_category",
		"item_category_id"
	];

	return (
		<section className="m-4">
			<FormHeader
				title={t("title.inventory-management")}
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
					newCreate="/inventory-management/inventories/create"
					reportTool="/inventory-management/inventories/reportTool"
					excelExport={true}
					fileName={'InventoryData'}
					exportedData={data}
					excludedColumns={excludedColumns}
				>
				</TableUI>
			</div>
		</section>
	)
}

export default InventoryView

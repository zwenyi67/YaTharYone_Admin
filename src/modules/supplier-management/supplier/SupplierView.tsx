import api from "@/api"
import TableUI from "@/components/table/TableUI"
import { t } from "i18next"
import { columns } from "./columns"
import FormHeader from "@/components/common/FormHeader"

const SupplierView = () => {

	const { data, isFetching, refetch, isRefetching } = api.supplier.getSuppliers.useQuery()

	const excludedColumns = [
		"active_flag",
		"created_at",
		"updated_at",
		"createby",
		"updateby",
	];

	return (
		<section className="m-4">
			<FormHeader
				title={t("title.supplier-management")}
				onRefresh={() => refetch()}
				isLoading={isFetching || isRefetching}
			/>
			<div className="p-6 bg-white rounded-b-lg">
				<TableUI
					data={data}
					columns={columns}
					loading={isFetching}
					header={t("title.supplier-management")}
					columnVisibility={{ created_at: false }}
					filterColumns={["name"]}
					sortColumn="created_at"
					newCreate="/supplier-management/suppliers/create"
					excelExport={true}
					fileName={'SupplierData'}
					excludedColumns={excludedColumns}
				>
				</TableUI>


			</div>
		</section>
	)
}

export default SupplierView

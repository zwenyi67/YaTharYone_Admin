import api from "@/api"
import TableUI from "@/components/table/TableUI"
import { t } from "i18next"
import { columns } from "./columns"
import FormHeader from "@/components/common/FormHeader"

const PurchasesView = () => {

	const { data, isFetching, refetch, isRefetching } = api.purchaseItem.getPurchases.useQuery('pending');

	return (
		<section className="m-4">
			<FormHeader
				title={t("title.purchasing-transactions")}
				onRefresh={() => refetch()}
				isLoading={isFetching || isRefetching}
			/>
			<div className="p-6 bg-white rounded-b-lg">
				<TableUI
					data={data}
					columns={columns}
					loading={isFetching}
					header={t("title.purchasing-transactions")}
					columnVisibility={{ created_at: false }}
					filterColumns={["firstName"]}
					sortColumn="created_at"
					newCreate="/supplier-management/purchasehistories/supplierlist"
					excelExport={true}
					fileName={'PurchaseTransactions'}
					exportedData={data}
				// excludedColumns={excludedColumns}
				>
				</TableUI>


			</div>
		</section>
	)
}

export default PurchasesView

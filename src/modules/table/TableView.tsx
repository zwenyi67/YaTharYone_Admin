import api from "@/api"
import TableUI from "@/components/table/TableUI"
import { t } from "i18next"
import { columns } from "./columns"
import FormHeader from "@/components/common/FormHeader"

const TableView = () => {

	const { data, isFetching, refetch, isRefetching } = api.table.getTables.useQuery()

	return (
		<section className="m-4">
			<FormHeader
				title={t("title.table-management")}
				onRefresh={() => refetch()}
				isLoading={isFetching || isRefetching}
			/>
			<div className="p-6 bg-white rounded-lg">

				<TableUI
					data={data}
					columns={columns}
					loading={isFetching}
					header={t("title.table-management")}
					columnVisibility={{ created_at: false }}
					filterColumns={["firstName"]}
					sortColumn="created_at"
					newCreate="/table-management/create"
					excelExport={true}
					fileName={'TableData'}
					exportedData={data}
				// excludedColumns={excludedColumns}
				>
				</TableUI>
			</div>
		</section>
	)
}

export default TableView

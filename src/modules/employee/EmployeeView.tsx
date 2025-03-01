import api from "@/api"
import TableUI from "@/components/table/TableUI"
import { t } from "i18next"
import { columns } from "./columns"
import FormHeader from "@/components/common/FormHeader"

const EmployeeView = () => {

	const { data, isFetching, refetch, isRefetching } = api.employee.getEmployees.useQuery()

	return (
		<section className="m-4">
			<FormHeader
				title={t("title.employee-management")}
				onRefresh={() => refetch()}
				isLoading={isFetching || isRefetching}
			/>
			<div className="p-6 bg-white rounded-lg">
				<TableUI
					data={data}
					columns={columns}
					loading={isFetching}
					header={t("title.employee-management")}
					columnVisibility={{ created_at: false }}
					filterColumns={["firstName"]}
					sortColumn="created_at"
					newCreate="/employee-management/create"
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

export default EmployeeView

import api from "@/api"
import TableUI from "@/components/table/TableUI"
import { t } from "i18next"
import { columns } from "./columns"
import { Link } from "react-router-dom"

const EmployeeView = () => {

	const { data, isFetching } = api.employee.getEmployees.useQuery()

	return (
		<section className="m-4">
			<div className="p-6 bg-white rounded-lg">
			<Link to={"/employee-management/create"} className="bg-secondary rounded-sm p-2 text-white mb-5">Add New Employee</Link>

				<TableUI
					data={data}
					columns={columns}
					loading={isFetching}
					header={t("title.employee-management")}
					columnVisibility={{ created_at: false }}
					filterColumns={["firstName"]}
					sortColumn="created_at"
				>
				</TableUI>


			</div>
		</section>
	)
}

export default EmployeeView

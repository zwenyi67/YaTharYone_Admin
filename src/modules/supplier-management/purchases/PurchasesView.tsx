import api from "@/api"
import TableUI from "@/components/table/TableUI"
import { t } from "i18next"
import { columns } from "./columns"
import { Link } from "react-router-dom"

const PurchasesView = () => {

	const { data, isFetching } = api.employee.getEmployees.useQuery()

	return (
		<section className="m-4">
			<div className="p-6 bg-white rounded-lg">
			<Link to={"/supplier-management/suppliers/create"} className="bg-secondary rounded-sm p-2 text-white mb-5">New Purchase</Link>

				<TableUI
					data={data}
					columns={columns}
					loading={isFetching}
					header={t("title.purchasing-transactions")}
					columnVisibility={{ created_at: false }}
					filterColumns={["firstName"]}
					sortColumn="created_at"
				>
				</TableUI>


			</div>
		</section>
	)
}

export default PurchasesView

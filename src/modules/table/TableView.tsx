import api from "@/api"
import TableUI from "@/components/table/TableUI"
import { t } from "i18next"
import { columns } from "./columns"
import { Link } from "react-router-dom"

const TableView = () => {

	const { data, isFetching } = api.table.getTables.useQuery()

	return (
		<section className="m-4">
			<div className="p-6 bg-white rounded-lg">
			<Link to={"/table/create"} className="bg-secondary rounded-sm p-2 text-white mb-5">Add New Table</Link>

				<TableUI
					data={data}
					columns={columns}
					loading={isFetching}
					header={t("title.table-management")}
					columnVisibility={{ createdAt: false }}
					filterColumns={["firstName"]}
					sortColumn="createdAt"
				>
				</TableUI>


			</div>
		</section>
	)
}

export default TableView

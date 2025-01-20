import api from "@/api"
import TableUI from "@/components/table/TableUI"
import { t } from "i18next"
import { columns } from "./columns"

const CategoryView = () => {

	const { data, isFetching } = api.inventory.getInventories.useQuery()

	return (
		<section className="m-4">
			<div className="border px-4 py-3 bg-secondary rounded-t-lg text-white font-semibold">
				{t("title.menu-category-management")}
			</div>
			<div className="p-6 bg-white rounded-lg">
				<TableUI
					data={data}
					columns={columns}
					loading={isFetching}
					header={t("title.inventory-management")}
					columnVisibility={{ created_at: false }}
					filterColumns={["name"]}
					sortColumn="created_at"
					newCreate="/inventory-management/inventories/create"
				>
				</TableUI>


			</div>
		</section>
	)
}

export default CategoryView

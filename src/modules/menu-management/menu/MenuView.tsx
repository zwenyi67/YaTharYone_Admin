import api from "@/api"
import TableUI from "@/components/table/TableUI"
import { t } from "i18next"
import { columns } from "./columns"
import FormHeader from "@/components/common/FormHeader"

const MenuView = () => {

	const { data, isFetching, refetch, isRefetching } = api.menu.getMenus.useQuery();

	const excludedColumns = [
		"profile",
		"addon_items"
	];

	return (
		<section className="m-4">
			<FormHeader
				title={t("title.menu-management")}
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
					newCreate="/menu-management/menus/create"
					excelExport={true}
					fileName={'MenuData'}
					exportedData={data}
					excludedColumns={excludedColumns}
				>
				</TableUI>


			</div>
		</section>
	)
}

export default MenuView

import api from "@/api"
import TableUI from "@/components/table/TableUI"
import { t } from "i18next"
import { columns } from "./columns"
import FormHeader from "@/components/common/FormHeader"

const CategoryView = () => {

	const { data, isFetching, refetch, isRefetching } = api.menuCategory.getMenuCategories.useQuery()

	return (
		<section className="m-4">
			<FormHeader
				title={t("title.menu-category-management")}
				onRefresh={() => refetch()}
				isLoading={isFetching || isRefetching}
			/>
			<div className="p-6 min-h-[540px] bg-white rounded-b-lg">
				<TableUI
					data={data}
					columns={columns}
					loading={isFetching}
					header={t("title.menu-management")}
					columnVisibility={{ created_at: false }}
					filterColumns={["name"]}
					sortColumn="created_at"
					newCreate="/menu-management/menu-categories/create"
					excelExport={true}
					fileName={'MenuCategory'}
					exportedData={data}
				// excludedColumns={excludedColumns}
				>
				</TableUI>
			</div>
		</section>
	)
}

export default CategoryView

import api from "@/api"
import TableUI from "@/components/table/TableUI"
import { t } from "i18next"
import { columns } from "./columns"
import FormHeader from "@/components/common/FormHeader"

const ItemCategoryView = () => {

	const { data, isFetching, refetch, isRefetching } = api.itemCategory.getItemCategories.useQuery()

	return (
		<section className="m-4">
			<FormHeader
				title={t("title.item-category-management")}
				onRefresh={() => refetch()}
				isLoading={isFetching || isRefetching}
			/>
			<div className="p-6 bg-white rounded-b-lg">
				<TableUI
					data={data}
					columns={columns}
					loading={isFetching}
					header={t("title.item-category-management")}
					columnVisibility={{ created_at: false }}
					filterColumns={["name"]}
					sortColumn="created_at"
					newCreate="/inventory-management/item-categories/create"
					excelExport={true}
					exportedData={data}
					fileName={'ItemCategoryData'}
				>
				</TableUI>


			</div>
		</section>
	)
}

export default ItemCategoryView

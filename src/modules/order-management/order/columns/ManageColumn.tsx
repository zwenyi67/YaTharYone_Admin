import { Button } from "@/components/ui/button"
import { Info } from "lucide-react"
import { useState } from "react"
import api from '@/api';
import { toast } from "@/hooks/use-toast"
import { useQueryClient } from "@tanstack/react-query"
import { GetOrdersType } from "@/api/order/types"

const ManageColumn = ({ data }: { data: GetOrdersType }) => {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isDetailOpen, setIsDetailOpen] = useState(false);
	const queryClient = useQueryClient();


	const { mutate: deleteMenu } = api.menu.deleteMenu.useMutation({
		onSuccess: () => {
			toast({
				title: "Menu Deleted successfully",
				variant: "success",
			});

			queryClient.invalidateQueries({
				queryKey: ["getmenus"],
			});
		},
		onError: (error) => {

			toast({
				title: error.message,
				variant: "destructive",
			});
		},
	});

	const handleDelete = (id: number) => {
		deleteMenu(id);
		setIsDialogOpen(false);
	};

	return (
		<div className="flex items-center justify-center">
			<Button variant={"columnIcon"} size={"icon"} onClick={() => setIsDetailOpen(true)}>
				<Info color="blue" />
			</Button>
			{/* Dialog Box */}
			{isDialogOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded-md shadow-md">
						<h2 className="text-lg font-semibold mb-4">
							Are you sure you want to delete this item?
						</h2>
						<div className="flex justify-center space-x-4">
							<Button
								variant="secondary"
								onClick={() => setIsDialogOpen(false)}
							>
								Cancel
							</Button>
							<Button variant="destructive" onClick={() => handleDelete(data.id)}>
								Confirm
							</Button>
						</div>
					</div>
				</div>
			)}

			{/* Detail Dialog Box */}
			{isDetailOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded-lg shadow-xl w-full sm:w-[60%] ">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-xl font-bold text-gray-800">
								Menu Details
							</h2>
							<button
								onClick={() => setIsDetailOpen(false)}
								className="text-gray-500 hover:text-red-500 transition-colors duration-200"
							>
								✕
							</button>
						</div>
						<div className="space-y-3 text-gray-700">
							
						</div>
						<div className="w-full mt-8">
							<table className="table-auto w-full border-collapse border border-gray-300 shadow-lg">
								<thead className="bg-gray-200 text-gray-700">
									<tr>
										<th className="px-4 py-2 border border-gray-300">No</th>
										<th className="px-4 py-2 border border-gray-300">Menu Name</th>
										<th className="px-4 py-2 border border-gray-300">Price</th>
										<th className="px-4 py-2 border border-gray-300">Quantity</th>
										<th className="px-4 py-2 border border-gray-300">Sub Total</th>
									</tr>
								</thead>
								<tbody className="text-gray-800">
									{data.order_details.map((item, index) => (
										<tr className="hover:bg-gray-100">
											<td className="px-4 py-2 text-center border border-gray-300">{index + 1}</td>
											<td className="px-4 py-2 text-center border border-gray-300">{item.menu.name}</td>
											<td className="px-4 py-2 text-center border border-gray-300">${item.menu.price}</td>
											<td className="px-4 py-2 text-center border border-gray-300">{item.quantity}</td>
											<td className="px-4 py-2 text-center border border-gray-300">${(item.menu.price*item.quantity).toFixed(2)}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						
						<div className="mt-6 flex justify-center space-x-4">
							<Button
								variant="secondary"
								className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition duration-200"
								onClick={() => setIsDetailOpen(false)}
							>
								Close
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default ManageColumn

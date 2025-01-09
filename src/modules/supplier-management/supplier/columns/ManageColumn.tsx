import { Button } from "@/components/ui/button"
import { Pencil2Icon } from "@radix-ui/react-icons"
import { GetSuppliersType } from "@/api/supplier/types"
import { Link } from "react-router-dom"
import { Info, Trash2Icon } from "lucide-react"
import { useState } from "react"
import api from '@/api';
import { toast } from "@/hooks/use-toast"
import { useQueryClient } from "@tanstack/react-query"

const ManageColumn = ({ data }: { data: GetSuppliersType }) => {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isDetailOpen, setIsDetailOpen] = useState(false);
	const queryClient = useQueryClient();


	const { mutate: deleteSupplier } = api.supplier.deleteSupplier.useMutation({
		onSuccess: () => {
			toast({
			  title: "Supplier Deleted successfully",
			  variant: "success",
			});

			queryClient.invalidateQueries({
				queryKey: ["getSuppliers"],
			  });
		  },
		  onError: (error) => {
			
			toast({
			  title: error.message,
			  variant: "destructive",
			});
		  },
	  });
	
	  const handleDelete = (id:number) => {
		deleteSupplier(id);
		setIsDialogOpen(false);
	  };

	return (
		<div className="flex items-center justify-center">
			<Button variant={"columnIcon"} size={"icon"} onClick={() => setIsDetailOpen(true)}>
				<Info color="blue" />
			</Button>
			<Button variant={"columnIcon"} size={"icon"}>
				<Link to={`/supplier-management/suppliers/${data.id}/edit`} state={{ data }}>
					<Pencil2Icon color="green" />
				</Link>
			</Button>
			<Button variant={"columnIcon"} size={"icon"} onClick={() => setIsDialogOpen(true)}>
				<Trash2Icon color="red" />
			</Button>
			{/* Dialog Box */}
			{isDialogOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded-md shadow-md">
						<h2 className="text-lg font-semibold mb-4">
							Are you sure you want to delete this supplier?
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
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded-md shadow-md">
						<h2 className="text-lg font-semibold mb-4">
							Detail
						</h2>
						<div className="flex justify-center space-x-4">
							<Button
								variant="secondary"
								onClick={() => setIsDetailOpen(false)}
							>
								Cancel
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default ManageColumn

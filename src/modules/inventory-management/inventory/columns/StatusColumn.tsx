import { Switch } from "@/components/ui/switch";
import api from "@/api";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { GetInventoriesType } from "@/api/inventory/types";

const StatusColumn = ({ data }: { data: GetInventoriesType }) => {
    const queryClient = useQueryClient();

    const { mutate: changeStatus } = api.inventory.changeStatus.useMutation({
        onSuccess: () => {
            toast({
                title: "Inventory status updated successfully",
                variant: "success",
            });

            queryClient.invalidateQueries({
                queryKey: ["getInventories"],
            });
        },
        onError: (error) => {
            toast({
                title: error.message,
                variant: "destructive",
            });
        },
    });

    const handleChange = () => {
        changeStatus(data.id);
    };

    return (
        <div className="flex items-center justify-center space-x-2">
            <Switch
                checked={data.status == 'active'}
                onCheckedChange={handleChange}
            />
        </div>
    );
};

export default StatusColumn;

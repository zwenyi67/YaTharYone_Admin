import { Button } from "../ui/button";
import { RefreshCw } from "lucide-react";

interface FormHeaderProps {
  title: string;
  onRefresh?: () => void;
  isLoading?: boolean;
}

const FormHeader = ({ title, onRefresh, isLoading }: FormHeaderProps) => {
  return (
    <div className="border px-4 py-3 bg-secondary rounded-t-lg text-white font-semibold flex justify-between items-center">
      <div>{title}</div>
      <Button
        disabled={isLoading}
        variant={"secondary"}
        onClick={onRefresh}
        className="text-xs"
      >
        <span className="text-xs">Refresh</span>
        <RefreshCw className={`h-2 w-2 ${isLoading && "animate-spin"}`} />
      </Button>
    </div>
  );
};

export default FormHeader;

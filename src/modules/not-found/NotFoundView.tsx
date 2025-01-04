import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFoundView = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-3 items-center justify-center min-h-screen">
      <p className="text-4xl font-bold">
        <i>404</i>
      </p>
      <h1>Oops!</h1>
      <p>Sorry, The page you are looking for doesn't exist.</p>
      <Button
        variant={"secondary"}
        onClick={() => {
          navigate("/");
        }}
      >
        Back to home
      </Button>
    </div>
  );
};

export default NotFoundView;

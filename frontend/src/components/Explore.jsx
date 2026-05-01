import { Compass } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

const Explore = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">

      <Compass size={60} className="text-gray-400 mb-4" />

      <h1 className="text-4xl font-bold">
        Explore Coming Soon
      </h1>

      <p className="text-gray-500 mt-2 max-w-md">
        Discovery engine under construction. New posts, trends,
        and creators will appear here.
      </p>

      <Button
        onClick={() => navigate(-1)}
        className="mt-6 rounded-2xl px-6"
      >
        Go Back
      </Button>

    </div>
  );
};

export default Explore;
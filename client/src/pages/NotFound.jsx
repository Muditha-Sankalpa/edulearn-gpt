import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import EmptyState from "../components/ui/EmptyState";

const NotFound = () => (
  <EmptyState
    icon={Compass}
    title="Page not found"
    description="The page you're looking for doesn't exist or may have moved."
    action={
      <Link to="/courses" className="bg-primary hover:bg-primary-dark text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
        Back to courses
      </Link>
    }
  />
);

export default NotFound;

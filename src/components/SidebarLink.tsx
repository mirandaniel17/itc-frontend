import { Link, useLocation } from "react-router-dom";

interface SidebarLinkProps {
  to: string;
  icon: string;
  label: string;
  onClick?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  to,
  icon,
  label,
  onClick,
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <li>
      <Link
        to={to}
        onClick={onClick}
        className={`flex items-center p-2 rounded-lg ${
          isActive
            ? "bg-sky-900 text-white"
            : "text-gray-900 dark:text-white hover:bg-sky-900 hover:text-white dark:hover:bg-gray-700"
        } group`}
      >
        <i className={`mdi ${icon}`}></i>
        <span className="ms-3 text-xs">{label}</span>
      </Link>
    </li>
  );
};

export default SidebarLink;

interface TableActionButtonsProps {
  actions: Array<{
    label: string;
    onClick: () => void;
    className: string;
  }>;
}

const TableActionButtons: React.FC<TableActionButtonsProps> = ({ actions }) => {
  return (
    <td className="flex space-x-2 my-2">
      {actions.map((action) => (
        <button
          key={action.label}
          type="button"
          onClick={action.onClick}
          className={action.className}
        >
          {action.label}
        </button>
      ))}
    </td>
  );
};

export default TableActionButtons;

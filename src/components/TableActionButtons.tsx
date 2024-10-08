interface TableActionButtonsProps {
  actions: Array<{
    label: string;
    onClick: () => void;
    className: string;
  }>;
}

const TableActionButtons: React.FC<TableActionButtonsProps> = ({ actions }) => {
  return (
    <td className="px-6 py-4">
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

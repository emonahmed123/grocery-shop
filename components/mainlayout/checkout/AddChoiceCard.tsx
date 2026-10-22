import { Plus } from "lucide-react";

type AddChoiceCardProps = {
  label: string;
};

const AddChoiceCard = ({ label }: AddChoiceCardProps) => {
  return (
    <button
      type="button"
      className="flex min-h-28 items-center gap-2 rounded-md border-2 px-10 font-semibold text-brand transition-colors hover:border-brand"
    >
      <Plus className="size-4" />
      {label}
    </button>
  );
};

export default AddChoiceCard;

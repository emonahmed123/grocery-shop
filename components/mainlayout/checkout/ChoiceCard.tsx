import { RadioGroupItem } from "@/components/ui/radio-group";

type ChoiceCardProps = {
  id: string;
  value: string;
  title: string;
  description: string;
  disabled?: boolean;
};

/** Bordered radio option used for saved addresses and phone numbers. */
const ChoiceCard = ({ id, value, title, description, disabled }: ChoiceCardProps) => {
  return (
    <label
      htmlFor={id}
      className="relative flex min-h-28 cursor-pointer flex-col rounded-md border-2 p-5 transition-colors has-focus-visible:ring-3 has-focus-visible:ring-ring/50 has-data-[state=checked]:border-brand has-disabled:cursor-not-allowed has-disabled:opacity-60"
    >
      <RadioGroupItem id={id} value={value} disabled={disabled} className="sr-only" />
      <span className="mb-2 font-semibold text-foreground">{title}</span>
      <span className="leading-6 text-muted-foreground">{description}</span>
    </label>
  );
};

export default ChoiceCard;

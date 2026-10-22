import AddChoiceCard from "@/components/mainlayout/checkout/AddChoiceCard";
import ChoiceCard from "@/components/mainlayout/checkout/ChoiceCard";
import { RadioGroup } from "@/components/ui/radio-group";

const phoneNumbers = [
  { id: "primary", title: "Primary Number", number: "(202) 555-0191" },
  { id: "secondary", title: "Secondary Number", number: "(202) 555-0701" },
];

const ContactNumberStep = () => {
  return (
    <div className="grid gap-4 text-sm md:grid-cols-2 md:gap-5">
      <RadioGroup
        defaultValue="primary"
        aria-label="Contact number"
        className="contents"
      >
        {phoneNumbers.map((phone) => (
          <ChoiceCard
            key={phone.id}
            id={`phone-${phone.id}`}
            value={phone.id}
            title={phone.title}
            description={phone.number}
          />
        ))}
      </RadioGroup>
      <AddChoiceCard label="Add Phone Number" />
    </div>
  );
};

export default ContactNumberStep;

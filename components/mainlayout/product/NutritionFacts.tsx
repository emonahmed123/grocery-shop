import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

const nutrients = [
  { name: "Total Fat 5g", value: "6%" },
  { name: "Cholesterol 185mg", value: "62%" },
  { name: "Sodium 70mg", value: "49%" },
  { name: "Total Carbohydrate 0g", value: "18%" },
  { name: "Protein 6g", value: "35%" },
];

// Sample values until products carry their own nutrition data.
const NutritionFacts = () => {
  return (
    <div>
      <h3 className="mb-4 text-lg font-medium text-foreground">
        Nutrition Facts
      </h3>
      <div className="overflow-hidden rounded-md border">
        <div className="flex items-end justify-between border-b px-4 py-3 md:px-6">
          <div>
            <p className="text-base text-foreground">Amount per serving</p>
            <p className="text-2xl font-bold text-foreground">Calories</p>
          </div>
          <p className="text-4xl font-bold text-foreground">70</p>
        </div>
        <div className="px-2 md:px-4">
          <Table>
            <TableBody>
              {nutrients.map((nutrient) => (
                <TableRow key={nutrient.name}>
                  <TableCell>{nutrient.name}</TableCell>
                  <TableCell className="text-right">{nutrient.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default NutritionFacts;

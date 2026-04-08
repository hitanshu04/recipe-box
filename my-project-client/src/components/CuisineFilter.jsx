import { ChevronDown } from "lucide-react";

const CUISINES = [
  { value: "All", label: "All Cuisines", emoji: "🍽️" },
  { value: "Indian", label: "Indian", emoji: "🍛" },
  { value: "Chinese", label: "Chinese", emoji: "🥡" },
  { value: "Italian", label: "Italian", emoji: "🍝" },
  { value: "Mexican", label: "Mexican", emoji: "🌮" },
  { value: "American", label: "American", emoji: "🍔" },
  { value: "Other", label: "Other", emoji: "🍴" },
];

export default function CuisineFilter({ selected, onChange }) {
  return (
    <div className="relative inline-block">
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none w-full sm:w-52 pl-4 pr-10 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 font-medium cursor-pointer focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
      >
        {CUISINES.map((cuisine) => (
          <option key={cuisine.value} value={cuisine.value}>
            {cuisine.emoji} {cuisine.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
    </div>
  );
}

import GearSelectorTool from "../components/GearSelector/GearSelectorTool";

export default function ShoeSelector() {
  const config = {
    toolName: "Bowling Shoe Selector",
    type: 'shoe' as const,
    heroPlaceholder: "e.g. I rent shoes now, bowl twice a week in a league, have slightly wide feet and want something athletic looking...",
    quickFilters: ["First Pair Ever", "Upgrading Rentals", "Performance", "Athletic Style"],
    advancedOptions: [
      {
        id: "frequency",
        label: "Bowling Frequency",
        type: "radio" as const,
        options: ["Casual", "Regular", "Serious"],
        defaultValue: "Regular"
      },
      {
        id: "width",
        label: "Foot Width",
        type: "radio" as const,
        options: ["Narrow", "Standard", "Wide"],
        defaultValue: "Standard"
      },
      {
        id: "slideFoot",
        label: "Slide Foot",
        type: "radio" as const,
        options: ["Right", "Left", "Both"],
        defaultValue: "Right"
      },
      {
        id: "budget",
        label: "Budget",
        type: "select" as const,
        options: ["Under $50", "$50–$100", "$100–$150", "$150+"],
        defaultValue: "$50–$100"
      }
    ]
  };

  return <GearSelectorTool config={config} />;
}

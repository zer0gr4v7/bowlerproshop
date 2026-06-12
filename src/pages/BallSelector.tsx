import GearSelectorTool from "../components/GearSelector/GearSelectorTool";

export default function BallSelector() {
  const config = {
    toolName: "Bowling Ball Selector",
    type: 'ball' as const,
    heroPlaceholder: "e.g. I'm a league bowler with a medium hook, bowl on medium oil, wanting more backend snap...",
    quickFilters: ["Just Starting", "League Bowler", "Sport Bowler", "Tournament"],
    advancedOptions: [
      {
        id: "avgScore",
        label: "Average Score",
        type: "range" as const,
        min: 50,
        max: 300,
        defaultValue: 165
      },
      {
        id: "revRate",
        label: "Rev Rate",
        type: "radio" as const,
        options: ["Low", "Medium", "High"],
        defaultValue: "Medium"
      },
      {
        id: "laneCondition",
        label: "Typical Lane Condition",
        type: "radio" as const,
        options: ["Dry", "Medium", "Oily"],
        defaultValue: "Medium"
      },
      {
        id: "budget",
        label: "Budget",
        type: "select" as const,
        options: ["Under $100", "$100–$200", "$200+", "No limit"],
        defaultValue: "$100–$200"
      }
    ]
  };

  return <GearSelectorTool config={config} />;
}

import { useState } from "react";
import { cn } from "@/src/client/lib/utils";
import { BookOpen, ClipboardList, Users } from "lucide-react";
import KnowledgePanel from "./knowledge-panel";
import OutcomesPanel from "./outcomes-panel";
import { MembersPanel } from "./members-panel";

interface RightPanelProps {
  channelId: string | null;
}

type TabType = "knowledge" | "outcomes" | "members";

interface TabConfig {
  id: TabType;
  label: string;
  icon: React.ReactNode;
}

const TABS: TabConfig[] = [
  {
    id: "knowledge",
    label: "Knowledge",
    icon: <BookOpen className="h-4 w-4" />,
  },
  {
    id: "outcomes",
    label: "Outcomes",
    icon: <ClipboardList className="h-4 w-4" />,
  },
  { id: "members", label: "Members", icon: <Users className="h-4 w-4" /> },
];

export default function RightPanel({ channelId }: RightPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>("knowledge");

  return (
    <div className="flex flex-col h-full bg-white md:border-l border-gray-200 w-full md:w-80 flex-shrink-0">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 px-1 pt-1 bg-gray-50/50">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1 px-2 py-2.5 text-xs font-medium transition-all duration-150 min-w-0",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ADBC9F] focus-visible:ring-inset",
              activeTab === tab.id
                ? "bg-white text-[#12372A] shadow-sm rounded-t-lg border-b-2 border-[#12372A] -mb-px"
                : "text-gray-500 hover:text-[#12372A] hover:bg-white/50",
            )}
            aria-selected={activeTab === tab.id}
            role="tab"
          >
            {tab.icon}
            <span className="truncate">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden" role="tabpanel">
        {activeTab === "knowledge" && <KnowledgePanel channelId={channelId} />}
        {activeTab === "outcomes" && <OutcomesPanel channelId={channelId} />}
        {activeTab === "members" && <MembersPanel channelId={channelId} />}
      </div>
    </div>
  );
}

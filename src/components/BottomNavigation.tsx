import { Camera, FolderOpen, File, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  const tabs = [
    {
      id: "scan",
      icon: Camera,
      label: "Scan",
      color: "scanner-blue"
    },
    {
      id: "folders",
      icon: FolderOpen,
      label: "Folders",
      color: "scanner-purple"
    },
    {
      id: "files",
      icon: File,
      label: "Files",
      color: "scanner-orange"
    },
    {
      id: "share",
      icon: Share2,
      label: "Share",
      color: "scanner-green"
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border">
      <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <Button
              key={tab.id}
              variant="ghost"
              size="sm"
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center h-16 w-20 rounded-xl transition-all duration-200 ${
                isActive 
                  ? `bg-${tab.color}/10 text-${tab.color}` 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? `text-${tab.color}` : ""}`} />
              <span className={`text-xs font-medium ${
                isActive ? `text-${tab.color}` : ""
              }`}>
                {tab.label}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
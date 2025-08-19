import { useState, useEffect } from "react";
import { SplashScreen } from "@/components/SplashScreen";
import { BottomNavigation } from "@/components/BottomNavigation";
import { DocumentScanner } from "@/components/DocumentScanner";
import { FoldersView } from "@/components/FoldersView";
import { FilesView } from "@/components/FilesView";
import { ShareView } from "@/components/ShareView";
import { SuiteDashView } from "@/components/SuiteDashView";

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState("scan");

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case "scan":
        return <DocumentScanner />;
      case "folders":
        return <FoldersView />;
      case "files":
        return <FilesView />;
      case "share":
        return <ShareView />;
      case "suitedash":
        return <SuiteDashView />;
      default:
        return <DocumentScanner />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="pb-20">
        {renderActiveTab()}
      </div>
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;

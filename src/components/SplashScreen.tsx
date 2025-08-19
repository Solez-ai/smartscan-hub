import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScanLine } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [hasVisitedBefore, setHasVisitedBefore] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem("scanner-app-visited");
    setHasVisitedBefore(!!hasVisited);
  }, []);

  const handleGetStarted = () => {
    localStorage.setItem("scanner-app-visited", "true");
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-scanner-gray flex items-center justify-center p-6">
      <div className="text-center space-y-8 max-w-sm w-full">
        <div className="space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-scanner-blue to-scanner-purple rounded-2xl flex items-center justify-center shadow-lg">
            <ScanLine className="w-10 h-10 text-white" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">SmartScan Hub</h1>
            <p className="text-muted-foreground text-lg">
              Your personal document scanner & file organizer
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          <Button 
            onClick={handleGetStarted}
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-scanner-blue to-scanner-purple hover:from-scanner-blue/90 hover:to-scanner-purple/90 text-white rounded-xl shadow-lg"
          >
            {hasVisitedBefore ? "Launch App" : "Get Started"}
          </Button>
          
          <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
            <span className="flex items-center">
              <div className="w-2 h-2 bg-scanner-green rounded-full mr-2"></div>
              Scan Documents
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-scanner-orange rounded-full mr-2"></div>
              Organize Files
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-scanner-purple rounded-full mr-2"></div>
              Share Instantly
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
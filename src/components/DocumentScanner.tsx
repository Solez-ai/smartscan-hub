import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, RotateCcw, Check } from "lucide-react";
import { toast } from "sonner";

export const DocumentScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [hasCapture, setHasCapture] = useState(false);

  const handleStartCamera = () => {
    setIsScanning(true);
    // Simulate camera initialization
    setTimeout(() => {
      toast("Camera ready! Tap to capture", {
        description: "Position your document within the frame"
      });
    }, 1000);
  };

  const handleCapture = () => {
    setHasCapture(true);
    toast("Document captured!", {
      description: "Review and save your scan"
    });
  };

  const handleRetake = () => {
    setHasCapture(false);
  };

  const handleSave = () => {
    // Simulate saving
    const fileName = `Scan_${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.pdf`;
    
    // Add to localStorage for recent files
    const recentFiles = JSON.parse(localStorage.getItem("recent-files") || "[]");
    const newFile = {
      id: Date.now().toString(),
      name: fileName,
      type: "pdf",
      size: "2.1 MB",
      date: new Date().toISOString(),
      thumbnail: "/placeholder.svg"
    };
    
    recentFiles.unshift(newFile);
    localStorage.setItem("recent-files", JSON.stringify(recentFiles.slice(0, 10)));
    
    toast("Document saved successfully!", {
      description: `Saved as ${fileName}`
    });
    
    // Reset state
    setIsScanning(false);
    setHasCapture(false);
  };

  if (!isScanning) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Document Scanner</h2>
          <p className="text-muted-foreground">Scan documents, receipts, and more</p>
        </div>

        <Card className="aspect-[4/3] relative overflow-hidden bg-scanner-gray/30 border-2 border-dashed border-scanner-blue/30">
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-scanner-blue/10 flex items-center justify-center">
              <Camera className="w-10 h-10 text-scanner-blue" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-lg font-semibold text-foreground">Ready to Scan</p>
              <p className="text-sm text-muted-foreground px-8">
                Position your document and tap the camera button
              </p>
            </div>
          </div>
        </Card>

        <Button 
          onClick={handleStartCamera}
          className="w-full h-14 text-lg font-semibold bg-scanner-blue hover:bg-scanner-blue/90 text-white rounded-xl shadow-lg"
        >
          <Camera className="w-5 h-5 mr-2" />
          Start Camera
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">
          {hasCapture ? "Review Scan" : "Scanning..."}
        </h2>
        <p className="text-muted-foreground">
          {hasCapture ? "Adjust and save your document" : "Position your document in the frame"}
        </p>
      </div>

      <Card className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-scanner-blue/10 to-scanner-purple/10 border-scanner-blue/30">
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {!hasCapture ? (
            <>
              <div className="w-24 h-24 border-4 border-scanner-blue rounded-lg animate-pulse"></div>
              <p className="mt-4 text-scanner-blue font-medium">Detecting document...</p>
            </>
          ) : (
            <div className="w-full h-full bg-scanner-gray/20 flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-scanner-green rounded-lg mx-auto flex items-center justify-center">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <p className="text-scanner-green font-medium">Document Captured</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      <div className="space-y-3">
        {!hasCapture ? (
          <Button 
            onClick={handleCapture}
            className="w-full h-14 text-lg font-semibold bg-scanner-blue hover:bg-scanner-blue/90 text-white rounded-xl shadow-lg"
          >
            <Camera className="w-5 h-5 mr-2" />
            Capture Document
          </Button>
        ) : (
          <div className="flex space-x-3">
            <Button 
              onClick={handleRetake}
              variant="outline"
              className="flex-1 h-14 text-lg font-semibold border-scanner-blue text-scanner-blue hover:bg-scanner-blue/10 rounded-xl"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Retake
            </Button>
            <Button 
              onClick={handleSave}
              className="flex-1 h-14 text-lg font-semibold bg-scanner-green hover:bg-scanner-green/90 text-white rounded-xl shadow-lg"
            >
              <Check className="w-5 h-5 mr-2" />
              Save
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
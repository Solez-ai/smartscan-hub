import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, RotateCcw, Check, X } from "lucide-react";

export const CameraScanner = () => {
  const [isActive, setIsActive] = useState(false);
  const [hasCapture, setHasCapture] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: "environment", // Use back camera
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      
      setStream(mediaStream);
      setIsActive(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Camera access denied:", error);
      // Fallback for demo purposes
      setIsActive(true);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsActive(false);
    setHasCapture(false);
    setCapturedImage(null);
  }, [stream]);

  const captureImage = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        const imageData = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(imageData);
        setHasCapture(true);
      }
    } else {
      // Demo mode - simulate capture
      setCapturedImage("/placeholder.svg");
      setHasCapture(true);
    }
  }, []);

  const saveDocument = useCallback(() => {
    if (capturedImage) {
      const fileName = `Scan_${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.jpg`;
      
      // Save to recent files
      const recentFiles = JSON.parse(localStorage.getItem("recent-files") || "[]");
      const newFile = {
        id: Date.now().toString(),
        name: fileName,
        type: "jpg",
        size: "1.8 MB",
        date: new Date().toISOString(),
        thumbnail: capturedImage
      };
      
      recentFiles.unshift(newFile);
      localStorage.setItem("recent-files", JSON.stringify(recentFiles.slice(0, 10)));
      
      // Reset camera
      stopCamera();
    }
  }, [capturedImage, stopCamera]);

  if (!isActive) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Document Scanner</h2>
          <p className="text-muted-foreground">Scan documents with your camera</p>
        </div>

        <Card className="aspect-[4/3] relative overflow-hidden bg-scanner-gray/30 border-2 border-dashed border-scanner-blue/30">
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-scanner-blue/10 flex items-center justify-center">
              <Camera className="w-10 h-10 text-scanner-blue" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-lg font-semibold text-foreground">Ready to Scan</p>
              <p className="text-sm text-muted-foreground px-8">
                Position your document and start scanning
              </p>
            </div>
          </div>
        </Card>

        <Button 
          onClick={startCamera}
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
          {hasCapture ? "Review Document" : "Position Document"}
        </h2>
        <p className="text-muted-foreground">
          {hasCapture ? "Save or retake your scan" : "Center the document in the frame"}
        </p>
      </div>

      <Card className="aspect-[4/3] relative overflow-hidden bg-black rounded-xl">
        {!hasCapture ? (
          <>
            <video 
              ref={videoRef}
              autoPlay 
              playsInline 
              muted
              className="w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Scanning overlay */}
            <div className="absolute inset-4 border-2 border-scanner-blue rounded-lg border-dashed pointer-events-none">
              <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-scanner-blue rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-scanner-blue rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-scanner-blue rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-scanner-blue rounded-br-lg"></div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-scanner-gray/20">
            {capturedImage && (
              <img 
                src={capturedImage} 
                alt="Captured document" 
                className="max-w-full max-h-full object-contain"
              />
            )}
          </div>
        )}
      </Card>

      <div className="space-y-3">
        {!hasCapture ? (
          <div className="flex space-x-3">
            <Button 
              onClick={stopCamera}
              variant="outline"
              className="flex-1 h-14 text-lg font-semibold border-red-300 text-red-600 hover:bg-red-50 rounded-xl"
            >
              <X className="w-5 h-5 mr-2" />
              Cancel
            </Button>
            <Button 
              onClick={captureImage}
              className="flex-1 h-14 text-lg font-semibold bg-scanner-blue hover:bg-scanner-blue/90 text-white rounded-xl shadow-lg"
            >
              <Camera className="w-5 h-5 mr-2" />
              Capture
            </Button>
          </div>
        ) : (
          <div className="flex space-x-3">
            <Button 
              onClick={() => {
                setHasCapture(false);
                setCapturedImage(null);
              }}
              variant="outline"
              className="flex-1 h-14 text-lg font-semibold border-scanner-blue text-scanner-blue hover:bg-scanner-blue/10 rounded-xl"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Retake
            </Button>
            <Button 
              onClick={saveDocument}
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
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Upload, 
  Key, 
  Link as LinkIcon,
  Building2,
  Users,
  CheckCircle2
} from "lucide-react";

export const SuiteDashView = () => {
  const [apiKey, setApiKey] = useState("");
  const [companyUrl, setCompanyUrl] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleConnect = async () => {
    if (!apiKey.trim() || !companyUrl.trim()) return;
    
    // Simulate connection
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsConnected(true);
    
    // Save credentials to localStorage
    localStorage.setItem("suitedash-credentials", JSON.stringify({
      apiKey,
      companyUrl,
      connectedAt: new Date().toISOString()
    }));
  };

  const handleUploadToSuiteDash = async () => {
    if (!selectedProject) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const mockProjects = [
    { id: "1", name: "Client Invoices", fileCount: 12 },
    { id: "2", name: "Legal Documents", fileCount: 8 },
    { id: "3", name: "Employee Records", fileCount: 24 },
    { id: "4", name: "Contracts", fileCount: 6 }
  ];

  if (!isConnected) {
    return (
      <div className="p-6 space-y-6 pb-24">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-gradient-to-r from-scanner-blue to-scanner-purple rounded-2xl mx-auto flex items-center justify-center">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Connect to SuiteDash</h2>
          <p className="text-muted-foreground">Sync your documents with SuiteDash for team collaboration</p>
        </div>

        <Card className="p-6 space-y-6 border-scanner-blue/20">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center">
                <LinkIcon className="w-4 h-4 mr-2" />
                Company URL
              </label>
              <Input
                placeholder="yourcompany.suitedash.com"
                value={companyUrl}
                onChange={(e) => setCompanyUrl(e.target.value)}
                className="h-12 rounded-xl border-scanner-blue/20 focus:border-scanner-blue"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center">
                <Key className="w-4 h-4 mr-2" />
                API Key
              </label>
              <Input
                type="password"
                placeholder="Enter your SuiteDash API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="h-12 rounded-xl border-scanner-blue/20 focus:border-scanner-blue"
              />
            </div>

            <div className="bg-scanner-blue/5 p-4 rounded-xl">
              <p className="text-sm text-muted-foreground">
                <strong>How to get your API key:</strong><br />
                1. Login to your SuiteDash account<br />
                2. Go to Settings → API Management<br />
                3. Generate a new API key<br />
                4. Copy and paste it above
              </p>
            </div>
          </div>

          <Button 
            onClick={handleConnect}
            disabled={!apiKey.trim() || !companyUrl.trim()}
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-scanner-blue to-scanner-purple hover:from-scanner-blue/90 hover:to-scanner-purple/90 text-white rounded-xl shadow-lg"
          >
            <Building2 className="w-5 h-5 mr-2" />
            Connect to SuiteDash
          </Button>
        </Card>

        <Card className="p-4 bg-scanner-gray/30 border-dashed border-2 border-scanner-blue/30">
          <div className="text-center space-y-2">
            <Users className="w-8 h-8 text-scanner-blue mx-auto" />
            <h3 className="font-semibold text-foreground">Why Connect SuiteDash?</h3>
            <p className="text-sm text-muted-foreground">
              Automatically sync scanned documents to your team workspace for secure collaboration and client sharing.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-scanner-blue to-scanner-purple rounded-xl flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">SuiteDash Connected</h2>
            <p className="text-sm text-muted-foreground">{companyUrl}</p>
          </div>
        </div>
        <Button 
          variant="outline"
          size="sm"
          onClick={() => setIsConnected(false)}
          className="border-red-300 text-red-600 hover:bg-red-50 rounded-lg"
        >
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </div>

      <Card className="p-6 space-y-4 border-scanner-blue/20">
        <h3 className="text-lg font-semibold text-foreground">Upload to Project</h3>
        
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-2">
            {mockProjects.map((project) => (
              <Button
                key={project.id}
                variant={selectedProject === project.id ? "default" : "outline"}
                onClick={() => setSelectedProject(project.id)}
                className="h-auto p-4 text-left justify-start rounded-xl"
              >
                <div className="flex items-center justify-between w-full">
                  <div>
                    <div className="font-semibold">{project.name}</div>
                    <div className="text-sm text-muted-foreground">{project.fileCount} files</div>
                  </div>
                  {selectedProject === project.id && (
                    <CheckCircle2 className="w-5 h-5 text-scanner-blue" />
                  )}
                </div>
              </Button>
            ))}
          </div>
        </div>

        {uploadProgress > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Uploading to {mockProjects.find(p => p.id === selectedProject)?.name}</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-scanner-gray/30 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-scanner-blue to-scanner-purple h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        <Button 
          onClick={handleUploadToSuiteDash}
          disabled={!selectedProject || isUploading}
          className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-scanner-blue to-scanner-purple hover:from-scanner-blue/90 hover:to-scanner-purple/90 text-white rounded-xl shadow-lg"
        >
          <Upload className="w-5 h-5 mr-2" />
          {isUploading ? `Uploading... ${uploadProgress}%` : "Upload Recent Files"}
        </Button>
      </Card>

      <Card className="p-4 bg-scanner-green/5 border-scanner-green/20">
        <div className="flex items-start space-x-3">
          <CheckCircle2 className="w-5 h-5 text-scanner-green mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-scanner-green">Sync Active</h4>
            <p className="text-sm text-muted-foreground">
              New scanned documents will automatically sync to your selected SuiteDash project.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
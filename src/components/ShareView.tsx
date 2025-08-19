import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  UserPlus, 
  Send, 
  MessageSquare, 
  Mail, 
  Share, 
  Users,
  Link as LinkIcon,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

export const ShareView = () => {
  const [selectedFiles, setSelectedFiles] = useState<number>(0);
  const [message, setMessage] = useState("");
  const [isSharing, setIsSharing] = useState(false);
  const [employees, setEmployees] = useState<string[]>([]);
  const [newEmployee, setNewEmployee] = useState("");

  useEffect(() => {
    const savedEmployees = JSON.parse(localStorage.getItem("employees") || "[]");
    setEmployees(savedEmployees);
  }, []);

  const saveEmployees = (updatedEmployees: string[]) => {
    setEmployees(updatedEmployees);
    localStorage.setItem("employees", JSON.stringify(updatedEmployees));
  };

  const handleAddEmployee = () => {
    if (!newEmployee.trim()) return;
    
    const updatedEmployees = [...employees, newEmployee.trim()];
    saveEmployees(updatedEmployees);
    setNewEmployee("");
  };

  const handleRemoveEmployee = (index: number) => {
    const updatedEmployees = employees.filter((_, i) => i !== index);
    saveEmployees(updatedEmployees);
  };

  const handleSendFiles = async () => {
    if (selectedFiles === 0) {
      return;
    }

    setIsSharing(true);
    
    // Simulate file sending to employees
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSharing(false);
    setSelectedFiles(0);
    setMessage("");
  };

  const handleGenerateShareLink = () => {
    const shareLink = `https://smartscan.app/share/${Date.now()}`;
    navigator.clipboard.writeText(shareLink);
  };

  const handleWebShare = async (platform: string) => {
    const files = Array.from({ length: selectedFiles }, (_, i) => 
      new File([`File ${i + 1} content`], `document_${i + 1}.pdf`, { type: 'application/pdf' })
    );

    if (navigator.share && files.length > 0) {
      try {
        await navigator.share({
          title: 'Documents from SmartScan Hub',
          text: message || 'Shared documents',
          files: files
        });
      } catch (error) {
        // Fallback for platforms that don't support file sharing
        const shareData = {
          title: 'Documents from SmartScan Hub',
          text: message || 'Shared documents',
          url: `https://smartscan.app/share/${Date.now()}`
        };
        
        if (navigator.share) {
          await navigator.share(shareData);
        } else {
          // Final fallback - copy link
          navigator.clipboard.writeText(shareData.url);
        }
      }
    }
  };

  return (
    <div className="p-6 space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-scanner-green">Share</h2>
        <Badge variant="secondary" className="px-3 py-1">
          {selectedFiles} files selected
        </Badge>
      </div>

      <Card className="p-6 bg-gradient-to-br from-scanner-green/5 to-scanner-green/10 border-scanner-green/20">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-scanner-green">Share with Employees</h3>
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Enter employee email..."
                value={newEmployee}
                onChange={(e) => setNewEmployee(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddEmployee()}
                className="flex-1 h-10 rounded-lg border-scanner-green/20 focus:border-scanner-green"
              />
              <Button 
                onClick={handleAddEmployee}
                disabled={!newEmployee.trim()}
                className="bg-scanner-green hover:bg-scanner-green/90 text-white rounded-lg h-10 px-4"
              >
                <UserPlus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {employees.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Recipients:</p>
              <div className="flex flex-wrap gap-2">
                {employees.map((employee, index) => (
                  <Badge 
                    key={index}
                    variant="secondary"
                    className="bg-scanner-green/10 text-scanner-green cursor-pointer hover:bg-red-100 hover:text-red-700 transition-colors"
                    onClick={() => handleRemoveEmployee(index)}
                  >
                    <Users className="w-3 h-3 mr-1" />
                    {employee}
                    <span className="ml-1 text-xs">×</span>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Message (Optional):
            </label>
            <Textarea
              placeholder="Add a message for your employees..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="resize-none h-24 rounded-xl border-scanner-green/20 focus:border-scanner-green"
            />
          </div>

          <Button 
            onClick={handleSendFiles}
            disabled={isSharing || selectedFiles === 0}
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-scanner-green to-scanner-green/80 hover:from-scanner-green/90 hover:to-scanner-green/70 text-white rounded-xl shadow-lg"
          >
            {isSharing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Sending Files ({selectedFiles})
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Send Files ({selectedFiles})
              </>
            )}
          </Button>
        </div>
      </Card>

      <Card className="p-6 border-scanner-green/20">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Quick Share Options</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline"
              className="h-16 flex flex-col items-center justify-center space-y-1 border-scanner-green/30 text-scanner-green hover:bg-scanner-green/10 rounded-xl"
              onClick={() => handleWebShare("whatsapp")}
            >
              <MessageSquare className="w-6 h-6" />
              <span className="text-sm font-medium">WhatsApp</span>
            </Button>
            
            <Button 
              variant="outline"
              className="h-16 flex flex-col items-center justify-center space-y-1 border-scanner-green/30 text-scanner-green hover:bg-scanner-green/10 rounded-xl"
              onClick={() => handleWebShare("email")}
            >
              <Mail className="w-6 h-6" />
              <span className="text-sm font-medium">Email</span>
            </Button>
            
            <Button 
              variant="outline"
              className="h-16 flex flex-col items-center justify-center space-y-1 border-scanner-green/30 text-scanner-green hover:bg-scanner-green/10 rounded-xl"
              onClick={() => handleWebShare("social")}
            >
              <Share className="w-6 h-6" />
              <span className="text-sm font-medium">Social</span>
            </Button>
            
            <Button 
              variant="outline"
              className="h-16 flex flex-col items-center justify-center space-y-1 border-scanner-green/30 text-scanner-green hover:bg-scanner-green/10 rounded-xl"
              onClick={handleGenerateShareLink}
            >
              <LinkIcon className="w-6 h-6" />
              <span className="text-sm font-medium">Copy Link</span>
            </Button>
          </div>
        </div>
      </Card>

      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">File Selection</p>
        <div className="flex space-x-2">
          <Button 
            onClick={() => setSelectedFiles(3)}
            variant={selectedFiles === 3 ? "default" : "outline"}
            size="sm"
            className="rounded-lg"
          >
            Recent (3)
          </Button>
          <Button 
            onClick={() => setSelectedFiles(7)}
            variant={selectedFiles === 7 ? "default" : "outline"}
            size="sm"
            className="rounded-lg"
          >
            Today (7)
          </Button>
          <Button 
            onClick={() => setSelectedFiles(0)}
            variant={selectedFiles === 0 ? "default" : "outline"}
            size="sm"
            className="rounded-lg"
          >
            None
          </Button>
        </div>
      </div>
    </div>
  );
};
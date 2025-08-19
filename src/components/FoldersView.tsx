import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FolderPlus, Folder, Search, File } from "lucide-react";
import { toast } from "sonner";

interface FolderItem {
  id: string;
  name: string;
  fileCount: number;
  createdAt: string;
}

export const FoldersView = () => {
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  useEffect(() => {
    const savedFolders = JSON.parse(localStorage.getItem("folders") || "[]");
    setFolders(savedFolders);
  }, []);

  const saveFolders = (updatedFolders: FolderItem[]) => {
    setFolders(updatedFolders);
    localStorage.setItem("folders", JSON.stringify(updatedFolders));
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    
    const newFolder: FolderItem = {
      id: Date.now().toString(),
      name: newFolderName.trim(),
      fileCount: 0,
      createdAt: new Date().toISOString()
    };
    
    const updatedFolders = [newFolder, ...folders];
    saveFolders(updatedFolders);
    
    toast("Folder created successfully!", {
      description: `Created "${newFolderName}"`
    });
    
    setNewFolderName("");
    setShowNewFolderInput(false);
  };

  const filteredFolders = folders.filter(folder =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-scanner-purple">Folders</h2>
        <Button 
          onClick={() => setShowNewFolderInput(!showNewFolderInput)}
          className="bg-scanner-purple hover:bg-scanner-purple/90 text-white rounded-xl px-6 h-12 font-semibold"
        >
          <FolderPlus className="w-5 h-5 mr-2" />
          New Folder
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search folders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12 rounded-xl border-scanner-purple/20 focus:border-scanner-purple"
        />
      </div>

      {showNewFolderInput && (
        <Card className="p-4 border-scanner-purple/30 bg-scanner-purple/5">
          <div className="space-y-3">
            <Input
              placeholder="Enter folder name..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleCreateFolder()}
              className="h-12 rounded-xl border-scanner-purple/30 focus:border-scanner-purple"
              autoFocus
            />
            <div className="flex space-x-2">
              <Button 
                onClick={handleCreateFolder}
                className="flex-1 bg-scanner-purple hover:bg-scanner-purple/90 text-white rounded-xl h-10"
                disabled={!newFolderName.trim()}
              >
                Create
              </Button>
              <Button 
                onClick={() => {
                  setShowNewFolderInput(false);
                  setNewFolderName("");
                }}
                variant="outline"
                className="flex-1 border-scanner-purple/30 text-scanner-purple hover:bg-scanner-purple/10 rounded-xl h-10"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {filteredFolders.length === 0 ? (
        <Card className="aspect-square max-w-sm mx-auto flex flex-col items-center justify-center space-y-4 bg-scanner-gray/30 border-dashed border-2 border-scanner-purple/30">
          <div className="w-16 h-16 bg-scanner-purple/10 rounded-2xl flex items-center justify-center">
            <Folder className="w-8 h-8 text-scanner-purple/60" />
          </div>
          <div className="text-center space-y-2 px-6">
            <p className="text-lg font-semibold text-foreground">
              {searchQuery ? "No folders found" : "No folders yet"}
            </p>
            <p className="text-sm text-muted-foreground">
              {searchQuery 
                ? `No folders match "${searchQuery}"`
                : "Create your first folder to get started!"
              }
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredFolders.map((folder) => (
            <Card 
              key={folder.id}
              className="p-4 hover:shadow-md transition-all duration-200 cursor-pointer border-scanner-purple/20 hover:border-scanner-purple/40"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-scanner-purple/10 rounded-xl flex items-center justify-center">
                  <Folder className="w-6 h-6 text-scanner-purple" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">
                    {folder.name}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <File className="w-4 h-4" />
                    <span>{folder.fileCount} files</span>
                    <span>•</span>
                    <span>{new Date(folder.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, File, FileText, Image, FolderOpen } from "lucide-react";

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: string;
  date: string;
  folderId?: string;
  thumbnail?: string;
}

export const FilesView = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  useEffect(() => {
    const recentFiles = JSON.parse(localStorage.getItem("recent-files") || "[]");
    setFiles(recentFiles);
  }, []);

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return FileText;
      case "jpg":
      case "jpeg":
      case "png":
        return Image;
      default:
        return File;
    }
  };

  const getFileTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return "bg-red-100 text-red-700";
      case "jpg":
      case "jpeg":
      case "png":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!selectedFolder) {
    return (
      <div className="p-6 space-y-6 pb-24">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-scanner-orange">Files</h2>
        </div>

        <Card className="aspect-square max-w-sm mx-auto flex flex-col items-center justify-center space-y-4 bg-scanner-gray/30 border-dashed border-2 border-scanner-orange/30">
          <div className="w-16 h-16 bg-scanner-orange/10 rounded-2xl flex items-center justify-center">
            <FolderOpen className="w-8 h-8 text-scanner-orange/60" />
          </div>
          <div className="text-center space-y-2 px-6">
            <p className="text-lg font-semibold text-foreground">
              Please select a folder to view files
            </p>
            <p className="text-sm text-muted-foreground">
              Navigate to Folders tab to browse your organized files
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-scanner-orange">Files</h2>
        <Badge variant="secondary" className="px-3 py-1">
          {filteredFiles.length} files
        </Badge>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12 rounded-xl border-scanner-orange/20 focus:border-scanner-orange"
        />
      </div>

      {filteredFiles.length === 0 ? (
        <Card className="aspect-square max-w-sm mx-auto flex flex-col items-center justify-center space-y-4 bg-scanner-gray/30 border-dashed border-2 border-scanner-orange/30">
          <div className="w-16 h-16 bg-scanner-orange/10 rounded-2xl flex items-center justify-center">
            <File className="w-8 h-8 text-scanner-orange/60" />
          </div>
          <div className="text-center space-y-2 px-6">
            <p className="text-lg font-semibold text-foreground">
              {searchQuery ? "No files found" : "No files in this folder"}
            </p>
            <p className="text-sm text-muted-foreground">
              {searchQuery 
                ? `No files match "${searchQuery}"`
                : "Scan documents or upload files to get started"
              }
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredFiles.map((file) => {
            const FileIcon = getFileIcon(file.type);
            return (
              <Card 
                key={file.id}
                className="p-4 hover:shadow-md transition-all duration-200 cursor-pointer border-scanner-orange/20 hover:border-scanner-orange/40"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-scanner-orange/10 rounded-xl flex items-center justify-center">
                    <FileIcon className="w-6 h-6 text-scanner-orange" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">
                      {file.name}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>{file.size}</span>
                      <span>•</span>
                      <span>{new Date(file.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Badge className={`text-xs ${getFileTypeColor(file.type)}`}>
                    {file.type.toUpperCase()}
                  </Badge>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Clock,
  FileText,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ChevronRightIcon,
  Trash2,
  Menu,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface AnalysisHistory {
  id: string;
  date: Date;
  condition?: string;
  severity?: "Mild" | "Moderate" | "Severe";
  status?: "Completed" | "In Progress" | "Needs Review";
  doctorName?: string;
  raw?: any; // Store the full record for later use
}

interface AnalysisHistorySidebarProps {
  history: AnalysisHistory[];
  onSelectAnalysis: (id: string) => void;
  isCollapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
  onHistoryUpdate?: () => void;
}

const AnalysisHistorySidebar: React.FC<AnalysisHistorySidebarProps> = ({
  history,
  onSelectAnalysis,
  isCollapsed,
  onCollapse,
  onHistoryUpdate,
}) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (history.length === 0 && !isCollapsed) {
      onCollapse(true);
    }
  }, [history.length, isCollapsed, onCollapse]);

  const getStatusColor = (status?: AnalysisHistory["status"]) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "In Progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case "Needs Review":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  const getSeverityColor = (severity?: AnalysisHistory["severity"]) => {
    switch (severity) {
      case "Mild":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "Moderate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      case "Severe":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      const { error } = await supabase
        .from("analysis_records")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Analysis record deleted successfully",
      });

      onHistoryUpdate?.();
    } catch (error) {
      console.error("Error deleting analysis:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete analysis record",
      });
    } finally {
      setDeletingId(null);
      setConfirmingId(null);
    }
  };

  if (history.length === 0) {
    return (
      <div
        className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-16" : "w-80"
        }`}
      >
        <div className="p-4">
          <button
            onClick={() => onCollapse(!isCollapsed)}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
        {!isCollapsed && (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            No analysis history available
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <Card
        className={`h-[calc(100vh-5rem)] fixed left-0 top-20 border-r rounded-none transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-16" : "w-80"
        }`}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            {!isCollapsed && (
              <h2 className="text-lg font-semibold">Analysis History</h2>
            )}
            <div className="flex items-center gap-2">
              {!isCollapsed && <Clock className="h-5 w-5 text-gray-400" />}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onCollapse(!isCollapsed)}
              >
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {!isCollapsed && (
            <ScrollArea className="h-[calc(100vh-10rem)]">
              <div className="space-y-4">
                {history.map((analysis) => (
                  <div key={analysis.id} className="group relative">
                    <div
                      className={`p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-[#62d5d0] transition-all duration-300 ${
                        confirmingId === analysis.id
                          ? "translate-x-[-100%]"
                          : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div
                          onClick={() => onSelectAnalysis(analysis.id)}
                          className="flex-1 min-w-0 cursor-pointer"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <p className="text-sm font-medium truncate">
                              {analysis.condition || "Unknown"}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                            <Clock className="h-3 w-3" />
                            <span>
                              {format(analysis.date, "MMM d, yyyy h:mm a")}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {analysis.severity && (
                              <Badge
                                variant="outline"
                                className={`text-xs ${getSeverityColor(
                                  analysis.severity
                                )}`}
                              >
                                {analysis.severity}
                              </Badge>
                            )}
                            {analysis.status && (
                              <Badge
                                variant="outline"
                                className={`text-xs ${getStatusColor(
                                  analysis.status
                                )}`}
                              >
                                {analysis.status}
                              </Badge>
                            )}
                          </div>

                          {analysis.doctorName && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                              Reviewed by: {analysis.doctorName}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:text-red-500"
                            onClick={() => setConfirmingId(analysis.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-[#62d5d0] transition-colors" />
                        </div>
                      </div>
                    </div>
                    {confirmingId === analysis.id && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-500 rounded-lg animate-fade-in">
                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex items-center gap-2 mb-2"
                          onClick={() => handleDelete(analysis.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white text-red-500 hover:bg-white/90"
                          onClick={() => setConfirmingId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
      {/* Add a tooltip for collapsed state */}
      {isCollapsed && (
        <div className="fixed left-16 top-20 h-[calc(100vh-5rem)] w-8 flex items-center justify-center">
          <div className="bg-background border border-border rounded-r-lg p-2 shadow-lg">
            <Clock className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      )}
    </>
  );
};

export default AnalysisHistorySidebar;

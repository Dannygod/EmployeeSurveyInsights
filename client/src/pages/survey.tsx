import { useState } from "react";
import { ClipboardList, Edit, BarChart3 } from "lucide-react";
import SurveyForm from "@/components/survey-form";
import AnalyticsDashboard from "@/components/analytics-dashboard";

export default function SurveyPage() {
  const [activeTab, setActiveTab] = useState<"survey" | "analytics">("survey");

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <ClipboardList className="text-indigo-600 text-2xl" />
              <h1 className="text-xl font-semibold text-slate-900">IT基礎設施改善問卷系統</h1>
            </div>
            <nav className="flex space-x-6">
              <button
                onClick={() => setActiveTab("survey")}
                className={`px-4 py-2 font-medium flex items-center transition-colors ${
                  activeTab === "survey"
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-slate-500 hover:text-indigo-600"
                }`}
              >
                <Edit className="mr-2 h-4 w-4" />
                問卷填寫
              </button>
              <button
                onClick={() => setActiveTab("analytics")}
                className={`px-4 py-2 font-medium flex items-center transition-colors ${
                  activeTab === "analytics"
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-slate-500 hover:text-indigo-600"
                }`}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                數據分析
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={activeTab === "survey" ? "" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"}>
        {activeTab === "survey" ? <SurveyForm /> : <AnalyticsDashboard />}
      </main>
    </div>
  );
}

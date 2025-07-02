import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Users, 
  CheckCircle, 
  Clock, 
  RefreshCw, 
  Building, 
  Laptop, 
  AlertTriangle, 
  Shield, 
  TrendingUp, 
  Bot,
  FileText,
  Download
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";

const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#6B7280'];

const resourceLabels: Record<string, string> = {
  network: "內網/WiFi/VPN",
  printer: "印表機設備",
  videoconf: "視訊會議",
  login: "系統登入",
  computer: "電腦設定",
  other: "其他"
};

const problemLabels: Record<string, string> = {
  network_slow: "網速不穩",
  password: "密碼問題",
  no_help: "找不到幫助",
  equipment: "設備問題",
  data_loss: "資料遺失",
  software: "軟體異常",
  system_slow: "系統緩慢",
  no_problems: "沒有困擾"
};

const securityLabels: Record<string, string> = {
  very_confident: "非常有信心",
  confident: "有信心",
  neutral: "信心一般",
  not_confident: "沒有信心",
  unclear: "不清楚"
};

const improvementLabels: Record<string, string> = {
  network_stability: "網路穩定",
  training: "使用教學",
  response_speed: "回應速度",
  password_issues: "密碼困擾",
  equipment_upgrade: "設備升級",
  progress_tracking: "進度追蹤",
  backup_restore: "備份還原"
};

const aiLabels: Record<string, string> = {
  strongly_support: "非常支持",
  acceptable: "可接受",
  reserved: "持保留態度",
  willing_learn: "願意學習",
  not_support: "不支持"
};

export default function AnalyticsDashboard() {
  const { data: analytics, isLoading, refetch } = useQuery({
    queryKey: ["/api/survey/analytics"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const handleExportPDF = () => {
    // TODO: Implement PDF export functionality
    alert("PDF報告匯出功能開發中...");
  };

  const handleExportExcel = () => {
    // TODO: Implement Excel export functionality
    alert("Excel數據匯出功能開發中...");
  };

  const handleRefreshData = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center mb-8">
              <Skeleton className="h-8 w-64 mx-auto mb-2" />
              <Skeleton className="h-4 w-96 mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-80" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="space-y-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">問卷數據分析</h2>
              <p className="text-gray-600">目前還沒有任何問卷回應數據</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Transform data for charts
  const companyData = Object.entries(analytics.companyDistribution).map(([key, value]) => ({
    name: key,
    value
  }));

  const resourcesData = Object.entries(analytics.itResourcesUsage).map(([key, value]) => ({
    name: resourceLabels[key] || key,
    value
  }));

  const problemsData = Object.entries(analytics.commonProblems).map(([key, value]) => ({
    name: problemLabels[key] || key,
    value
  }));

  const securityData = Object.entries(analytics.securityConfidence).map(([key, value]) => ({
    name: securityLabels[key] || key,
    value
  }));

  const improvementsData = Object.entries(analytics.improvementPriorities).map(([key, value]) => ({
    subject: improvementLabels[key] || key,
    value: value
  }));

  const aiData = Object.entries(analytics.aiOpinion).map(([key, value]) => ({
    name: aiLabels[key] || key,
    value
  }));

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">問卷數據分析</h2>
            <p className="text-gray-600">實時查看問卷回饋統計結果</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">總回應數</p>
                    <p className="text-2xl font-bold">{analytics.totalResponses}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">完成率</p>
                    <p className="text-2xl font-bold">{analytics.completionRate}%</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-200" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">平均填寫時間</p>
                    <p className="text-2xl font-bold">{analytics.avgTime}</p>
                  </div>
                  <Clock className="h-8 w-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">最新更新</p>
                    <p className="text-lg font-bold">{analytics.lastUpdate}</p>
                  </div>
                  <RefreshCw className="h-8 w-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Company Distribution */}
            {companyData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building className="mr-2 text-blue-500" />
                    公司分布
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={companyData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {companyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* IT Resources Usage */}
            {resourcesData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Laptop className="mr-2 text-green-500" />
                    IT資源使用情況
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={resourcesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        fontSize={12}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Common IT Problems */}
            {problemsData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="mr-2 text-red-500" />
                    常見IT問題
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={problemsData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        width={100}
                        fontSize={12}
                      />
                      <Tooltip />
                      <Bar dataKey="value" fill="#EF4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Security Confidence */}
            {securityData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2 text-purple-500" />
                    資安信心度
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={securityData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {securityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* IT Improvement Priorities */}
            {improvementsData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2 text-indigo-500" />
                    IT改善優先項目
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={improvementsData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" fontSize={10} />
                      <PolarRadiusAxis />
                      <Radar
                        name="期待程度"
                        dataKey="value"
                        stroke="#6366F1"
                        fill="#6366F1"
                        fillOpacity={0.2}
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* AI Opinion */}
            {aiData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bot className="mr-2 text-cyan-500" />
                    AI工具導入意見
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={aiData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {aiData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Export Options */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-center space-x-4">
              <Button
                onClick={handleExportPDF}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <FileText className="mr-2 h-4 w-4" />
                匯出PDF報告
              </Button>
              <Button
                onClick={handleExportExcel}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                <Download className="mr-2 h-4 w-4" />
                匯出Excel數據
              </Button>
              <Button
                onClick={handleRefreshData}
                variant="outline"
                className="px-6 py-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                重新整理數據
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

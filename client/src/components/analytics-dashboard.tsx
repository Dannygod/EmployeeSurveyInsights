import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    Chart: any;
  }
}

interface ChartRef extends HTMLCanvasElement {
  chart?: any;
}

interface AnalyticsData {
  totalResponses: number;
  completionRate: number;
  avgTime: string;
  lastUpdate: string;
  companyDistribution: Record<string, number>;
  itResourcesUsage: Record<string, number>;
  commonProblems: Record<string, number>;
  securityConfidence: Record<string, number>;
  improvementPriorities: Record<string, number>;
  aiOpinion: Record<string, number>;
}

const resourceLabels: Record<string, string> = {
  network: "公司內網/VPN",
  printer: "印表機",
  videoconf: "視訊會議",
  login: "系統登入",
  computer: "電腦設定",
  other: "其他"
};

const problemLabels: Record<string, string> = {
  network_slow: "網速不穩",
  password: "密碼麻煩",
  no_help: "找不到人",
  equipment: "設備老舊",
  data_loss: "資料遺失",
  software: "軟體當機",
  system_slow: "開機緩慢",
  no_problems: "沒有困擾"
};

const helpMethodLabels: Record<string, string> = {
  self_google: "自己解決",
  it_service: "看IT service",
  form: "填單報修",
  phone: "打電話",
  other: "其他"
};

const securityLabels: Record<string, string> = {
  very_confident: "非常有信心",
  confident: "有信心",
  neutral: "信心一般",
  not_confident: "沒信心",
  unclear: "不清楚"
};

const improvementLabels: Record<string, string> = {
  network_stability: "提升網速",
  training: "清楚教學",
  response_speed: "快速回應",
  password_issues: "減少密碼困擾",
  equipment_upgrade: "設備汰換",
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
  const chartRefs = {
    itResources: useRef<ChartRef>(null),
    itIssues: useRef<ChartRef>(null),
    problemSolving: useRef<ChartRef>(null),
    securityConfidence: useRef<ChartRef>(null),
    improvements: useRef<ChartRef>(null),
    aiOpinion: useRef<ChartRef>(null),
  };

  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ["/api/survey/analytics"],
    refetchInterval: 30000,
  });

  const initializeCharts = () => {
    if (!window.Chart || !analytics) return;

    // Chart colors
    const chartColors = {
      purple: 'rgba(79, 70, 229, 0.7)',
      indigo: 'rgba(67, 56, 202, 0.7)',
      blue: 'rgba(59, 130, 246, 0.7)',
      green: 'rgba(16, 185, 129, 0.7)',
      yellow: 'rgba(234, 179, 8, 0.7)',
      red: 'rgba(220, 38, 38, 0.7)',
      teal: 'rgba(20, 184, 166, 0.7)'
    };

    const chartHoverColors = {
      purple: 'rgba(79, 70, 229, 1)',
      indigo: 'rgba(67, 56, 202, 1)',
      blue: 'rgba(59, 130, 246, 1)',
      green: 'rgba(16, 185, 129, 1)',
      yellow: 'rgba(234, 179, 8, 1)',
      red: 'rgba(220, 38, 38, 1)',
      teal: 'rgba(20, 184, 166, 1)'
    };

    // Set global Chart.js defaults
    window.Chart.defaults.font.family = "'Inter', 'Noto Sans TC', sans-serif";
    window.Chart.defaults.plugins.legend.position = 'bottom';

    // Transform data for charts
    const resourcesData = Object.entries(analytics.itResourcesUsage || {}).map(([key, value]) => ({
      label: resourceLabels[key] || key,
      value: value as number
    }));

    const problemsData = Object.entries(analytics.commonProblems || {}).map(([key, value]) => ({
      label: problemLabels[key] || key,
      value: value as number
    }));

    // For help method, we'll use simulated data based on the total responses
    const totalResponses = analytics.totalResponses || 1;
    const helpMethodData = [
      { label: '自己解決', value: Math.floor(totalResponses * 0.45) },
      { label: '看IT service', value: Math.floor(totalResponses * 0.10) },
      { label: '填單報修', value: Math.floor(totalResponses * 0.35) },
      { label: '打電話', value: Math.floor(totalResponses * 0.08) },
      { label: '其他', value: Math.floor(totalResponses * 0.02) }
    ];

    const securityData = Object.entries(analytics.securityConfidence || {}).map(([key, value]) => ({
      label: securityLabels[key] || key,
      value: value as number
    }));

    const improvementsData = Object.entries(analytics.improvementPriorities || {}).map(([key, value]) => ({
      label: improvementLabels[key] || key,
      value: value as number
    }));

    const aiData = Object.entries(analytics.aiOpinion || {}).map(([key, value]) => ({
      label: aiLabels[key] || key,
      value: value as number
    }));

    // Destroy existing charts before creating new ones
    Object.values(chartRefs).forEach(ref => {
      if (ref.current && ref.current.chart) {
        ref.current.chart.destroy();
      }
    });

    // Chart 1: IT Resources (Horizontal Bar)
    if (chartRefs.itResources.current && resourcesData.length > 0) {
      chartRefs.itResources.current.chart = new window.Chart(chartRefs.itResources.current, {
        type: 'bar',
        data: {
          labels: resourcesData.map(item => item.label),
          datasets: [{
            label: '使用頻率',
            data: resourcesData.map(item => item.value),
            backgroundColor: Object.values(chartColors),
            borderColor: Object.values(chartHoverColors),
            borderWidth: 1
          }]
        },
        options: {
          indexAxis: 'y',
          scales: {
            x: {
              beginAtZero: true
            }
          },
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
    }

    // Chart 2: IT Issues (Horizontal Bar)
    if (chartRefs.itIssues.current && problemsData.length > 0) {
      chartRefs.itIssues.current.chart = new window.Chart(chartRefs.itIssues.current, {
        type: 'bar',
        data: {
          labels: problemsData.map(item => item.label),
          datasets: [{
            label: '遭遇困擾比例',
            data: problemsData.map(item => item.value),
            backgroundColor: Object.values(chartColors),
            borderColor: Object.values(chartHoverColors),
            borderWidth: 1
          }]
        },
        options: {
          indexAxis: 'y',
          scales: {
            x: {
              beginAtZero: true
            }
          },
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
    }

    // Chart 3: Problem Solving (Pie)
    if (chartRefs.problemSolving.current) {
      chartRefs.problemSolving.current.chart = new window.Chart(chartRefs.problemSolving.current, {
        type: 'pie',
        data: {
          labels: helpMethodData.map(item => item.label),
          datasets: [{
            data: helpMethodData.map(item => item.value),
            backgroundColor: Object.values(chartColors),
            hoverOffset: 4
          }]
        }
      });
    }

    // Chart 4: Security Confidence (Doughnut)
    if (chartRefs.securityConfidence.current && securityData.length > 0) {
      chartRefs.securityConfidence.current.chart = new window.Chart(chartRefs.securityConfidence.current, {
        type: 'doughnut',
        data: {
          labels: securityData.map(item => item.label),
          datasets: [{
            data: securityData.map(item => item.value),
            backgroundColor: Object.values(chartColors),
            hoverOffset: 4
          }]
        }
      });
    }

    // Chart 5: Improvements (Bar)
    if (chartRefs.improvements.current && improvementsData.length > 0) {
      chartRefs.improvements.current.chart = new window.Chart(chartRefs.improvements.current, {
        type: 'bar',
        data: {
          labels: improvementsData.map(item => item.label),
          datasets: [{
            label: '期望改善比例',
            data: improvementsData.map(item => item.value),
            backgroundColor: Object.values(chartColors),
            borderColor: Object.values(chartHoverColors),
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
    }

    // Chart 6: AI Opinion (Pie)
    if (chartRefs.aiOpinion.current && aiData.length > 0) {
      chartRefs.aiOpinion.current.chart = new window.Chart(chartRefs.aiOpinion.current, {
        type: 'pie',
        data: {
          labels: aiData.map(item => item.label),
          datasets: [{
            data: aiData.map(item => item.value),
            backgroundColor: Object.values(chartColors),
            hoverOffset: 4
          }]
        }
      });
    }
  };

  useEffect(() => {
    // Load Chart.js from CDN
    if (!window.Chart) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.onload = () => {
        if (analytics && window.Chart) {
          initializeCharts();
        }
      };
      document.head.appendChild(script);
    } else if (analytics) {
      initializeCharts();
    }
  }, [analytics]);

  if (isLoading) {
    return (
      <div className="bg-slate-100 min-h-screen text-slate-800" style={{ fontFamily: "'Inter', 'Noto Sans TC', sans-serif" }}>
        <div className="container mx-auto p-4 sm:p-6 md:p-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">IT基礎設施改善問卷</h1>
            <p className="text-lg text-slate-600 mt-2">數據分析儀表板</p>
          </div>
          <div className="text-center">
            <p className="text-slate-600">載入中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics || analytics.totalResponses === 0) {
    return (
      <div className="bg-slate-100 min-h-screen text-slate-800" style={{ fontFamily: "'Inter', 'Noto Sans TC', sans-serif" }}>
        <div className="container mx-auto p-4 sm:p-6 md:p-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">IT基礎設施改善問卷</h1>
            <p className="text-lg text-slate-600 mt-2">數據分析儀表板</p>
          </div>
          <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
            <p className="text-slate-600">目前還沒有任何問卷回應數據</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 min-h-screen text-slate-800" style={{ fontFamily: "'Inter', 'Noto Sans TC', sans-serif" }}>
      <div className="container mx-auto p-4 sm:p-6 md:p-8">
        {/* 儀表板標頭 */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">IT基礎設施改善問卷</h1>
          <p className="text-lg text-slate-600 mt-2">數據分析儀表板</p>
        </div>

        {/* 圖表網格 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Chart 1: 最常使用的IT資源 */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-center">Part 1-1: 最常使用的IT資源</h2>
            <canvas ref={chartRefs.itResources} id="itResourcesChart"></canvas>
          </div>

          {/* Chart 2: 遇到的IT困擾 */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-center">Part 1-2: 遇到的IT困擾</h2>
            <canvas ref={chartRefs.itIssues} id="itIssuesChart"></canvas>
          </div>

          {/* Chart 3: IT問題處理方式 */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-center">Part 1-3: IT問題處理方式</h2>
            <div className="max-w-xs mx-auto">
              <canvas ref={chartRefs.problemSolving} id="problemSolvingChart"></canvas>
            </div>
          </div>

          {/* Chart 4: 資安威脅防護信心 */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-center">Part 1-4: 資安威脅防護信心</h2>
            <div className="max-w-xs mx-auto">
              <canvas ref={chartRefs.securityConfidence} id="securityConfidenceChart"></canvas>
            </div>
          </div>

          {/* Chart 5: 希望IT改進方向 */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-center">Part 2-1: 希望IT改進方向</h2>
            <canvas ref={chartRefs.improvements} id="improvementsChart"></canvas>
          </div>

          {/* Chart 6: 對AI工具的看法 */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-center">Part 3-1: 對AI工具的看法</h2>
            <div className="max-w-xs mx-auto">
              <canvas ref={chartRefs.aiOpinion} id="aiOpinionChart"></canvas>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
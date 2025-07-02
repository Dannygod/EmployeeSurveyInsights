import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { insertSurveyResponseSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const formSchema = insertSurveyResponseSchema.extend({
  employeeId: z.string().min(1, "請輸入工號"),
  name: z.string().min(1, "請輸入姓名"),
  company: z.string().min(1, "請選擇公司"),
  itResources: z.array(z.string()).min(1, "請至少選擇一項IT資源"),
  improvements: z.array(z.string()).min(1, "請至少選擇一項改進方向").max(3, "最多只能選擇3項"),
});

type FormData = z.infer<typeof formSchema>;

export default function SurveyForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedImprovements, setSelectedImprovements] = useState<string[]>([]);
  const [showMaxSelectionMsg, setShowMaxSelectionMsg] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeeId: "",
      name: "",
      company: "",
      itResources: [],
      itResourcesOther: "",
      itProblems: [],
      helpMethod: "",
      formKnowledge: "",
      securityConfidence: "",
      remoteAccess: "",
      internalSecurity: "",
      improvements: [],
      aiOpinion: "",
      feedback: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch("/api/survey", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error("提交失敗");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "提交成功",
        description: "感謝您的填寫！",
      });
      form.reset();
      setSelectedImprovements([]);
      queryClient.invalidateQueries({ queryKey: ["/api/survey"] });
      queryClient.invalidateQueries({ queryKey: ["/api/survey/analytics"] });
    },
    onError: (error) => {
      toast({
        title: "提交失敗",
        description: "請稍後再試",
        variant: "destructive",
      });
    },
  });

  const handleImprovementChange = (value: string, checked: boolean) => {
    let newSelection: string[];
    
    if (checked) {
      if (selectedImprovements.length >= 3) {
        setShowMaxSelectionMsg(true);
        setTimeout(() => setShowMaxSelectionMsg(false), 3000);
        return;
      }
      newSelection = [...selectedImprovements, value];
    } else {
      newSelection = selectedImprovements.filter(item => item !== value);
    }
    
    setSelectedImprovements(newSelection);
    form.setValue('improvements', newSelection);
  };

  const onSubmit = (data: FormData) => {
    const processedData = {
      ...data,
      improvements: selectedImprovements,
    };
    
    mutation.mutate(processedData);
  };

  return (
    <div className="bg-slate-100 text-slate-800 min-h-screen font-['Inter','Noto_Sans_TC',sans-serif]">
      <style>{`
        /* 自訂 checkbox 與 radio 的樣式 */
        .form-checkbox, .form-radio {
          appearance: none;
          -webkit-appearance: none;
          width: 1.25rem;
          height: 1.25rem;
          border: 2px solid #d1d5db;
          border-radius: 0.25rem;
          display: inline-block;
          position: relative;
          vertical-align: middle;
          cursor: pointer;
          margin-right: 0.5rem;
          transition: background-color 0.2s, border-color 0.2s;
        }
        .form-radio {
          border-radius: 50%;
        }
        .form-checkbox:checked, .form-radio:checked {
          background-color: #4f46e5;
          border-color: #4f46e5;
        }
        .form-checkbox:checked::after {
          content: '✔';
          font-size: 0.8rem;
          color: white;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        .form-radio:checked::after {
          content: '';
          width: 0.5rem;
          height: 0.5rem;
          background-color: white;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        .form-label {
          display: flex;
          align-items: center;
          margin-bottom: 0.5rem;
          cursor: pointer;
        }
      `}</style>
      
      <div className="container mx-auto max-w-4xl p-4 sm:p-6 md:p-8">
        
        {/* 表單標頭 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">讓我們更懂你</h1>
          <p className="text-lg text-slate-600 mt-2">IT基礎設施改善問卷</p>
        </div>

        {/* 表單主體 */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg space-y-10">

          {/* 基本資料 */}
          <fieldset className="space-y-6">
            <legend className="text-2xl font-bold border-b-2 border-indigo-500 pb-2 mb-6">👤 基本資料</legend>
            
            <div>
              <label htmlFor="employeeId" className="block text-md font-medium text-slate-700 mb-2">工號</label>
              <input 
                type="text" 
                id="employeeId" 
                {...form.register("employeeId")}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
              {form.formState.errors.employeeId && (
                <p className="text-red-600 text-sm mt-1">{form.formState.errors.employeeId.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="employeeName" className="block text-md font-medium text-slate-700 mb-2">名字 (如 Ben Chen)</label>
              <input 
                type="text" 
                id="employeeName" 
                {...form.register("name")}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
              {form.formState.errors.name && (
                <p className="text-red-600 text-sm mt-1">{form.formState.errors.name.message}</p>
              )}
            </div>
            
            <div>
              <span className="block text-md font-medium text-slate-700 mb-2">公司</span>
              <div className="flex flex-col sm:flex-row sm:space-x-6">
                <label className="flex items-center mb-2">
                  <input 
                    type="radio" 
                    {...form.register("company")}
                    value="VIA" 
                    className="form-radio"
                  />
                  <span>VIA</span>
                </label>
                <label className="flex items-center mb-2">
                  <input 
                    type="radio" 
                    {...form.register("company")}
                    value="VLI" 
                    className="form-radio"
                  />
                  <span>VLI</span>
                </label>
                <label className="flex items-center mb-2">
                  <input 
                    type="radio" 
                    {...form.register("company")}
                    value="VIA NEXT" 
                    className="form-radio"
                  />
                  <span>VIA NEXT</span>
                </label>
              </div>
              {form.formState.errors.company && (
                <p className="text-red-600 text-sm mt-1">{form.formState.errors.company.message}</p>
              )}
            </div>
          </fieldset>

          {/* Part 1 */}
          <fieldset className="space-y-6">
            <legend className="text-2xl font-bold border-b-2 border-indigo-500 pb-2 mb-6">🧠 Part 1：日常使用經驗與資料相關困擾</legend>
            
            {/* Q1 */}
            <div>
              <label className="block text-md font-medium text-slate-700 mb-3">1. 您在日常工作中最常使用下列哪些 IT 資源？ (可複選)</label>
              <div className="space-y-2">
                {[
                  { value: "network", label: "公司內網/WiFi/VPN" },
                  { value: "printer", label: "印表機等設備" },
                  { value: "meeting_tools", label: "視訊會議工具 (如 Teams)" },
                  { value: "login", label: "系統登入與帳號密碼" },
                  { value: "pc_setup", label: "電腦基礎設定" },
                ].map((item) => (
                  <label key={item.value} className="form-label">
                    <input 
                      type="checkbox" 
                      {...form.register("itResources")}
                      value={item.value}
                      className="form-checkbox"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
                <div className="flex items-center">
                  <label className="form-label flex-shrink-0">
                    <input 
                      type="checkbox" 
                      {...form.register("itResources")}
                      value="other" 
                      className="form-checkbox"
                    />
                    <span>其他：</span>
                  </label>
                  <input 
                    type="text" 
                    {...form.register("itResourcesOther")}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  />
                </div>
              </div>
              {form.formState.errors.itResources && (
                <p className="text-red-600 text-sm mt-1">{form.formState.errors.itResources.message}</p>
              )}
            </div>

            {/* Q2 */}
            <div>
              <label className="block text-md font-medium text-slate-700 mb-3">2. 在使用上述 IT 資源時，您是否曾遇到以下困擾？ (可複選)</label>
              <div className="space-y-2">
                {[
                  { value: "slow_network", label: "網速不穩或延遲" },
                  { value: "password", label: "密碼常忘記，重設流程麻煩" },
                  { value: "no_help", label: "找不到人幫忙處理 IT 問題" },
                  { value: "device_problem", label: "設備問題 (如電腦太舊、印表機難用、螢幕顯示異常)" },
                  { value: "data_loss", label: "曾因設備故障、病毒、勒索軟體或誤操作導致工作資料遺失或無法存取" },
                  { value: "software_crash", label: "軟體應用程式異常或當機 (例如：Outlook、Office、瀏覽器)" },
                  { value: "slow_boot", label: "電腦開機異常或系統運行緩慢" },
                  { value: "no_issue", label: "沒有遇過困擾" },
                ].map((item) => (
                  <label key={item.value} className="form-label">
                    <input 
                      type="checkbox" 
                      {...form.register("itProblems")}
                      value={item.value}
                      className="form-checkbox"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Q3 */}
            <div>
              <label className="block text-md font-medium text-slate-700 mb-3">3. 當您遇到 IT 問題時，您通常： (單選)</label>
              <div className="space-y-2">
                {[
                  { value: "self", label: "自己Google、AI或問同事" },
                  { value: "it_service", label: "看IT service" },
                  { value: "ticket", label: "填表單報修 (是否知道在哪填？ ☐知道 ☐不知道)" },
                  { value: "call_it", label: "打電話找IT 來修" },
                ].map((item) => (
                  <label key={item.value} className="form-label">
                    <input 
                      type="radio" 
                      {...form.register("helpMethod")}
                      value={item.value}
                      className="form-radio"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Q4 */}
            <div>
              <label className="block text-md font-medium text-slate-700 mb-3">4. 您對於公司目前在防範網路釣魚、惡意軟體或資料外洩等資安威脅的防護能力，抱持何種看法？ (單選)</label>
              <div className="space-y-2">
                {[
                  { value: "very_confident", label: "非常有信心，覺得公司資安防護很完善" },
                  { value: "confident", label: "有信心，但偶爾仍會擔心" },
                  { value: "average", label: "信心一般，覺得有改善空間" },
                  { value: "not_confident", label: "沒有信心，擔心資安威脅" },
                  { value: "not_sure", label: "不清楚" },
                ].map((item) => (
                  <label key={item.value} className="form-label">
                    <input 
                      type="radio" 
                      {...form.register("securityConfidence")}
                      value={item.value}
                      className="form-radio"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Q5 */}
            <div>
              <label className="block text-md font-medium text-slate-700 mb-3">5. 您對於目前遠端工作或外部存取公司資源時的資安驗證流程的便利性與安全性感受為何？ (單選)</label>
              <div className="space-y-2">
                {[
                  { value: "very_good", label: "非常便利且安全，沒有任何困擾" },
                  { value: "ok", label: "尚可，安全有保障但偶爾感到不便" },
                  { value: "not_convenient", label: "不太便利，流程繁瑣或常出錯" },
                  { value: "insecure", label: "擔心安全性不足，操作上有些疑慮" },
                  { value: "not_sure", label: "不清楚這些流程" },
                ].map((item) => (
                  <label key={item.value} className="form-label">
                    <input 
                      type="radio" 
                      {...form.register("remoteAccess")}
                      value={item.value}
                      className="form-radio"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Q6 */}
            <div>
              <label className="block text-md font-medium text-slate-700 mb-3">6. 您是否曾擔心公司內部不同部門或個人電腦之間，資料傳輸或存取可能存在未經授權的風險？ (單選)</label>
              <div className="space-y-2">
                {[
                  { value: "often", label: "經常擔心，覺得內部存取可能不夠安全" },
                  { value: "sometimes", label: "偶爾會擔心" },
                  { value: "rarely", label: "不太擔心，相信公司內部防護良好" },
                  { value: "never", label: "從未擔心過" },
                  { value: "not_sure", label: "不清楚" },
                ].map((item) => (
                  <label key={item.value} className="form-label">
                    <input 
                      type="radio" 
                      {...form.register("internalSecurity")}
                      value={item.value}
                      className="form-radio"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </fieldset>

          {/* Part 2 */}
          <fieldset className="space-y-6">
            <legend className="text-2xl font-bold border-b-2 border-indigo-500 pb-2 mb-6">💡 Part 2：對 IT 部門的期待</legend>
            <div>
              <label className="block text-md font-medium text-slate-700 mb-3">1. 您最希望 IT 團隊改進哪些方向？ (最多選 3 項)</label>
              <div className="space-y-2">
                {[
                  { value: "network_speed", label: "提升網路穩定與速度" },
                  { value: "clearer_instructions", label: "資訊系統使用教學更清楚" },
                  { value: "faster_response", label: "IT問題回應速度更快" },
                  { value: "less_password_hassle", label: "減少密碼登入困擾" },
                  { value: "device_upgrade", label: "員工設備汰換/效能提升" },
                  { value: "progress_tracking", label: "有問題時能即時追蹤處理進度" },
                  { value: "backup_restore", label: "提供更可靠的工作資料備份與還原機制" },
                ].map((item) => (
                  <label key={item.value} className="form-label">
                    <input 
                      type="checkbox" 
                      checked={selectedImprovements.includes(item.value)}
                      onChange={(e) => handleImprovementChange(item.value, e.target.checked)}
                      className="form-checkbox"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
              {showMaxSelectionMsg && (
                <div className="text-red-600 text-sm mt-2">最多只能選擇 3 個項目。</div>
              )}
              {form.formState.errors.improvements && (
                <p className="text-red-600 text-sm mt-1">{form.formState.errors.improvements.message}</p>
              )}
            </div>
          </fieldset>

          {/* Part 3 */}
          <fieldset className="space-y-6">
            <legend className="text-2xl font-bold border-b-2 border-indigo-500 pb-2 mb-6">💻 Part 3：AI工具與未來技術</legend>
            <div>
              <label className="block text-md font-medium text-slate-700 mb-3">1. 您對於未來公司導入AI工具或開發AI相關應用的看法為何？ (單選)</label>
              <div className="space-y-2">
                {[
                  { value: "support", label: "非常支持，認為能提升工作效率" },
                  { value: "accept", label: "可接受，但需要有明確的應用場景" },
                  { value: "reserved", label: "持保留態度，擔心資訊安全或取代人力" },
                  { value: "willing_to_learn", label: "不了解，但願意學習" },
                  { value: "not_support", label: "不支持" },
                ].map((item) => (
                  <label key={item.value} className="form-label">
                    <input 
                      type="radio" 
                      {...form.register("aiOpinion")}
                      value={item.value}
                      className="form-radio"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </fieldset>

          {/* Part 4 */}
          <fieldset>
            <legend className="text-2xl font-bold border-b-2 border-indigo-500 pb-2 mb-6">💬 Part 4：意見與建議</legend>
            <div>
              <label htmlFor="suggestions" className="block text-md font-medium text-slate-700 mb-2">您對 IT 部門還有什麼建議或期待？ (開放填寫)</label>
              <textarea 
                id="suggestions" 
                {...form.register("feedback")}
                rows={5} 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" 
                placeholder="請在此寫下您的寶貴意見..."
              />
            </div>
          </fieldset>

          {/* 提交按鈕 */}
          <div className="text-center pt-6">
            <button 
              type="submit" 
              disabled={mutation.isPending}
              className="bg-indigo-600 text-white font-bold py-3 px-12 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mutation.isPending ? "提交中..." : "提交問卷"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
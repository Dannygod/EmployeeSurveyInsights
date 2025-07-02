import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { insertSurveyResponseSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { User, Brain, Lightbulb, Laptop, MessageSquare, Send } from "lucide-react";

const formSchema = insertSurveyResponseSchema.extend({
  // Add additional validation rules
  employeeId: z.string().min(1, "請輸入工號"),
  name: z.string().min(1, "請輸入姓名"),
  company: z.string().min(1, "請選擇公司"),
});

type FormData = z.infer<typeof formSchema>;

export default function SurveyForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const submitMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return apiRequest("POST", "/api/survey", data);
    },
    onSuccess: () => {
      toast({
        title: "問卷已提交",
        description: "感謝您的參與！您的意見對我們很重要。",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/survey/analytics"] });
    },
    onError: (error) => {
      toast({
        title: "提交失敗",
        description: error.message || "請稍後再試",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    submitMutation.mutate(data);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">讓我們更懂你：IT基礎設施改善問卷</h2>
            <p className="text-gray-600">您的寶貴意見將幫助我們改善IT服務品質</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Information Section */}
              <div className="border-l-4 border-primary pl-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="mr-2 text-primary" />
                  👤 基本資料
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="employeeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>工號</FormLabel>
                        <FormControl>
                          <Input placeholder="請輸入工號" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>姓名 (如 Ben Chen)</FormLabel>
                        <FormControl>
                          <Input placeholder="請輸入姓名" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>公司</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex space-x-6"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="VIA" id="via" />
                                <Label htmlFor="via">VIA</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="VLI" id="vli" />
                                <Label htmlFor="vli">VLI</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="VIA NEXT" id="via-next" />
                                <Label htmlFor="via-next">VIA NEXT</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Part 1: Daily IT Experience */}
              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Brain className="mr-2 text-blue-500" />
                  🧠 Part 1：日常使用經驗與資料相關困擾
                </h3>
                
                {/* Question 1 - IT Resources */}
                <div className="mb-6">
                  <FormField
                    control={form.control}
                    name="itResources"
                    render={() => (
                      <FormItem>
                        <FormLabel>1. 您在日常工作中最常使用下列哪些 IT 資源？（可複選）</FormLabel>
                        <div className="space-y-3">
                          {[
                            { id: "network", label: "公司內網/WiFi/VPN" },
                            { id: "printer", label: "印表機等設備" },
                            { id: "videoconf", label: "視訊會議工具（如 Teams）" },
                            { id: "login", label: "系統登入與帳號密碼" },
                            { id: "computer", label: "電腦基礎設定" },
                          ].map((item) => (
                            <FormField
                              key={item.id}
                              control={form.control}
                              name="itResources"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={item.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, item.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== item.id
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {item.label}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                          <div className="flex items-center space-x-3">
                            <FormField
                              control={form.control}
                              name="itResources"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes("other")}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, "other"])
                                          : field.onChange(
                                              field.value?.filter((value) => value !== "other")
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">其他：</FormLabel>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="itResourcesOther"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input placeholder="請說明" {...field} className="ml-2" />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Question 2 - IT Problems */}
                <div className="mb-6">
                  <FormField
                    control={form.control}
                    name="itProblems"
                    render={() => (
                      <FormItem>
                        <FormLabel>2. 在使用上述 IT 資源時，您是否曾遇到以下困擾？（可複選）</FormLabel>
                        <div className="space-y-3">
                          {[
                            { id: "network_slow", label: "網速不穩或延遲" },
                            { id: "password", label: "密碼常忘記，重設流程麻煩" },
                            { id: "no_help", label: "找不到人幫忙處理 IT 問題" },
                            { id: "equipment", label: "設備問題（如電腦太舊、印表機難用、螢幕顯示異常）" },
                            { id: "data_loss", label: "曾因設備故障、病毒、勒索軟體或誤操作導致工作資料遺失或無法存取" },
                            { id: "software", label: "軟體應用程式異常或當機 (例如：Outlook、Office、瀏覽器)" },
                            { id: "system_slow", label: "電腦開機異常或系統運行緩慢" },
                            { id: "no_problems", label: "沒有遇過困擾" },
                          ].map((item) => (
                            <FormField
                              key={item.id}
                              control={form.control}
                              name="itProblems"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={item.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, item.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== item.id
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {item.label}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Question 3 - Help Method */}
                <div className="mb-6">
                  <FormField
                    control={form.control}
                    name="helpMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>3. 當您遇到 IT 問題時，您通常：（單選）</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="space-y-3"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="self_google" id="self_google" />
                              <Label htmlFor="self_google">自己Google、AI或問同事</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="it_service" id="it_service" />
                              <Label htmlFor="it_service">看IT service</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="form" id="form" />
                              <Label htmlFor="form">填表單報修</Label>
                              <span className="ml-2 text-sm text-gray-600">
                                （是否知道在哪填？
                                <FormField
                                  control={form.control}
                                  name="formKnowledge"
                                  render={({ field }) => (
                                    <RadioGroup
                                      onValueChange={field.onChange}
                                      value={field.value}
                                      className="inline-flex ml-2 space-x-4"
                                    >
                                      <div className="flex items-center space-x-1">
                                        <RadioGroupItem value="know" id="know" className="h-3 w-3" />
                                        <Label htmlFor="know" className="text-xs">知道</Label>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <RadioGroupItem value="dont_know" id="dont_know" className="h-3 w-3" />
                                        <Label htmlFor="dont_know" className="text-xs">不知道</Label>
                                      </div>
                                    </RadioGroup>
                                  )}
                                />
                                ）
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="call_it" id="call_it" />
                              <Label htmlFor="call_it">打電話找IT 來修</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Questions 4-6 */}
                <div className="space-y-6">
                  {/* Question 4 - Security Confidence */}
                  <FormField
                    control={form.control}
                    name="securityConfidence"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>4. 您對於公司目前在防範網路釣魚、惡意軟體或資料外洩等資安威脅的防護能力，抱持何種看法？（單選）</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="space-y-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="very_confident" id="very_confident" />
                              <Label htmlFor="very_confident">非常有信心，覺得公司資安防護很完善</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="confident" id="confident" />
                              <Label htmlFor="confident">有信心，但偶爾仍會擔心</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="neutral" id="neutral" />
                              <Label htmlFor="neutral">信心一般，覺得有改善空間</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="not_confident" id="not_confident" />
                              <Label htmlFor="not_confident">沒有信心，擔心資安威脅</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="unclear" id="unclear_security" />
                              <Label htmlFor="unclear_security">不清楚</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Question 5 - Remote Access */}
                  <FormField
                    control={form.control}
                    name="remoteAccess"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>5. 您對於目前遠端工作或外部存取公司資源時的資安驗證流程的便利性與安全性感受為何？（單選）</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="space-y-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="convenient_secure" id="convenient_secure" />
                              <Label htmlFor="convenient_secure">非常便利且安全，沒有任何困擾</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="acceptable" id="acceptable" />
                              <Label htmlFor="acceptable">尚可，安全有保障但偶爾感到不便</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="inconvenient" id="inconvenient" />
                              <Label htmlFor="inconvenient">不太便利，流程繁瑣或常出錯</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="security_concern" id="security_concern" />
                              <Label htmlFor="security_concern">擔心安全性不足，操作上有些疑慮</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="unclear_remote" id="unclear_remote" />
                              <Label htmlFor="unclear_remote">不清楚這些流程</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Question 6 - Internal Security */}
                  <FormField
                    control={form.control}
                    name="internalSecurity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>6. 您是否曾擔心公司內部不同部門或個人電腦之間，資料傳輸或存取可能存在未經授權的風險？（單選）</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="space-y-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="often_worried" id="often_worried" />
                              <Label htmlFor="often_worried">經常擔心，覺得內部存取可能不夠安全</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="sometimes_worried" id="sometimes_worried" />
                              <Label htmlFor="sometimes_worried">偶爾會擔心</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="not_worried" id="not_worried" />
                              <Label htmlFor="not_worried">不太擔心，相信公司內部防護良好</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="never_worried" id="never_worried" />
                              <Label htmlFor="never_worried">從未擔心過</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="unclear_internal" id="unclear_internal" />
                              <Label htmlFor="unclear_internal">不清楚</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Part 2: IT Department Expectations */}
              <div className="border-l-4 border-green-500 pl-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Lightbulb className="mr-2 text-green-500" />
                  💡 Part 2：對 IT 部門的期待
                </h3>
                <FormField
                  control={form.control}
                  name="improvements"
                  render={() => (
                    <FormItem>
                      <FormLabel>1. 您最希望 IT 團隊改進哪些方向？（最多選 3 項）</FormLabel>
                      <div className="space-y-3">
                        {[
                          { id: "network_stability", label: "提升網路穩定與速度" },
                          { id: "training", label: "資訊系統使用教學更清楚" },
                          { id: "response_speed", label: "IT問題回應速度更快" },
                          { id: "password_issues", label: "減少密碼登入困擾" },
                          { id: "equipment_upgrade", label: "員工設備汰換/效能提升" },
                          { id: "progress_tracking", label: "有問題時能即時追蹤處理進度" },
                          { id: "backup_restore", label: "提供更可靠的工作資料備份與還原機制" },
                        ].map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="improvements"
                            render={({ field }) => {
                              const currentCount = field.value?.length || 0;
                              const isDisabled = currentCount >= 3 && !field.value?.includes(item.id);
                              
                              return (
                                <FormItem
                                  key={item.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item.id)}
                                      disabled={isDisabled}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, item.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== item.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className={`font-normal ${isDisabled ? "text-muted-foreground" : ""}`}>
                                    {item.label}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Part 3: AI Tools */}
              <div className="border-l-4 border-purple-500 pl-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Laptop className="mr-2 text-purple-500" />
                  💻 Part 3：AI工具與未來技術
                </h3>
                <FormField
                  control={form.control}
                  name="aiOpinion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>1. 您對於未來公司導入AI工具或開發AI相關應用的看法為何？（單選）</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="strongly_support" id="strongly_support" />
                            <Label htmlFor="strongly_support">非常支持，認為能提升工作效率</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="acceptable_ai" id="acceptable_ai" />
                            <Label htmlFor="acceptable_ai">可接受，但需要有明確的應用場景</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="reserved" id="reserved" />
                            <Label htmlFor="reserved">持保留態度，擔心資訊安全或取代人力</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="willing_learn" id="willing_learn" />
                            <Label htmlFor="willing_learn">不了解，但願意學習</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="not_support" id="not_support" />
                            <Label htmlFor="not_support">不支持</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Part 4: Feedback */}
              <div className="border-l-4 border-orange-500 pl-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MessageSquare className="mr-2 text-orange-500" />
                  💬 Part 4：意見與建議
                </h3>
                <FormField
                  control={form.control}
                  name="feedback"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>您對 IT 部門還有什麼建議或期待？（開放填寫）</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="請分享您的寶貴建議..."
                          className="resize-none"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex justify-center">
                  <Button
                    type="submit"
                    disabled={submitMutation.isPending}
                    className="px-8 py-3 bg-primary text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {submitMutation.isPending ? "提交中..." : "提交問卷"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

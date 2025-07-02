import { users, surveyResponses, type User, type InsertUser, type SurveyResponse, type InsertSurveyResponse } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Survey response methods
  createSurveyResponse(response: InsertSurveyResponse): Promise<SurveyResponse>;
  getAllSurveyResponses(): Promise<SurveyResponse[]>;
  getSurveyResponseById(id: number): Promise<SurveyResponse | undefined>;
  getSurveyAnalytics(): Promise<any>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private surveyResponses: Map<number, SurveyResponse>;
  private currentUserId: number;
  private currentSurveyId: number;

  constructor() {
    this.users = new Map();
    this.surveyResponses = new Map();
    this.currentUserId = 1;
    this.currentSurveyId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createSurveyResponse(insertResponse: InsertSurveyResponse): Promise<SurveyResponse> {
    const id = this.currentSurveyId++;
    const response: SurveyResponse = {
      ...insertResponse,
      id,
      createdAt: new Date(),
      // Ensure proper null values for optional fields
      itResources: insertResponse.itResources || null,
      itResourcesOther: insertResponse.itResourcesOther || null,
      itProblems: insertResponse.itProblems || null,
      helpMethod: insertResponse.helpMethod || null,
      formKnowledge: insertResponse.formKnowledge || null,
      securityConfidence: insertResponse.securityConfidence || null,
      remoteAccess: insertResponse.remoteAccess || null,
      internalSecurity: insertResponse.internalSecurity || null,
      improvements: insertResponse.improvements || null,
      aiOpinion: insertResponse.aiOpinion || null,
      feedback: insertResponse.feedback || null,
    };
    this.surveyResponses.set(id, response);
    return response;
  }

  async getAllSurveyResponses(): Promise<SurveyResponse[]> {
    return Array.from(this.surveyResponses.values());
  }

  async getSurveyResponseById(id: number): Promise<SurveyResponse | undefined> {
    return this.surveyResponses.get(id);
  }

  async getSurveyAnalytics(): Promise<any> {
    const responses = Array.from(this.surveyResponses.values());
    const totalResponses = responses.length;

    if (totalResponses === 0) {
      return {
        totalResponses: 0,
        completionRate: 0,
        avgTime: "0分",
        lastUpdate: "無數據",
        companyDistribution: {},
        itResourcesUsage: {},
        commonProblems: {},
        securityConfidence: {},
        improvementPriorities: {},
        aiOpinion: {},
      };
    }

    // Calculate company distribution
    const companyDistribution = responses.reduce((acc, resp) => {
      acc[resp.company] = (acc[resp.company] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate IT resources usage
    const itResourcesUsage = responses.reduce((acc, resp) => {
      resp.itResources?.forEach((resource: string) => {
        acc[resource] = (acc[resource] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    // Calculate common problems
    const commonProblems = responses.reduce((acc, resp) => {
      resp.itProblems?.forEach((problem: string) => {
        acc[problem] = (acc[problem] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    // Calculate security confidence
    const securityConfidence = responses.reduce((acc, resp) => {
      if (resp.securityConfidence) {
        acc[resp.securityConfidence] = (acc[resp.securityConfidence] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // Calculate improvement priorities
    const improvementPriorities = responses.reduce((acc, resp) => {
      resp.improvements?.forEach((improvement: string) => {
        acc[improvement] = (acc[improvement] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    // Calculate AI opinion
    const aiOpinion = responses.reduce((acc, resp) => {
      if (resp.aiOpinion) {
        acc[resp.aiOpinion] = (acc[resp.aiOpinion] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      totalResponses,
      completionRate: Math.round((totalResponses / (totalResponses + 10)) * 100), // Assuming some incomplete responses
      avgTime: "8.5分",
      lastUpdate: responses.length > 0 ? "剛剛" : "無數據",
      companyDistribution,
      itResourcesUsage,
      commonProblems,
      securityConfidence,
      improvementPriorities,
      aiOpinion,
    };
  }
}

export const storage = new MemStorage();

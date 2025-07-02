import { users, type User, type InsertUser, type SurveyResponse, type InsertSurveyResponse } from "@shared/schema";

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

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const { db } = await import("./db");
    const { users } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { db } = await import("./db");
    const { users } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const { db } = await import("./db");
    const { users } = await import("@shared/schema");
    
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createSurveyResponse(response: InsertSurveyResponse): Promise<SurveyResponse> {
    const { db } = await import("./db");
    const { surveyResponses } = await import("@shared/schema");
    
    const [surveyResponse] = await db
      .insert(surveyResponses)
      .values(response)
      .returning();
    return surveyResponse;
  }

  async getAllSurveyResponses(): Promise<SurveyResponse[]> {
    const { db } = await import("./db");
    const { surveyResponses } = await import("@shared/schema");
    
    return await db.select().from(surveyResponses);
  }

  async getSurveyResponseById(id: number): Promise<SurveyResponse | undefined> {
    const { db } = await import("./db");
    const { surveyResponses } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    
    const [response] = await db.select().from(surveyResponses).where(eq(surveyResponses.id, id));
    return response || undefined;
  }

  async getSurveyAnalytics(): Promise<any> {
    const responses = await this.getAllSurveyResponses();
    
    if (responses.length === 0) {
      return {
        totalResponses: 0,
        completionRate: 0,
        avgTime: "0分鐘",
        lastUpdate: new Date().toLocaleString("zh-TW"),
        companyDistribution: {},
        itResourcesUsage: {},
        commonProblems: {},
        securityConfidence: {},
        improvementPriorities: {},
        aiOpinion: {}
      };
    }

    // Company distribution
    const companyDistribution = responses.reduce((acc, response) => {
      const company = response.company || "未知";
      acc[company] = (acc[company] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // IT resources usage
    const itResourcesUsage = responses.reduce((acc, response) => {
      if (response.itResources && Array.isArray(response.itResources)) {
        response.itResources.forEach((resource: string) => {
          acc[resource] = (acc[resource] || 0) + 1;
        });
      }
      return acc;
    }, {} as Record<string, number>);

    // Common problems (using itProblems from schema)
    const commonProblems = responses.reduce((acc, response) => {
      if (response.itProblems && Array.isArray(response.itProblems)) {
        response.itProblems.forEach((problem: string) => {
          acc[problem] = (acc[problem] || 0) + 1;
        });
      }
      return acc;
    }, {} as Record<string, number>);

    // Security confidence
    const securityConfidence = responses.reduce((acc, response) => {
      const confidence = response.securityConfidence || "未知";
      acc[confidence] = (acc[confidence] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Improvement priorities (using improvements from schema)
    const improvementPriorities = responses.reduce((acc, response) => {
      if (response.improvements && Array.isArray(response.improvements)) {
        response.improvements.forEach((priority: string) => {
          acc[priority] = (acc[priority] || 0) + 1;
        });
      }
      return acc;
    }, {} as Record<string, number>);

    // AI opinion
    const aiOpinion = responses.reduce((acc, response) => {
      const opinion = response.aiOpinion || "未知";
      acc[opinion] = (acc[opinion] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalResponses: responses.length,
      completionRate: 100, // Assuming all responses are complete
      avgTime: "5分鐘", // Placeholder average time
      lastUpdate: new Date().toLocaleString("zh-TW"),
      companyDistribution,
      itResourcesUsage,
      commonProblems,
      securityConfidence,
      improvementPriorities,
      aiOpinion
    };
  }
}

export const storage = new DatabaseStorage();
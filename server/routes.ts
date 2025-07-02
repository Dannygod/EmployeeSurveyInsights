import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSurveyResponseSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Survey response routes
  app.post("/api/survey", async (req, res) => {
    try {
      const validatedData = insertSurveyResponseSchema.parse(req.body);
      const response = await storage.createSurveyResponse(validatedData);
      res.json(response);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "驗證失敗", errors: error.errors });
      } else {
        res.status(500).json({ message: "伺服器錯誤" });
      }
    }
  });

  app.get("/api/survey/responses", async (req, res) => {
    try {
      const responses = await storage.getAllSurveyResponses();
      res.json(responses);
    } catch (error) {
      res.status(500).json({ message: "伺服器錯誤" });
    }
  });

  app.get("/api/survey/analytics", async (req, res) => {
    try {
      const analytics = await storage.getSurveyAnalytics();
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "伺服器錯誤" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

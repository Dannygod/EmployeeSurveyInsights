import { pgTable, text, serial, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const surveyResponses = pgTable("survey_responses", {
  id: serial("id").primaryKey(),
  employeeId: text("employee_id").notNull(),
  name: text("name").notNull(),
  company: text("company").notNull(),
  itResources: json("it_resources").$type<string[]>().default([]),
  itResourcesOther: text("it_resources_other"),
  itProblems: json("it_problems").$type<string[]>().default([]),
  helpMethod: text("help_method"),
  formKnowledge: text("form_knowledge"),
  securityConfidence: text("security_confidence"),
  remoteAccess: text("remote_access"),
  internalSecurity: text("internal_security"),
  improvements: json("improvements").$type<string[]>().default([]),
  aiOpinion: text("ai_opinion"),
  feedback: text("feedback"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSurveyResponseSchema = createInsertSchema(surveyResponses).omit({
  id: true,
  createdAt: true,
});

export type InsertSurveyResponse = z.infer<typeof insertSurveyResponseSchema>;
export type SurveyResponse = typeof surveyResponses.$inferSelect;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

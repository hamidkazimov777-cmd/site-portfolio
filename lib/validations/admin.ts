import { z } from "zod";

export const projectStatusSchema = z.enum(["DRAFT", "PUBLISHED"]);
export const skillCategorySchema = z.enum(["PRODUCT", "AI", "DEVELOPMENT", "DESIGN"]);

export const slugSchema = z
  .string()
  .trim()
  .min(1)
  .max(80)
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only");

export const projectCreateSchema = z.object({
  slug: slugSchema,
  title: z.string().trim().min(1).max(150),
  tagline: z.string().trim().min(1).max(300),
  category: z.string().trim().min(1).max(80),
  status: projectStatusSchema.default("DRAFT"),
  order: z.number().int().default(0),
  coverImageUrl: z.string().trim().url().optional().or(z.literal("")).nullable(),
  heroHeadline: z.string().trim().max(150).optional().or(z.literal("")).nullable(),
  heroSubheadline: z.string().trim().max(400).optional().or(z.literal("")).nullable(),
  story: z.string().trim().max(4000).optional().or(z.literal("")).nullable(),
  problem: z.string().trim().max(4000).optional().or(z.literal("")).nullable(),
  solution: z.string().trim().max(4000).optional().or(z.literal("")).nullable(),
  architecture: z.string().trim().max(4000).optional().or(z.literal("")).nullable(),
  results: z.string().trim().max(4000).optional().or(z.literal("")).nullable(),
  technologies: z.array(z.string().trim().min(1)).default([]),
  links: z.record(z.string(), z.string()).optional().nullable(),
  seoTitle: z.string().trim().max(150).optional().or(z.literal("")).nullable(),
  seoDescription: z.string().trim().max(300).optional().or(z.literal("")).nullable(),
  ogImageUrl: z.string().trim().url().optional().or(z.literal("")).nullable(),
});

export const projectUpdateSchema = projectCreateSchema.partial();

export const projectImageCreateSchema = z.object({
  url: z.string().trim().url(),
  alt: z.string().trim().max(200).default(""),
  caption: z.string().trim().max(300).optional().or(z.literal("")).nullable(),
  order: z.number().int().default(0),
});

export const skillCreateSchema = z.object({
  category: skillCategorySchema,
  name: z.string().trim().min(1).max(80),
  order: z.number().int().default(0),
});

export const skillUpdateSchema = skillCreateSchema.partial();

export const experienceCreateSchema = z.object({
  role: z.string().trim().min(1).max(150),
  company: z.string().trim().max(150).optional().or(z.literal("")).nullable(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional().nullable(),
  isCurrent: z.boolean().default(false),
  description: z.string().trim().max(2000).optional().or(z.literal("")).nullable(),
  order: z.number().int().default(0),
});

export const experienceUpdateSchema = experienceCreateSchema.partial();

export const settingsUpdateSchema = z.object({
  fullName: z.string().trim().min(1).max(150).optional(),
  role: z.string().trim().min(1).max(150).optional(),
  tagline: z.string().trim().min(1).max(300).optional(),
  aboutBody: z.string().trim().max(6000).optional().or(z.literal("")).nullable(),
  avatarUrl: z.string().trim().url().optional().or(z.literal("")).nullable(),
  email: z.string().trim().email().optional().or(z.literal("")).nullable(),
  phonePrimary: z.string().trim().max(40).optional().or(z.literal("")).nullable(),
  phoneSecondary: z.string().trim().max(40).optional().or(z.literal("")).nullable(),
  linkedinUrl: z.string().trim().url().optional().or(z.literal("")).nullable(),
  githubUrl: z.string().trim().url().optional().or(z.literal("")).nullable(),
  websiteUrl: z.string().trim().url().optional().or(z.literal("")).nullable(),
  seoTitle: z.string().trim().max(150).optional().or(z.literal("")).nullable(),
  seoDescription: z.string().trim().max(300).optional().or(z.literal("")).nullable(),
  ogImageUrl: z.string().trim().url().optional().or(z.literal("")).nullable(),
  twitterHandle: z.string().trim().max(80).optional().or(z.literal("")).nullable(),
  schemaJsonLd: z.unknown().optional().nullable(),
});

import { z } from 'zod';

const text = (label: string, max = 500) => z.string().trim().min(1, `${label} is required`).max(max);

export const registerSchema = z.object({
  username: text('Username', 50).regex(/^[a-zA-Z0-9_-]+$/, 'Username contains invalid characters'),
  email: z.string().trim().email().max(254),
  name: text('Name', 100),
  password: z.string().min(8).max(128),
  specialization: z.enum(['Explorer', 'Culture Guardian', 'Heritage Custodian', 'Temple Historian', 'AR Architect']).optional().default('Explorer'),
}).strict();

export const loginSchema = z.object({
  identifier: text('Username or email', 254),
  password: z.string().min(1).max(128),
}).strict();

export const profileSchema = z.object({
  name: text('Name', 100).optional(),
  avatar: z.string().url().max(2048).nullable().optional(),
  specialization: z.enum(['Explorer', 'Culture Guardian', 'Heritage Custodian', 'Temple Historian', 'AR Architect']).optional(),
}).strict().refine((value) => value.name !== undefined || value.avatar !== undefined || value.specialization !== undefined, {
  message: 'At least one profile field is required',
});

export const storySchema = z.object({
  title: text('Title', 200),
  shortStory: text('Story', 2000),
  fullStory: z.string().trim().max(10000).optional(),
  category: text('Category', 50),
  region: text('Region', 100),
  state: text('State', 100),
  preservedBy: z.string().trim().max(100).optional(),
  date: z.string().trim().max(100).optional(),
  mediaType: z.enum(['audio', 'video', 'photo', 'written', 'recipe']).optional(),
  image: z.string().url().max(2048).optional(),
  audioUrl: z.string().url().max(2048).optional(),
  videoUrl: z.string().url().max(2048).optional(),
  recipeIngredients: z.array(text('Ingredient', 200)).max(100).optional(),
}).strict();

export const adoptionUpdateSchema = z.object({
  completedTasks: z.array(text('Task ID', 100)).max(100),
  status: z.enum(['ACTIVE', 'COMPLETED']).optional(),
}).strict();

export const moderationSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
  note: z.string().trim().max(1000).optional(),
}).strict();

export const monumentSubmissionSchema = z.object({
  id: z.string().trim().regex(/^[a-z0-9-]+$/).max(100).optional(),
  name: text('Name', 200),
  hindiName: z.string().trim().max(200).optional(),
  location: text('Location', 200),
  state: text('State', 100),
  region: text('Region', 100),
  period: text('Period', 100),
  dynasty: text('Dynasty', 150),
  builtYear: z.coerce.number().int().min(-5000).max(new Date().getFullYear()),
  shortDescription: text('Short description', 1000),
  fullHistory: text('Full history', 20000),
}).strict();

export function parseBody<T>(schema: z.ZodSchema<T>, body: unknown): { data?: T; error?: string } {
  const result = schema.safeParse(body);
  if (result.success) return { data: result.data };
  return { error: result.error.issues.map((issue) => issue.message).join('; ') };
}

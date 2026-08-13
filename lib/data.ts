import { randomUUID } from "crypto";
import { neon } from "@neondatabase/serverless";
import type {
  Project,
  ProjectImage,
  Skill,
  Experience,
  SiteSettings,
} from "@prisma/client";

type ProjectWithImages = Project & { images: ProjectImage[] };

function getSql() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set");
  return neon(connectionString);
}

function toDate<T>(row: T, keys: (keyof T)[]): T {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "string") {
      row[key] = new Date(value) as unknown as T[keyof T];
    }
  }
  return row;
}

// ---------------------------------------------------------------- Settings

const SETTINGS_COLUMNS = `
  id, "fullName", role, tagline, "aboutBody", "avatarUrl",
  email, "phonePrimary", "phoneSecondary", "linkedinUrl", "githubUrl", "websiteUrl",
  "seoTitle", "seoDescription", "ogImageUrl", "twitterHandle", "schemaJsonLd", "updatedAt"
`;

export async function fetchSettings(): Promise<SiteSettings | null> {
  const sql = getSql();
  const rows = (await sql.query(
    `SELECT ${SETTINGS_COLUMNS} FROM site_settings WHERE id = 'singleton' LIMIT 1`,
  )) as SiteSettings[];
  if (!rows[0]) return null;
  return toDate(rows[0], ["updatedAt"]);
}

// ---------------------------------------------------------------- Projects

const PROJECT_COLUMNS = `
  id, slug, title, tagline, category, status, "order", "coverImageUrl",
  "heroHeadline", "heroSubheadline", story, problem, solution, architecture, results,
  technologies, links, "seoTitle", "seoDescription", "ogImageUrl", "createdAt", "updatedAt"
`;

const IMAGE_COLUMNS = `id, "projectId", url, alt, caption, "order", "createdAt"`;

function normalizeProject(row: Project): Project {
  return toDate(row, ["createdAt", "updatedAt"]);
}

export async function fetchPublishedProjects(): Promise<Project[]> {
  const sql = getSql();
  const rows = (await sql.query(
    `SELECT ${PROJECT_COLUMNS} FROM projects WHERE status = 'PUBLISHED' ORDER BY "order" ASC`,
  )) as Project[];
  return rows.map(normalizeProject);
}

export async function fetchPublishedProjectBySlug(
  slug: string,
): Promise<ProjectWithImages | null> {
  const sql = getSql();
  const rows = (await sql.query(
    `SELECT ${PROJECT_COLUMNS} FROM projects WHERE slug = $1 AND status = 'PUBLISHED' LIMIT 1`,
    [slug],
  )) as Project[];
  if (!rows[0]) return null;
  const project = normalizeProject(rows[0]);
  const images = (await sql.query(
    `SELECT ${IMAGE_COLUMNS} FROM project_images WHERE "projectId" = $1 ORDER BY "order" ASC`,
    [project.id],
  )) as ProjectImage[];
  images.forEach((img) => toDate(img, ["createdAt"]));
  return { ...project, images };
}

export async function fetchPublishedSlugs(): Promise<string[]> {
  const sql = getSql();
  const rows = (await sql.query(
    `SELECT slug FROM projects WHERE status = 'PUBLISHED'`,
  )) as { slug: string }[];
  return rows.map((r) => r.slug);
}

// ------------------------------------------------------------------- Skills

export async function fetchSkills(): Promise<Skill[]> {
  const sql = getSql();
  const rows = (await sql.query(
    `SELECT id, category, name, "order", "createdAt", "updatedAt"
     FROM skills ORDER BY category ASC, "order" ASC`,
  )) as Skill[];
  return rows.map((r) => toDate(r, ["createdAt", "updatedAt"]));
}

// --------------------------------------------------------------- Experience

export async function fetchExperience(): Promise<Experience[]> {
  const sql = getSql();
  const rows = (await sql.query(
    `SELECT id, role, company, "startDate", "endDate", "isCurrent", description, "order", "createdAt", "updatedAt"
     FROM experience ORDER BY "order" ASC`,
  )) as Experience[];
  return rows.map((r) => toDate(r, ["startDate", "endDate", "createdAt", "updatedAt"]));
}

// ----------------------------------------------------------------- Contact

export async function createMessage(input: {
  name: string;
  email: string;
  message: string;
}): Promise<{ id: string }> {
  const sql = getSql();
  const id = randomUUID();
  await sql.query(
    `INSERT INTO contacts (id, name, email, message, read, "createdAt")
     VALUES ($1,$2,$3,$4,false, now())`,
    [id, input.name, input.email, input.message],
  );
  return { id };
}

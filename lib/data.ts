import { randomUUID } from "crypto";
import { neon } from "@neondatabase/serverless";
import type {
  Project,
  ProjectImage,
  Skill,
  Experience,
  SiteSettings,
  Contact,
} from "@prisma/client";
import { translateFields, isTranslationConfigured } from "@/lib/translate";

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
  "seoTitle", "seoDescription", "ogImageUrl", "twitterHandle", "schemaJsonLd", translations, "updatedAt"
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
  technologies, links, "seoTitle", "seoDescription", "ogImageUrl", translations, "createdAt", "updatedAt"
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
    `SELECT id, role, company, "startDate", "endDate", "isCurrent", description, "order", translations, "createdAt", "updatedAt"
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

/* ========================================================================
 * Admin data layer — same Neon HTTP driver, so it runs on Cloudflare
 * Workers as well as locally. Prisma is used only for migrations/seeding.
 * ===================================================================== */

const JSON_COLUMNS = new Set(["links", "schemaJsonLd", "translations"]);
const ARRAY_COLUMNS = new Set(["technologies"]);

type Row = Record<string, unknown>;

/**
 * Translates a record's translatable text fields to RU/ES via DeepL and
 * persists the result in its `translations` jsonb column. Best-effort: on any
 * failure the English record is kept and translations are simply skipped.
 */
async function storeTranslations(
  table: "projects" | "experience" | "site_settings",
  id: string,
  fields: Record<string, string | null | undefined>,
): Promise<Record<string, unknown> | null> {
  if (!isTranslationConfigured()) return null;
  try {
    const translations = await translateFields(fields);
    const sql = getSql();
    await sql.query(
      `UPDATE ${table} SET translations = $1::jsonb WHERE id = $2`,
      [JSON.stringify(translations), id],
    );
    return translations;
  } catch (error) {
    console.error(`Translation failed for ${table} ${id}:`, error);
    return null;
  }
}


function normalizeValue(value: unknown): unknown {
  if (value instanceof Date) return value.toISOString();
  return value;
}

/**
 * Builds a dynamic `SET` clause for the given fields, handling jsonb, text[]
 * and Date columns. Returns the clause fragments and the bound params, with
 * placeholder numbering starting at `startIndex`.
 */
function buildAssignments(data: Row, startIndex = 1) {
  const clauses: string[] = [];
  const params: unknown[] = [];
  let i = startIndex;

  for (const [key, rawValue] of Object.entries(data)) {
    if (rawValue === undefined) continue;

    if (JSON_COLUMNS.has(key)) {
      clauses.push(`"${key}" = $${i}::jsonb`);
      params.push(rawValue === null ? null : JSON.stringify(rawValue));
      i++;
    } else if (ARRAY_COLUMNS.has(key)) {
      const arr = (rawValue as string[]) ?? [];
      if (arr.length === 0) {
        clauses.push(`"${key}" = ARRAY[]::text[]`);
      } else {
        const placeholders = arr.map(() => `$${i++}`);
        clauses.push(`"${key}" = ARRAY[${placeholders.join(",")}]::text[]`);
        params.push(...arr);
      }
    } else {
      clauses.push(`"${key}" = $${i}`);
      params.push(normalizeValue(rawValue));
      i++;
    }
  }

  return { clauses, params, nextIndex: i };
}

// -------------------------------------------------------------- Dashboard

export async function getDashboardStats() {
  const sql = getSql();
  const rows = (await sql.query(`
    SELECT
      (SELECT count(*) FROM projects)::int AS "projectCount",
      (SELECT count(*) FROM projects WHERE status = 'PUBLISHED')::int AS "publishedCount",
      (SELECT count(*) FROM skills)::int AS "skillCount",
      (SELECT count(*) FROM experience)::int AS "experienceCount",
      (SELECT count(*) FROM contacts)::int AS "messageCount",
      (SELECT count(*) FROM contacts WHERE read = false)::int AS "unreadCount"
  `)) as Record<string, number>[];
  return rows[0];
}

export async function fetchRecentMessages(limit = 5): Promise<Contact[]> {
  const sql = getSql();
  const rows = (await sql.query(
    `SELECT id, name, email, message, read, "createdAt"
     FROM contacts ORDER BY "createdAt" DESC LIMIT $1`,
    [limit],
  )) as Contact[];
  return rows.map((r) => toDate(r, ["createdAt"]));
}

// ------------------------------------------------------------ Projects (admin)

export async function fetchAllProjects(): Promise<ProjectWithImages[]> {
  const sql = getSql();
  const projects = (await sql.query(
    `SELECT ${PROJECT_COLUMNS} FROM projects ORDER BY "order" ASC`,
  )) as Project[];
  const images = (await sql.query(
    `SELECT ${IMAGE_COLUMNS} FROM project_images ORDER BY "order" ASC`,
  )) as ProjectImage[];
  images.forEach((img) => toDate(img, ["createdAt"]));
  return projects.map((p) => ({
    ...normalizeProject(p),
    images: images.filter((img) => img.projectId === p.id),
  }));
}

export async function fetchProjectById(
  id: string,
): Promise<ProjectWithImages | null> {
  const sql = getSql();
  const rows = (await sql.query(
    `SELECT ${PROJECT_COLUMNS} FROM projects WHERE id = $1 LIMIT 1`,
    [id],
  )) as Project[];
  if (!rows[0]) return null;
  const project = normalizeProject(rows[0]);
  const images = (await sql.query(
    `SELECT ${IMAGE_COLUMNS} FROM project_images WHERE "projectId" = $1 ORDER BY "order" ASC`,
    [id],
  )) as ProjectImage[];
  images.forEach((img) => toDate(img, ["createdAt"]));
  return { ...project, images };
}

export async function projectSlugExists(
  slug: string,
  excludeId?: string,
): Promise<boolean> {
  const sql = getSql();
  const rows = excludeId
    ? ((await sql.query(
        `SELECT 1 FROM projects WHERE slug = $1 AND id <> $2 LIMIT 1`,
        [slug, excludeId],
      )) as unknown[])
    : ((await sql.query(`SELECT 1 FROM projects WHERE slug = $1 LIMIT 1`, [
        slug,
      ])) as unknown[]);
  return rows.length > 0;
}

export async function createProject(data: Row): Promise<Project> {
  const sql = getSql();
  const id = randomUUID();
  const record: Row = {
    id,
    slug: data.slug,
    title: data.title,
    tagline: data.tagline,
    category: data.category,
    status: data.status ?? "DRAFT",
    order: data.order ?? 0,
    coverImageUrl: data.coverImageUrl ?? null,
    heroHeadline: data.heroHeadline ?? null,
    heroSubheadline: data.heroSubheadline ?? null,
    story: data.story ?? null,
    problem: data.problem ?? null,
    solution: data.solution ?? null,
    architecture: data.architecture ?? null,
    results: data.results ?? null,
    technologies: data.technologies ?? [],
    links: data.links ?? null,
    seoTitle: data.seoTitle ?? null,
    seoDescription: data.seoDescription ?? null,
    ogImageUrl: data.ogImageUrl ?? null,
  };

  const cols: string[] = [];
  const values: string[] = [];
  const params: unknown[] = [];
  let i = 1;
  for (const [key, value] of Object.entries(record)) {
    cols.push(`"${key}"`);
    if (JSON_COLUMNS.has(key)) {
      values.push(`$${i}::jsonb`);
      params.push(value === null ? null : JSON.stringify(value));
      i++;
    } else if (ARRAY_COLUMNS.has(key)) {
      const arr = (value as string[]) ?? [];
      if (arr.length === 0) {
        values.push(`ARRAY[]::text[]`);
      } else {
        const ph = arr.map(() => `$${i++}`);
        values.push(`ARRAY[${ph.join(",")}]::text[]`);
        params.push(...arr);
      }
    } else {
      values.push(`$${i}`);
      params.push(normalizeValue(value));
      i++;
    }
  }

  const rows = (await sql.query(
    `INSERT INTO projects (${cols.join(",")}, "createdAt", "updatedAt")
     VALUES (${values.join(",")}, now(), now())
     RETURNING ${PROJECT_COLUMNS}`,
    params,
  )) as Project[];
  const project = normalizeProject(rows[0]);
  const translations = await storeTranslations("projects", project.id, {
    category: project.category,
    tagline: project.tagline,
    heroSubheadline: project.heroSubheadline,
    story: project.story,
    problem: project.problem,
    solution: project.solution,
    architecture: project.architecture,
    results: project.results,
  });
  return { ...project, translations: (translations ?? project.translations) as Project["translations"] };
}

export async function updateProject(id: string, data: Row): Promise<Project> {
  const sql = getSql();
  const { clauses, params, nextIndex } = buildAssignments(data);
  clauses.push(`"updatedAt" = now()`);
  params.push(id);
  const rows = (await sql.query(
    `UPDATE projects SET ${clauses.join(",")} WHERE id = $${nextIndex}
     RETURNING ${PROJECT_COLUMNS}`,
    params,
  )) as Project[];
  const project = normalizeProject(rows[0]);
  // Regenerate translations from the full current content so all languages
  // stay consistent, even if only one field changed.
  const translations = await storeTranslations("projects", project.id, {
    category: project.category,
    tagline: project.tagline,
    heroSubheadline: project.heroSubheadline,
    story: project.story,
    problem: project.problem,
    solution: project.solution,
    architecture: project.architecture,
    results: project.results,
  });
  return { ...project, translations: (translations ?? project.translations) as Project["translations"] };
}

export async function deleteProject(id: string): Promise<void> {
  const sql = getSql();
  await sql.query(`DELETE FROM projects WHERE id = $1`, [id]);
}

// ------------------------------------------------------------ Project images

export async function createProjectImage(
  projectId: string,
  data: { url: string; alt?: string; caption?: string | null; order?: number },
): Promise<ProjectImage> {
  const sql = getSql();
  const id = randomUUID();
  const rows = (await sql.query(
    `INSERT INTO project_images (id, "projectId", url, alt, caption, "order", "createdAt")
     VALUES ($1,$2,$3,$4,$5,$6, now())
     RETURNING ${IMAGE_COLUMNS}`,
    [id, projectId, data.url, data.alt ?? "", data.caption ?? null, data.order ?? 0],
  )) as ProjectImage[];
  return toDate(rows[0], ["createdAt"]);
}

export async function deleteProjectImage(
  projectId: string,
  imageId: string,
): Promise<void> {
  const sql = getSql();
  await sql.query(
    `DELETE FROM project_images WHERE id = $1 AND "projectId" = $2`,
    [imageId, projectId],
  );
}

// --------------------------------------------------------------- Skills (admin)

export async function fetchAllSkills(): Promise<Skill[]> {
  return fetchSkills();
}

export async function createSkill(data: {
  category: string;
  name: string;
  order?: number;
}): Promise<Skill> {
  const sql = getSql();
  const id = randomUUID();
  const rows = (await sql.query(
    `INSERT INTO skills (id, category, name, "order", "createdAt", "updatedAt")
     VALUES ($1,$2::"SkillCategory",$3,$4, now(), now())
     RETURNING id, category, name, "order", "createdAt", "updatedAt"`,
    [id, data.category, data.name, data.order ?? 0],
  )) as Skill[];
  return toDate(rows[0], ["createdAt", "updatedAt"]);
}

export async function updateSkill(id: string, data: Row): Promise<Skill> {
  const sql = getSql();
  const patch: Row = { ...data };
  // category is an enum column; cast handled inline below
  const clauses: string[] = [];
  const params: unknown[] = [];
  let i = 1;
  if (patch.category !== undefined) {
    clauses.push(`category = $${i}::"SkillCategory"`);
    params.push(patch.category);
    i++;
    delete patch.category;
  }
  const rest = buildAssignments(patch, i);
  clauses.push(...rest.clauses);
  params.push(...rest.params);
  clauses.push(`"updatedAt" = now()`);
  params.push(id);
  const rows = (await sql.query(
    `UPDATE skills SET ${clauses.join(",")} WHERE id = $${rest.nextIndex}
     RETURNING id, category, name, "order", "createdAt", "updatedAt"`,
    params,
  )) as Skill[];
  return toDate(rows[0], ["createdAt", "updatedAt"]);
}

export async function deleteSkill(id: string): Promise<void> {
  const sql = getSql();
  await sql.query(`DELETE FROM skills WHERE id = $1`, [id]);
}

// ----------------------------------------------------------- Experience (admin)

export async function fetchAllExperience(): Promise<Experience[]> {
  return fetchExperience();
}

const EXPERIENCE_COLUMNS = `id, role, company, "startDate", "endDate", "isCurrent", description, "order", translations, "createdAt", "updatedAt"`;

export async function createExperience(data: Row): Promise<Experience> {
  const sql = getSql();
  const id = randomUUID();
  const rows = (await sql.query(
    `INSERT INTO experience (id, role, company, "startDate", "endDate", "isCurrent", description, "order", "createdAt", "updatedAt")
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8, now(), now())
     RETURNING ${EXPERIENCE_COLUMNS}`,
    [
      id,
      data.role,
      data.company ?? null,
      normalizeValue(data.startDate),
      data.endDate ? normalizeValue(data.endDate) : null,
      data.isCurrent ?? false,
      data.description ?? null,
      data.order ?? 0,
    ],
  )) as Experience[];
  const exp = toDate(rows[0], ["startDate", "endDate", "createdAt", "updatedAt"]);
  const translations = await storeTranslations("experience", exp.id, {
    role: exp.role,
    description: exp.description,
  });
  return { ...exp, translations: (translations ?? exp.translations) as Experience["translations"] };
}

export async function updateExperience(id: string, data: Row): Promise<Experience> {
  const sql = getSql();
  const { clauses, params, nextIndex } = buildAssignments(data);
  clauses.push(`"updatedAt" = now()`);
  params.push(id);
  const rows = (await sql.query(
    `UPDATE experience SET ${clauses.join(",")} WHERE id = $${nextIndex}
     RETURNING ${EXPERIENCE_COLUMNS}`,
    params,
  )) as Experience[];
  const exp = toDate(rows[0], ["startDate", "endDate", "createdAt", "updatedAt"]);
  const translations = await storeTranslations("experience", exp.id, {
    role: exp.role,
    description: exp.description,
  });
  return { ...exp, translations: (translations ?? exp.translations) as Experience["translations"] };
}

export async function deleteExperience(id: string): Promise<void> {
  const sql = getSql();
  await sql.query(`DELETE FROM experience WHERE id = $1`, [id]);
}

// --------------------------------------------------------------- Settings (admin)

export async function upsertSettings(data: Row): Promise<SiteSettings> {
  const sql = getSql();
  // Ensure the singleton row exists, then patch it.
  await sql.query(
    `INSERT INTO site_settings (id, "updatedAt") VALUES ('singleton', now())
     ON CONFLICT (id) DO NOTHING`,
  );
  const entries = Object.entries(data).filter(([, v]) => v !== undefined);
  if (entries.length === 0) {
    const settings = await fetchSettings();
    return settings as SiteSettings;
  }
  const { clauses, params, nextIndex } = buildAssignments(
    Object.fromEntries(entries),
  );
  clauses.push(`"updatedAt" = now()`);
  params.push("singleton");
  const rows = (await sql.query(
    `UPDATE site_settings SET ${clauses.join(",")} WHERE id = $${nextIndex}
     RETURNING ${SETTINGS_COLUMNS}`,
    params,
  )) as SiteSettings[];
  const settings = toDate(rows[0], ["updatedAt"]);
  // Only re-translate when a translatable field was part of the update.
  const touched = ["role", "tagline", "aboutBody"].some(
    (k) => k in data,
  );
  if (touched) {
    const translations = await storeTranslations("site_settings", "singleton", {
      role: settings.role,
      tagline: settings.tagline,
      aboutBody: settings.aboutBody,
    });
    if (translations) return { ...settings, translations: translations as SiteSettings["translations"] };
  }
  return settings;
}

// --------------------------------------------------------------- Messages (admin)

export async function fetchAllMessages(): Promise<Contact[]> {
  const sql = getSql();
  const rows = (await sql.query(
    `SELECT id, name, email, message, read, "createdAt"
     FROM contacts ORDER BY "createdAt" DESC`,
  )) as Contact[];
  return rows.map((r) => toDate(r, ["createdAt"]));
}

export async function updateMessageRead(
  id: string,
  read: boolean,
): Promise<Contact> {
  const sql = getSql();
  const rows = (await sql.query(
    `UPDATE contacts SET read = $1 WHERE id = $2
     RETURNING id, name, email, message, read, "createdAt"`,
    [read, id],
  )) as Contact[];
  return toDate(rows[0], ["createdAt"]);
}

export async function deleteMessage(id: string): Promise<void> {
  const sql = getSql();
  await sql.query(`DELETE FROM contacts WHERE id = $1`, [id]);
}

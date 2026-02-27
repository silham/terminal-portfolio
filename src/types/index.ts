// ─────────────────────────────────────────────────────────────────────────────
// Tab navigation
// ─────────────────────────────────────────────────────────────────────────────

export type TabId = 1 | 2 | 3 | 4 | 5;

export interface Tab {
  id: TabId;
  label: string;
  path: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Articles
// ─────────────────────────────────────────────────────────────────────────────

/** One inline run of text, optionally wrapped in an anchor. */
export interface ArticleSegment {
  text: string;
  href?: string;
}

/** A paragraph is an ordered list of segments (text + optional links). */
export type ArticleParagraph = ArticleSegment[];

export interface Article {
  id: string;
  slug: string;
  date: string;
  title: string;
  comments: number;
  category: string;
  author: string;
  wordCount: number;
  content: ArticleParagraph[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Projects
// ─────────────────────────────────────────────────────────────────────────────

export interface Project {
  id: string;
  slug: string;
  date: string;
  title: string;
  technology: string;
  excerpt: string;
  /** Optional preview image path relative to /public */
  image?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Skills
// ─────────────────────────────────────────────────────────────────────────────

export interface Skill {
  name: string;
  excerpt: string;
}

export interface SkillCategory {
  id: string;
  label: string;
  description: string;
  skills: Skill[];
}

// ────────────────────────────────────────────────────────────────────────────
// Certificates
// ────────────────────────────────────────────────────────────────────────────

export interface Certificate {
  id: string;
  slug: string;
  date: string;
  title: string;
  topic: string;
  issuer: string;
  issuerUrl?: string;
  technology: string;
  excerpt: string;
  image?: string;
}

export type Severity   = 'high' | 'medium' | 'low';
export type LoopHealth = 'strong' | 'weak' | 'broken' | 'absent';
export type Effort     = 'low' | 'medium' | 'high';

export interface AuditFinding {
  title:           string;
  detail:          string;
  severity:        Severity;
  impact?:         string;
  recommendation?: string;
}

export interface AuditDimension {
  score:    number;
  findings: AuditFinding[];
}

export interface LoopNode {
  label:  string;
  health: LoopHealth;
}

export interface GrowthLoop {
  name:           string;
  nodes:          LoopNode[];
  breakPoint?:    string;
  recommendation: string;
}

export interface MagicMoment {
  userType:       string;
  moment:         string;
  currentPath:    string;
  friction:       string;
  recommendation: string;
}

export interface RoadmapItem {
  title:   string;
  detail:  string;
  effort?: Effort;
}

export interface FurtherReading {
  title: string;
  why:   string;
  url:   string;
}

export interface StitchPrompt {
  target:      string;
  description: string;
  prompt:      string;
}

export interface PageSpeedData {
  performance?:   number | null;
  seo?:           number | null;
  accessibility?: number | null;
  bestPractices?: number | null;
  lcp?:  number | null;
  fcp?:  number | null;
  ttfb?: number | null;
  cls?:  number | null;
  fid?:  number | null;
  opportunities?: Array<{ title: string; savings: number }>;
  assessment?: 'passed' | 'failed' | 'unknown';
}

export interface AuditDimensions {
  social:      AuditDimension;
  paidMedia:   AuditDimension;
  acquisition: AuditDimension;
  messaging:   AuditDimension;
  conversion:  AuditDimension;
  appStore:    AuditDimension;
  activation:  AuditDimension;
  reputation:  AuditDimension;
  retention:   AuditDimension;
  tracking:    AuditDimension;
  technical:   AuditDimension;
  growthLoop:  AuditDimension;
}

export interface AuditResult {
  id:          string;
  url:         string;
  siteName:    string;
  slug:        string;
  createdAt:   string;
  focus:       string;

  overallScore: number;
  overallLabel: string;
  tagline:      string;

  intelligenceBanner: string;
  execSummary:        string;
  patricksPOV:        string;

  dimensions:   AuditDimensions;
  growthLoops:  GrowthLoop[];
  magicMoments: MagicMoment[];

  roadmap: {
    week1:    RoadmapItem[];
    month1:   RoadmapItem[];
    quarter1: RoadmapItem[];
  };

  furtherReading: FurtherReading[];
  stitchPrompts:  StitchPrompt[];
  pageSpeed?:     PageSpeedData;
  published?:     boolean;
}

export interface IntelligenceContext {
  siteOverview:   string;
  socialProfiles: string;
  paidAds:        string;
  appStore:       string;
  reputation:     string;
  competitors:    string;
}

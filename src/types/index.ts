export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface ScamAnalysisResult {
  risk_score: number;
  risk_level: RiskLevel;
  signals: string[];
  explanation: string;
  advice: string;
  model_used?: string;
  provider?: string;
  latency_ms?: number;
}

export interface ExampleMessage {
  id: string;
  title: string;
  tag: string;
  preview: string;
  content: string;
  risk: RiskLevel;
}

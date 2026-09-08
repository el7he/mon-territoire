// src/domain/risks.types.ts

export interface RiskItem {
  id: string;
  type: string;
  description: string;
}

export interface RiskSummary {
  inseeCode: string;
  risks: RiskItem[];
}
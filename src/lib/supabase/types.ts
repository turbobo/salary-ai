export interface Calculation {
  id: string;
  user_id: string;
  name: string | null;
  city: string;
  global_params: Record<string, unknown>;
  monthly_data: Record<string, unknown>;
  enabled_months: Record<string, boolean>;
  annual_bonus: number;
  bonus_month: number;
  bonus_tax_method: string;
  special_deduction: number;
  total_gross: number | null;
  total_net: number | null;
  total_tax: number | null;
  created_at: string;
  updated_at: string;
}

export interface SocialInsuranceItem {
  rate: number;
  min: number;
  max: number;
  addition?: number;
}

export interface CityPreset {
  name: string;
  year: number | null;
  socialInsurance: {
    pension: SocialInsuranceItem;
    medical: SocialInsuranceItem;
    unemployment: SocialInsuranceItem;
  };
  housingFund: {
    rateMin: number;
    rateMax: number;
    min: number;
    max: number;
  };
  taxThreshold: number;
}

export interface TaxBracket {
  min: number;
  max: number;
  rate: number;
  deduction: number;
}

export const CITY_PRESETS: Record<string, CityPreset> = {
  beijing: {
    name: '北京', year: 2024,
    socialInsurance: {
      pension: { rate: 8, min: 6326, max: 35283 },
      medical: { rate: 2, addition: 3, min: 6326, max: 35283 },
      unemployment: { rate: 0.5, min: 6326, max: 35283 },
    },
    housingFund: { rateMin: 5, rateMax: 12, min: 2420, max: 35283 },
    taxThreshold: 5000,
  },
  shanghai: {
    name: '上海', year: 2024,
    socialInsurance: {
      pension: { rate: 8, min: 7384, max: 36921 },
      medical: { rate: 2, addition: 0, min: 7384, max: 36921 },
      unemployment: { rate: 0.5, min: 7384, max: 36921 },
    },
    housingFund: { rateMin: 5, rateMax: 12, min: 2690, max: 36921 },
    taxThreshold: 5000,
  },
  guangzhou: {
    name: '广州', year: 2024,
    socialInsurance: {
      pension: { rate: 8, min: 5284, max: 27501 },
      medical: { rate: 2, addition: 0, min: 5284, max: 27501 },
      unemployment: { rate: 0.2, min: 5284, max: 27501 },
    },
    housingFund: { rateMin: 5, rateMax: 12, min: 2300, max: 41535 },
    taxThreshold: 5000,
  },
  shenzhen: {
    name: '深圳', year: 2024,
    socialInsurance: {
      pension: { rate: 8, min: 2360, max: 27927 },
      medical: { rate: 2, addition: 0, min: 2360, max: 27927 },
      unemployment: { rate: 0.3, min: 2360, max: 27927 },
    },
    housingFund: { rateMin: 5, rateMax: 12, min: 2360, max: 41190 },
    taxThreshold: 5000,
  },
  hangzhou: {
    name: '杭州', year: 2024,
    socialInsurance: {
      pension: { rate: 8, min: 4812, max: 27216 },
      medical: { rate: 2, addition: 0, min: 4812, max: 27216 },
      unemployment: { rate: 0.5, min: 4812, max: 27216 },
    },
    housingFund: { rateMin: 5, rateMax: 12, min: 2280, max: 39852 },
    taxThreshold: 5000,
  },
  chengdu: {
    name: '成都', year: 2024,
    socialInsurance: {
      pension: { rate: 8, min: 4246, max: 23826 },
      medical: { rate: 2, addition: 0, min: 4246, max: 23826 },
      unemployment: { rate: 0.4, min: 4246, max: 23826 },
    },
    housingFund: { rateMin: 5, rateMax: 12, min: 2280, max: 32580 },
    taxThreshold: 5000,
  },
  custom: {
    name: '自定义', year: null,
    socialInsurance: {
      pension: { rate: 8, min: 0, max: 99999 },
      medical: { rate: 2, addition: 0, min: 0, max: 99999 },
      unemployment: { rate: 0.5, min: 0, max: 99999 },
    },
    housingFund: { rateMin: 5, rateMax: 12, min: 0, max: 99999 },
    taxThreshold: 5000,
  },
};

export const TAX_BRACKETS: TaxBracket[] = [
  { min: 0, max: 36000, rate: 0.03, deduction: 0 },
  { min: 36000, max: 144000, rate: 0.10, deduction: 2520 },
  { min: 144000, max: 300000, rate: 0.20, deduction: 16920 },
  { min: 300000, max: 420000, rate: 0.25, deduction: 31920 },
  { min: 420000, max: 660000, rate: 0.30, deduction: 52920 },
  { min: 660000, max: 960000, rate: 0.35, deduction: 85920 },
  { min: 960000, max: Infinity, rate: 0.45, deduction: 181920 },
];

export const BONUS_TAX_BRACKETS: TaxBracket[] = [
  { min: 0, max: 3000, rate: 0.03, deduction: 0 },
  { min: 3000, max: 12000, rate: 0.10, deduction: 210 },
  { min: 12000, max: 25000, rate: 0.20, deduction: 1410 },
  { min: 25000, max: 35000, rate: 0.25, deduction: 2660 },
  { min: 35000, max: 55000, rate: 0.30, deduction: 4410 },
  { min: 55000, max: 80000, rate: 0.35, deduction: 7160 },
  { min: 80000, max: Infinity, rate: 0.45, deduction: 15160 },
];

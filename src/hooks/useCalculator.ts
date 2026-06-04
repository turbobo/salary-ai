'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { calculateMonthlyResults, defaultMonthData, defaultGlobalParams } from '@/lib/calculation/salary';
import type { MonthData, GlobalParams, CalculationResults } from '@/lib/calculation/salary';
import { CITY_PRESETS } from '@/lib/calculation/constants';
import { loadFromStorage, saveToStorage, clearStorage } from '@/lib/storage';

export interface CalculatorState {
  city: string;
  setCity: (city: string) => void;
  bonusTaxMethod: string;
  setBonusTaxMethod: (method: string) => void;
  annualBonus: number;
  setAnnualBonus: (bonus: number) => void;
  bonusMonth: number;
  setBonusMonth: (month: number) => void;
  specialDeduction: number;
  setSpecialDeduction: (deduction: number) => void;
  enabledMonths: Record<number, boolean>;
  globalParams: GlobalParams;
  setGlobalParams: React.Dispatch<React.SetStateAction<GlobalParams>>;
  monthlyData: Record<number, MonthData>;
  collapsedMonths: Record<number, boolean>;
  results: CalculationResults;
  enabledCount: number;
  updateMonthField: (month: number, field: string, value: unknown) => void;
  toggleMonth: (month: number) => void;
  selectAllMonths: () => void;
  selectNoneMonths: () => void;
  applyCityPreset: (cityKey: string) => void;
  applyGlobalToAll: () => void;
  resetAll: () => void;
  toggleCollapseMonth: (month: number) => void;
  loadCalculation: (data: Record<string, unknown>) => void;
}

function initEnabledMonths(): Record<number, boolean> {
  const s: Record<number, boolean> = {};
  for (let i = 1; i <= 12; i++) s[i] = true;
  return s;
}

function initMonthlyData(): Record<number, MonthData> {
  const data: Record<number, MonthData> = {};
  for (let i = 1; i <= 12; i++) data[i] = defaultMonthData();
  return data;
}

function initCollapsedMonths(): Record<number, boolean> {
  const c: Record<number, boolean> = {};
  for (let i = 1; i <= 12; i++) c[i] = false;
  return c;
}

export function useCalculator(): CalculatorState {
  const saved = useRef<Record<string, unknown> | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    saved.current = loadFromStorage();
    setIsClient(true);
  }, []);

  const [city, setCity] = useState('shanghai');
  const [bonusTaxMethod, setBonusTaxMethod] = useState('separate');
  const [annualBonus, setAnnualBonus] = useState(0);
  const [bonusMonth, setBonusMonth] = useState(1);
  const [specialDeduction, setSpecialDeduction] = useState(0);
  const [enabledMonths, setEnabledMonths] = useState<Record<number, boolean>>(initEnabledMonths);
  const [globalParams, setGlobalParams] = useState<GlobalParams>(defaultGlobalParams);
  const [monthlyData, setMonthlyData] = useState<Record<number, MonthData>>(initMonthlyData);
  const [collapsedMonths, setCollapsedMonths] = useState<Record<number, boolean>>(initCollapsedMonths);

  useEffect(() => {
    if (!isClient || !saved.current) return;
    const s = saved.current;
    if (s.city) setCity(s.city as string);
    if (s.bonusTaxMethod) setBonusTaxMethod(s.bonusTaxMethod as string);
    if (s.annualBonus) setAnnualBonus(s.annualBonus as number);
    if (s.bonusMonth) setBonusMonth(s.bonusMonth as number);
    if (s.specialDeduction) setSpecialDeduction(s.specialDeduction as number);
    if (s.enabledMonths) setEnabledMonths(s.enabledMonths as Record<number, boolean>);
    if (s.globalParams) setGlobalParams(s.globalParams as GlobalParams);
    if (s.monthlyData) setMonthlyData(s.monthlyData as Record<number, MonthData>);
  }, [isClient]);

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!isClient) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveToStorage({ city, bonusTaxMethod, annualBonus, bonusMonth, specialDeduction, enabledMonths, globalParams, monthlyData });
    }, 500);
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  }, [isClient, city, bonusTaxMethod, annualBonus, bonusMonth, specialDeduction, enabledMonths, globalParams, monthlyData]);

  const updateMonthField = useCallback((month: number, field: string, value: unknown) => {
    setMonthlyData(prev => ({ ...prev, [month]: { ...prev[month], [field]: value } }));
  }, []);

  const toggleMonth = useCallback((month: number) => {
    setEnabledMonths(prev => ({ ...prev, [month]: !prev[month] }));
  }, []);

  const selectAllMonths = useCallback(() => setEnabledMonths(initEnabledMonths()), []);
  const selectNoneMonths = useCallback(() => {
    const s: Record<number, boolean> = {};
    for (let i = 1; i <= 12; i++) s[i] = false;
    setEnabledMonths(s);
  }, []);

  const applyCityPreset = useCallback((cityKey: string) => {
    setCity(cityKey);
    const preset = CITY_PRESETS[cityKey];
    if (cityKey === 'custom') return;
    setGlobalParams(prev => ({
      ...prev,
      pensionRate: preset.socialInsurance.pension.rate,
      medicalRate: preset.socialInsurance.medical.rate,
      unemploymentRate: preset.socialInsurance.unemployment.rate,
      housingFundRate: preset.housingFund.rateMax,
    }));
  }, []);

  const applyGlobalToAll = useCallback(() => {
    setMonthlyData(prev => {
      const newData: Record<number, MonthData> = {};
      for (let i = 1; i <= 12; i++) {
        newData[i] = {
          ...prev[i],
          salary: null, socialInsuranceBase: null, pensionRate: null,
          medicalRate: null, unemploymentRate: null, housingFundBase: null, housingFundRate: null,
        };
      }
      return newData;
    });
  }, []);

  const resetAll = useCallback(() => {
    if (!confirm('确定要重置所有数据吗？此操作不可撤销。')) return;
    clearStorage();
    setCity('shanghai');
    setBonusTaxMethod('separate');
    setAnnualBonus(0);
    setBonusMonth(1);
    setSpecialDeduction(0);
    setEnabledMonths(initEnabledMonths());
    setGlobalParams(defaultGlobalParams());
    setMonthlyData(initMonthlyData());
  }, []);

  const toggleCollapseMonth = useCallback((m: number) => {
    setCollapsedMonths(prev => ({ ...prev, [m]: !prev[m] }));
  }, []);

  const loadCalculation = useCallback((data: Record<string, unknown>) => {
    if (data.city) setCity(data.city as string);
    if (data.bonus_tax_method) setBonusTaxMethod(data.bonus_tax_method as string);
    if (data.annual_bonus != null) setAnnualBonus(data.annual_bonus as number);
    if (data.bonus_month != null) setBonusMonth(data.bonus_month as number);
    if (data.special_deduction != null) setSpecialDeduction(data.special_deduction as number);
    if (data.enabled_months) setEnabledMonths(data.enabled_months as Record<number, boolean>);
    if (data.global_params) setGlobalParams(data.global_params as GlobalParams);
    if (data.monthly_data) setMonthlyData(data.monthly_data as Record<number, MonthData>);
  }, []);

  const results = useMemo(() => {
    return calculateMonthlyResults({ monthlyData, city, annualBonus, bonusTaxMethod, bonusMonth, specialDeduction, enabledMonths, globalParams });
  }, [monthlyData, city, annualBonus, bonusTaxMethod, bonusMonth, specialDeduction, enabledMonths, globalParams]);

  const enabledCount = Object.values(enabledMonths).filter(Boolean).length;

  return {
    city, setCity, bonusTaxMethod, setBonusTaxMethod,
    annualBonus, setAnnualBonus, bonusMonth, setBonusMonth,
    specialDeduction, setSpecialDeduction, enabledMonths,
    globalParams, setGlobalParams, monthlyData, collapsedMonths,
    results, enabledCount,
    updateMonthField, toggleMonth, selectAllMonths, selectNoneMonths,
    applyCityPreset, applyGlobalToAll, resetAll, toggleCollapseMonth,
    loadCalculation,
  };
}

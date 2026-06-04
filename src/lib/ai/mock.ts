import { CITY_PRESETS } from '../calculation/constants';

export interface SmartInputData {
  city?: string;
  salary?: number;
  housingFundRate?: number;
  annualBonus?: number;
  specialDeduction?: number;
  socialInsuranceBase?: number | null;
  housingFundBase?: number | null;
}

export interface AnalysisData {
  competitiveness_score: number;
  city_average_salary: number;
  percentile: number;
  effective_tax_rate: number;
  comparison: string;
  analysis_summary: string;
  suggestions: string[];
}

export function getMockSmartInput(inputText: string): SmartInputData {
  const data: SmartInputData = {
    city: 'shanghai', salary: 30000, housingFundRate: 12,
    annualBonus: 60000, specialDeduction: 1000,
  };
  if (inputText.includes('北京') || inputText.includes('BJ')) data.city = 'beijing';
  else if (inputText.includes('广州')) data.city = 'guangzhou';
  else if (inputText.includes('深圳')) data.city = 'shenzhen';
  else if (inputText.includes('杭州')) data.city = 'hangzhou';
  else if (inputText.includes('成都')) data.city = 'chengdu';

  const salaryMatch = inputText.match(/月薪\s*(\d+\.?\d*)\s*[千万]/);
  if (salaryMatch) {
    const val = parseFloat(salaryMatch[1]);
    data.salary = inputText.includes('万') ? val * 10000 : val * 1000;
  }
  const salaryMatch2 = inputText.match(/月薪\s*(\d+)/);
  if (salaryMatch2 && !salaryMatch) data.salary = parseInt(salaryMatch2[1]);

  const hfMatch = inputText.match(/公积金\s*(\d+)%?/);
  if (hfMatch) data.housingFundRate = parseInt(hfMatch[1]);

  const bonusMatch = inputText.match(/年终奖\s*(\d+\.?\d*)\s*万?/);
  if (bonusMatch) {
    data.annualBonus = bonusMatch[1].includes('.') || inputText.match(/年终奖\s*\d+\.?\d*\s*万/)
      ? parseFloat(bonusMatch[1]) * 10000
      : parseInt(bonusMatch[1]);
  }

  const deductionMatch = inputText.match(/扣除\s*(\d+)/);
  if (deductionMatch) data.specialDeduction = parseInt(deductionMatch[1]);
  const loanMatch = inputText.match(/房贷.*?(\d+)/);
  if (loanMatch) data.specialDeduction = parseInt(loanMatch[1]);

  return data;
}

export function getMockAnalysis(city: string, salary: number, totalGross: number, totalNet: number, totalTax: number): AnalysisData {
  const cityName = CITY_PRESETS[city]?.name || '当前城市';
  const avgSalaries: Record<string, number> = { beijing: 13438, shanghai: 12183, guangzhou: 10588, shenzhen: 12078, hangzhou: 11254, chengdu: 9185, custom: 10000 };
  const cityAvg = avgSalaries[city] || 10000;
  const ratio = salary / cityAvg;
  const score = Math.min(98, Math.max(15, Math.round(ratio * 45 + 10)));
  const percentile = Math.min(99, Math.max(5, Math.round(ratio * 40 + 15)));
  const effectiveRate = totalGross > 0 ? ((totalTax / totalGross) * 100).toFixed(1) : '0.0';

  return {
    competitiveness_score: score,
    city_average_salary: cityAvg,
    percentile,
    effective_tax_rate: parseFloat(effectiveRate),
    comparison: ratio >= 1.5 ? '远超城市平均水平' : ratio >= 1.2 ? '高于城市平均水平' : ratio >= 0.9 ? '接近城市平均水平' : '低于城市平均水平',
    analysis_summary: `您在${cityName}的月薪为¥${salary.toLocaleString()}，${ratio >= 1.2 ? '处于较高水平。' : ratio >= 0.9 ? '处于中等偏上水平。' : '仍有较大提升空间。'}年税前总收入¥${totalGross.toLocaleString()}，实际到手¥${totalNet.toLocaleString()}，综合税负率${effectiveRate}%。`,
    suggestions: [
      '关注个人养老金账户政策，每年最高可存入12000元享受税前扣除，有效降低税负',
      '建议合理配置专项附加扣除，如子女教育(每个子女2000元/月)、继续教育(400元/月)、住房贷款利息(1000元/月)等',
      '考虑将部分收入转化为股权激励或期权，可能享受更优惠的税率',
      '持续学习新技能，提升职场竞争力，争取更快的薪资增长',
    ],
  };
}

export function getMockCareerPlan(city: string, salary: number): string {
  const cityName = CITY_PRESETS[city]?.name || '当前城市';
  return `## 职业发展建议\n\n### 当前薪资定位\n\n您在${cityName}的月薪为¥${salary.toLocaleString()}。根据市场数据，这一薪资水平在同城市中处于${salary >= 25000 ? '中高级' : salary >= 15000 ? '中级' : '初级至中级'}阶段。\n\n### 薪资增长路径\n\n- **短期目标(1-2年)**：通过项目经验积累和专业技能提升，目标薪资增长15%-25%\n- **中期目标(3-5年)**：向管理岗位或资深专家方向发展，目标月薪提升50%-80%\n- **长期目标(5-10年)**：进入高级管理层或成为行业专家，实现收入质的飞跃\n\n### 技能提升建议\n\n1. **专业技能深化**：在当前领域持续深耕，获取高级认证或专业资格\n2. **管理能力培养**：学习团队管理、项目管理、战略规划等软技能\n3. **跨领域拓展**：了解AI、数据分析等前沿技术，增加复合竞争力\n4. **行业人脉积累**：参加行业会议、加入专业社群，扩大职业网络\n\n### 财务规划建议\n\n- 建立3-6个月的应急储备金\n- 合理配置保险（重疾、医疗、意外），建议保费不超过年收入的5%-10%\n- 开始长期投资规划，建议每月定投收入的20%-30%\n- 关注个人养老金账户等税收优惠政策，最大化利用税优工具\n\n> 以上建议基于当前薪资水平和城市生活成本，具体规划建议咨询专业理财顾问。`;
}

export function getMockTaxSuggestion(city: string, salary: number, annualBonus: number, specialDeduction: number, separateTax: number, combinedTax: number, betterMethod: string, savings: number, totalSI: number, totalHF: number): string {
  const suggestions: string[] = [];
  suggestions.push('### 年终奖计税方式分析\n');
  if (annualBonus > 0) {
    if (betterMethod === 'separate') {
      suggestions.push(`根据您的薪资结构，**单独计税**更优，可节省税款 **${savings.toFixed(2)}** 元。`);
    } else {
      suggestions.push(`根据您的薪资结构，**合并计税**更优，可节省税款 **${savings.toFixed(2)}** 元。`);
    }
  }
  suggestions.push('\n### 专项附加扣除建议\n');
  if (specialDeduction === 0) {
    suggestions.push('您当前未设置专项附加扣除，以下项目可能适用：');
    suggestions.push(`- **住房贷款利息**：1000元/月（首套住房贷款）`);
    const isFirstTier = ['beijing', 'shanghai', 'guangzhou', 'shenzhen'].includes(city);
    suggestions.push(`- **住房租金**：${isFirstTier ? '1500' : '800-1100'}元/月（无自有住房）`);
    suggestions.push('- **赡养老人**：最高3000元/月（独生子女）');
    suggestions.push('- **子女教育**：每个子女2000元/月');
    suggestions.push('- **继续教育**：学历教育400元/月，职业资格取证当年3600元');
    suggestions.push('- **3岁以下婴幼儿照护**：每个婴幼儿2000元/月');
  } else {
    suggestions.push(`您当前设置了${specialDeduction}元/月的专项附加扣除，请确认已充分利用所有可扣除项目。`);
  }
  suggestions.push('\n### 其他节税建议');
  suggestions.push('- 考虑开设**个人养老金账户**，每年最高缴存12000元可税前扣除');
  suggestions.push('- 如有商业健康保险，每年最高可税前扣除2400元');
  suggestions.push('- 合理规划年终奖发放时间，避免跨年导致的税务问题');
  return suggestions.join('\n');
}

export interface ILevelConfig {
  level: number;
  name: string;
  requiredPoints: number;
  stage: string;
  rewards: {
    coins: number;
    badge: string;
  };
}

export const LEVEL_CONFIG: ILevelConfig[] = [
  { level: 1, name: '新手情侣', requiredPoints: 0, stage: '初识阶段', rewards: { coins: 0, badge: 'newbie' } },
  { level: 2, name: '相识之初', requiredPoints: 100, stage: '初识阶段', rewards: { coins: 50, badge: 'beginner' } },
  { level: 3, name: '心动时刻', requiredPoints: 200, stage: '初识阶段', rewards: { coins: 50, badge: 'heartbeat' } },
  { level: 4, name: '确认关系', requiredPoints: 350, stage: '初识阶段', rewards: { coins: 80, badge: 'confirmed' } },
  { level: 5, name: '甜蜜开端', requiredPoints: 550, stage: '初识阶段', rewards: { coins: 100, badge: 'sweet_start' } },
  
  { level: 6, name: '日常陪伴', requiredPoints: 800, stage: '磨合期', rewards: { coins: 120, badge: 'companion' } },
  { level: 7, name: '互相了解', requiredPoints: 1100, stage: '磨合期', rewards: { coins: 150, badge: 'understanding' } },
  { level: 8, name: '小有默契', requiredPoints: 1450, stage: '磨合期', rewards: { coins: 180, badge: 'harmony' } },
  { level: 9, name: '渐入佳境', requiredPoints: 1850, stage: '磨合期', rewards: { coins: 200, badge: 'improving' } },
  { level: 10, name: '心意相通', requiredPoints: 2300, stage: '磨合期', rewards: { coins: 250, badge: 'connected' } },
  
  { level: 11, name: '亲密无间', requiredPoints: 2800, stage: '稳定期', rewards: { coins: 300, badge: 'intimate' } },
  { level: 12, name: '相知相守', requiredPoints: 3350, stage: '稳定期', rewards: { coins: 350, badge: 'devoted' } },
  { level: 13, name: '情比金坚', requiredPoints: 3950, stage: '稳定期', rewards: { coins: 400, badge: 'solid' } },
  { level: 14, name: '携手同行', requiredPoints: 4600, stage: '稳定期', rewards: { coins: 450, badge: 'together' } },
  { level: 15, name: '默契搭档', requiredPoints: 5300, stage: '稳定期', rewards: { coins: 500, badge: 'partner' } },
  
  { level: 16, name: '灵魂伴侣', requiredPoints: 6050, stage: '深度期', rewards: { coins: 600, badge: 'soulmate' } },
  { level: 17, name: '命中注定', requiredPoints: 6850, stage: '深度期', rewards: { coins: 700, badge: 'destiny' } },
  { level: 18, name: '如胶似漆', requiredPoints: 7700, stage: '深度期', rewards: { coins: 800, badge: 'inseparable' } },
  { level: 19, name: '无话不谈', requiredPoints: 8600, stage: '深度期', rewards: { coins: 900, badge: 'open' } },
  { level: 20, name: '心有灵犀', requiredPoints: 9550, stage: '深度期', rewards: { coins: 1000, badge: 'telepathy' } },
  
  { level: 21, name: '相濡以沫', requiredPoints: 11000, stage: '成熟期', rewards: { coins: 1200, badge: 'mutual_care' } },
  { level: 22, name: '举案齐眉', requiredPoints: 12500, stage: '成熟期', rewards: { coins: 1400, badge: 'respectful' } },
  { level: 23, name: '比翼双飞', requiredPoints: 14050, stage: '成熟期', rewards: { coins: 1600, badge: 'flying_together' } },
  { level: 24, name: '天长地久', requiredPoints: 15650, stage: '成熟期', rewards: { coins: 1800, badge: 'eternal' } },
  { level: 25, name: '白首不离', requiredPoints: 17300, stage: '成熟期', rewards: { coins: 2000, badge: 'lifelong' } },
  
  { level: 26, name: '百年好合', requiredPoints: 20000, stage: '传奇期', rewards: { coins: 2500, badge: 'century' } },
  { level: 27, name: '神仙眷侣', requiredPoints: 25000, stage: '传奇期', rewards: { coins: 3000, badge: 'immortal' } },
  { level: 28, name: '传奇伴侣', requiredPoints: 32000, stage: '传奇期', rewards: { coins: 4000, badge: 'legendary' } },
  { level: 29, name: '永恒之爱', requiredPoints: 40000, stage: '传奇期', rewards: { coins: 5000, badge: 'eternal_love' } },
  { level: 30, name: 'TimelessLove', requiredPoints: 50000, stage: '传奇期', rewards: { coins: 10000, badge: 'timeless' } },
];

export function calculateLevel(lovePoints: number): ILevelConfig {
  for (let i = LEVEL_CONFIG.length - 1; i >= 0; i--) {
    if (lovePoints >= LEVEL_CONFIG[i].requiredPoints) {
      return LEVEL_CONFIG[i];
    }
  }
  return LEVEL_CONFIG[0];
}

export function getNextLevelConfig(currentLevel: number): ILevelConfig | null {
  if (currentLevel >= 30) return null;
  return LEVEL_CONFIG[currentLevel];
}

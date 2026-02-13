// ===== 生产环境配置（域名已备案）=====
export const API_BASE_URL = 'https://timelesslove.top/api';

// ===== 开发环境配置 =====
// export const API_BASE_URL = 'http://124.222.234.56/api';

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER_INFO: 'userInfo',
  COUPLE_INFO: 'coupleInfo',
};

export const LEVEL_NAMES = [
  '新手情侣', '相识之初', '心动时刻', '确认关系', '甜蜜开端',
  '日常陪伴', '互相了解', '小有默契', '渐入佳境', '心意相通',
  '亲密无间', '相知相守', '情比金坚', '携手同行', '默契搭档',
  '灵魂伴侣', '命中注定', '如胶似漆', '无话不谈', '心有灵犀',
  '相濡以沫', '举案齐眉', '比翼双飞', '天长地久', '白首不离',
  '百年好合', '神仙眷侣', '传奇伴侣', '永恒之爱', 'TimelessLove',
];

export const TASK_STATUS_MAP = {
  pending: '待确认',
  approved: '待开始',
  in_progress: '进行中',
  completed: '已完成',
  verified: '已验收',
  failed: '已失败',
};

export const TASK_TYPE_MAP = {
  personal: '个人任务',
  cooperation: '双人协作',
  periodic: '周期任务',
  challenge: '挑战任务',
};

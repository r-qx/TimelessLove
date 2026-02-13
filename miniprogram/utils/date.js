/**
 * 日期格式化工具函数
 * 将时间戳格式化为指定格式的字符串
 */

/**
 * 格式化时间戳为 yyyy-MM-dd HH:mm:ss
 * @param {number} timestamp - 时间戳（毫秒）
 * @param {string} format - 格式化模板，默认 'yyyy-MM-dd HH:mm:ss'
 * @returns {string} 格式化后的日期字符串
 */
export function formatDate(timestamp, format = 'yyyy-MM-dd HH:mm:ss') {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  
  // 检查是否为有效日期
  if (isNaN(date.getTime())) return '';
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return format
    .replace('yyyy', year)
    .replace('MM', month)
    .replace('dd', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/**
 * 格式化为日期（yyyy-MM-dd）
 * @param {number} timestamp - 时间戳（毫秒）
 * @returns {string} 格式化后的日期字符串
 */
export function formatDateOnly(timestamp) {
  return formatDate(timestamp, 'yyyy-MM-dd');
}

/**
 * 格式化为时间（HH:mm:ss）
 * @param {number} timestamp - 时间戳（毫秒）
 * @returns {string} 格式化后的时间字符串
 */
export function formatTimeOnly(timestamp) {
  return formatDate(timestamp, 'HH:mm:ss');
}

/**
 * 格式化为日期时间（yyyy-MM-dd HH:mm）
 * @param {number} timestamp - 时间戳（毫秒）
 * @returns {string} 格式化后的日期时间字符串
 */
export function formatDateTime(timestamp) {
  return formatDate(timestamp, 'yyyy-MM-dd HH:mm');
}

/**
 * 相对时间显示（如：刚刚、3分钟前、昨天等）
 * @param {number} timestamp - 时间戳（毫秒）
 * @returns {string} 相对时间字符串
 */
export function formatRelativeTime(timestamp) {
  if (!timestamp) return '';
  
  const now = Date.now();
  const diff = now - timestamp;
  
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;
  
  if (diff < minute) {
    return '刚刚';
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)}分钟前`;
  } else if (diff < day) {
    return `${Math.floor(diff / hour)}小时前`;
  } else if (diff < 2 * day) {
    return '昨天 ' + formatTimeOnly(timestamp).substring(0, 5);
  } else if (diff < week) {
    return `${Math.floor(diff / day)}天前`;
  } else if (diff < month) {
    return `${Math.floor(diff / week)}周前`;
  } else if (diff < year) {
    return `${Math.floor(diff / month)}个月前`;
  } else {
    return formatDateOnly(timestamp);
  }
}

/**
 * 计算两个时间戳之间的天数
 * @param {number} startTimestamp - 开始时间戳
 * @param {number} endTimestamp - 结束时间戳（默认为当前时间）
 * @returns {number} 相差天数
 */
export function getDaysBetween(startTimestamp, endTimestamp = Date.now()) {
  const diff = Math.abs(endTimestamp - startTimestamp);
  return Math.floor(diff / (24 * 60 * 60 * 1000));
}

/**
 * 判断是否为今天
 * @param {number} timestamp - 时间戳
 * @returns {boolean}
 */
export function isToday(timestamp) {
  const today = new Date();
  const date = new Date(timestamp);
  return today.toDateString() === date.toDateString();
}

/**
 * 判断是否为昨天
 * @param {number} timestamp - 时间戳
 * @returns {boolean}
 */
export function isYesterday(timestamp) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const date = new Date(timestamp);
  return yesterday.toDateString() === date.toDateString();
}

/**
 * 将日期字符串转换为时间戳
 * @param {string} dateString - 日期字符串
 * @returns {number} 时间戳
 */
export function parseDate(dateString) {
  if (!dateString) return null;
  const timestamp = new Date(dateString).getTime();
  return isNaN(timestamp) ? null : timestamp;
}

export default {
  formatDate,
  formatDateOnly,
  formatTimeOnly,
  formatDateTime,
  formatRelativeTime,
  getDaysBetween,
  isToday,
  isYesterday,
  parseDate,
};

export enum ErrorCode {
  SUCCESS = 20000,
  
  CLIENT_ERROR = 40000,
  PARAMS_ERROR = 40001,
  
  UNAUTHORIZED = 40100,
  LOGIN_REQUIRED = 40101,
  TOKEN_EXPIRED = 40102,
  TOKEN_INVALID = 40103,
  
  FORBIDDEN = 40300,
  NO_PERMISSION = 40301,
  
  NOT_FOUND = 40400,
  USER_NOT_FOUND = 40401,
  COUPLE_NOT_FOUND = 40402,
  TASK_NOT_FOUND = 40403,
  
  CONFLICT = 40900,
  USER_ALREADY_EXISTS = 40901,
  COUPLE_ALREADY_EXISTS = 40902,
  
  SERVER_ERROR = 50000,
  DATABASE_ERROR = 50001,
  WECHAT_API_ERROR = 50002,
}

export const ErrorMessage = {
  [ErrorCode.SUCCESS]: '操作成功',
  [ErrorCode.CLIENT_ERROR]: '客户端请求错误',
  [ErrorCode.PARAMS_ERROR]: '参数错误',
  [ErrorCode.UNAUTHORIZED]: '未授权',
  [ErrorCode.LOGIN_REQUIRED]: '请先登录',
  [ErrorCode.TOKEN_EXPIRED]: 'Token已过期',
  [ErrorCode.TOKEN_INVALID]: 'Token无效',
  [ErrorCode.FORBIDDEN]: '禁止访问',
  [ErrorCode.NO_PERMISSION]: '没有权限',
  [ErrorCode.NOT_FOUND]: '资源不存在',
  [ErrorCode.USER_NOT_FOUND]: '用户不存在',
  [ErrorCode.COUPLE_NOT_FOUND]: '情侣关系不存在',
  [ErrorCode.TASK_NOT_FOUND]: '任务不存在',
  [ErrorCode.CONFLICT]: '资源冲突',
  [ErrorCode.USER_ALREADY_EXISTS]: '用户已存在',
  [ErrorCode.COUPLE_ALREADY_EXISTS]: '情侣关系已存在',
  [ErrorCode.SERVER_ERROR]: '服务器错误',
  [ErrorCode.DATABASE_ERROR]: '数据库错误',
  [ErrorCode.WECHAT_API_ERROR]: '微信API调用失败',
};

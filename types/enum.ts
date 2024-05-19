export enum BasicStatus {
  DISABLE = '1',
  ENABLE = '2',
}

export enum ResultEnum {
  SUCCESS = 200,
  ERROR = -1,
  TIMEOUT = 401,
}

export enum StorageEnum {
  User = 'user',
  Token = 'token',
  Settings = 'settings',
  I18N = 'i18nextLng',
  Permissions = 'permissions',
}

export enum ThemeMode {
  Light = 'light',
  Dark = 'dark',
}

export enum ThemeLayout {
  Vertical = 'vertical',
  Horizontal = 'horizontal',
  Mini = 'mini',
}

export enum ThemeColorPresets {
  Default = 'default',
  Cyan = 'cyan',
  Purple = 'purple',
  Blue = 'blue',
  Orange = 'orange',
  Red = 'red',
}

export enum LocalEnum {
  zh_CN = 'zh_CN',
  en_US = 'en_US',
}

export enum MultiTabOperation {
  FULLSCREEN = 'fullscreen',
  REFRESH = 'refresh',
  CLOSE = 'close',
  CLOSEOTHERS = 'closeOthers',
  CLOSEALL = 'closeAll',
  CLOSELEFT = 'closeLeft',
  CLOSERIGHT = 'closeRight',
}

export enum PermissionType {
  CATALOGUE = 'M',
  MENU = 'C',
  BUTTON = 'F',
}

export enum SySApiEnum {
  SYS = 'blue',
  BUS = 'purple',
  '' = 'orange',
}

export enum MethodEnum {
  GET = 'success',
  PUT = 'processing',
  POST = 'error',
  DELETE = 'warning',
}

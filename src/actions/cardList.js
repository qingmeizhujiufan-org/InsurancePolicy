export const INCREMENT_COUNTER = 'INCREMENT_COUNTER'
export const DECREMENT_COUNTER = 'DECREMENT_COUNTER'
//导出加一的方法
export function increment() {
  return {
    type: INCREMENT_COUNTER
  }
}
//导出减一的方法
export function decrement() {
  return {
    type: DECREMENT_COUNTER
  }
}
//这些方法都导出,在其他文件导入时候,使用import * as actions 就可以生成一个actions对象包含所有的export
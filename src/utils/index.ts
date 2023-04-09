// 基于typescirpt封装一个函数,让str中的target部分高亮，忽略大小写
export function highlight(str: string, target: string): string {
  const reg = new RegExp(target, 'gi')
  return str.replace(reg, `<span style="color: red;">$&</span>`)
}

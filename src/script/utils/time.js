// 日期转时间戳（精确到秒） date是moment
export const date2timestamp = date => parseInt(
  Date.parse(date.format('YYYY/MM/DD')) / 1000
)

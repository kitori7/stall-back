const formatTimes = (times) => {
  // 处理空数组情况
  if (!times || times.length === 0) {
    return "";
  }

  // 定义时间段映射
  const timeMap = {
    1: { start: "00:00", end: "06:00" },
    2: { start: "06:00", end: "12:00" },
    3: { start: "12:00", end: "18:00" },
    4: { start: "18:00", end: "24:00" },
  };

  // 去重并排序
  const sortedTimes = [...new Set(times)].sort((a, b) => Number(a) - Number(b));

  // 找出连续时间段
  const ranges = [];
  let start = sortedTimes[0];
  let prev = sortedTimes[0];

  for (let i = 1; i < sortedTimes.length; i++) {
    if (Number(sortedTimes[i]) - Number(prev) === 1) {
      prev = sortedTimes[i];
    } else {
      ranges.push({ start: timeMap[start].start, end: timeMap[prev].end });
      start = sortedTimes[i];
      prev = sortedTimes[i];
    }
  }
  ranges.push({ start: timeMap[start].start, end: timeMap[prev].end });

  // 格式化输出
  return ranges.map((range) => `${range.start}~${range.end}`).join(" ");
};

module.exports = formatTimes;

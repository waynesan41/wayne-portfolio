const livePercent = document.getElementById('percentNumber') as HTMLSpanElement

export function changePercent(
  loaded: number,
  total: number,
  percent: number,
  gap: number
) {
  // Change Percentage
  const percentComplete = Math.trunc((loaded / total) * percent + gap)
  console.log(percentComplete)
  livePercent!.innerText = percentComplete.toString()
}

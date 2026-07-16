// Shared goal calculations for pages that need a compact progress summary.
export function goalProgress(seconds, goalHours){const target=Math.max(0.5,Number(goalHours)||8)*3600;return {target,remaining:Math.max(0,target-seconds),percent:Math.min(100,seconds/target*100),achieved:seconds>=target};}

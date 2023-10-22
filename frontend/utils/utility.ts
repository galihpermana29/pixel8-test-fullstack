export function formatDate(date: string): string {
  const d = new Date(date);
  const monthIndex = [
    'Jan',
    'Feb',
    'March',
    'April',
    'May',
    'June',
    'July',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Des',
  ];
  return `${monthIndex[d.getMonth()]} ${d.getDate()}`;
}

export function extractGitHubUserId(avatarUrl: string): string | null {
  const match = avatarUrl.match(/\/u\/(\d+)/);
  if (match && match[1]) {
    return match[1];
  }
  return null;
}

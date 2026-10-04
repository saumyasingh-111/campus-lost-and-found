export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return 'Yesterday';
  }
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function getCategoryBadge(category: string): { label: string; color: string } {
  switch (category) {
    case 'electronics':
      return { label: 'Electronics', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
    case 'id_cards':
      return { label: 'IDs & Cards', color: 'bg-rose-50 text-rose-700 border-rose-200' };
    case 'keys':
      return { label: 'Keys & Fobs', color: 'bg-amber-50 text-amber-700 border-amber-200' };
    case 'bags':
      return { label: 'Bags & Packs', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    case 'books':
      return { label: 'Books & Notes', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' };
    case 'clothing':
      return { label: 'Clothing', color: 'bg-purple-50 text-purple-700 border-purple-200' };
    case 'accessories':
      return { label: 'Accessories', color: 'bg-teal-50 text-teal-700 border-teal-200' };
    default:
      return { label: 'General Item', color: 'bg-slate-50 text-slate-700 border-slate-200' };
  }
}

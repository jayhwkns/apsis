export function abbreviate(date: Date) {
  const yy = String(date.getFullYear() % 100).padStart(2, '0');
  // Date returns date index, hence the "+ 1"
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');

  return yy + mm + dd;
}

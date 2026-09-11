/**
 * Formats an integer amount stored in PAISA (as in the Prisma models) into a
 * rupee display string, e.g. 200000 -> "₹2,000.00".
 */
export function rupees(paisa: number): string {
  return `₹${(paisa / 100).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

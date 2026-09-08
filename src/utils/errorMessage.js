// Backend error shapes seen across the app:
//  - { success:false, message: "..." }                     (most controllers)
//  - { success:false, message:"...", errors:{field:"msg"} } (validation, 400)
//  - Dashboard/Report controllers return the DTO directly (no wrapper)
export function extractErrorMessage(err, fallback = 'មានបញ្ហា សូមព្យាយាមម្តងទៀត') {
  const data = err?.response?.data;

  if (!data) return err?.message || fallback;

  if (data.errors && typeof data.errors === 'object') {
    const firstField = Object.keys(data.errors)[0];
    if (firstField) return data.errors[firstField];
  }

  return data.message || fallback;
}
// លំដាប់ priority ពី​ខ្ពស់ទៅទាប — role ដំបូងដែលរកឃើញនឹងបង្ហាញ
const ROLE_PRIORITY = ['ADMIN', 'HR_MANAGER', 'HR', 'MANAGER', 'EMPLOYEE'];

export function getPrimaryRole(roles = []) {
  if (!roles || roles.length === 0) return 'User';

  for (const priorityRole of ROLE_PRIORITY) {
    if (roles.includes(priorityRole)) return priorityRole;
  }

  // បើ role មិននៅក្នុង priority list ណាមួយ — យក role ដំបូងគេ
  return roles[0];
}
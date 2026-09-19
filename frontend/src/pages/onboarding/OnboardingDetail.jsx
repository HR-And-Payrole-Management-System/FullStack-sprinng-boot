import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { onboardingApi } from '../../api/onboarding.api';

export default function OnboardingDetail() {
  const { employeeId } = useParams();
  const [process, setProcess] = useState(null);
  const [error, setError] = useState('');

  const load = () => onboardingApi.getByEmployee(employeeId)
    .then((res) => setProcess(res.data))
    .catch((err) => setError(err.response?.data?.message || 'No onboarding process found.'));

  useEffect(() => { load(); }, [employeeId]);

  if (error) return <div className="p-6 text-danger">{error}</div>;
  if (!process) return <div className="p-6">Loading…</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">{process.employeeName}'s Onboarding</h1>
      <div className="text-sm text-gray-500 mb-4">{process.templateName} · {process.progressPercent}% complete</div>

      <div className="flex flex-col gap-2">
        {process.tasks.map((t) => (
          <div key={t.id} className={`border rounded-lg p-3 flex justify-between items-center ${t.overdue ? 'border-red-300 bg-red-50' : 'bg-white'}`}>
            <div>
              <div className="font-medium text-sm">{t.title} {t.mandatory && <span className="text-red-500">*</span>}</div>
              <div className="text-xs text-gray-500">{t.assignedRole} · Due {t.dueDate}{t.overdue ? ' · Overdue' : ''}</div>
            </div>
            {t.status === 'PENDING' || t.status === 'IN_PROGRESS' ? (
              <div className="flex gap-2">
                {!t.mandatory && (
                  <button onClick={() => onboardingApi.skipTask(t.id).then(load)} className="text-xs px-2 py-1 border rounded">Skip</button>
                )}
                <button onClick={() => onboardingApi.completeTask(t.id).then(load)} className="text-xs px-2 py-1 bg-indigo-500 text-white rounded">Complete</button>
              </div>
            ) : (
              <span className="text-xs font-medium text-green-600">{t.status}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
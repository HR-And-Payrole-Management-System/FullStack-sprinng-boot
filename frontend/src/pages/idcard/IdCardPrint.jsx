import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Printer, ArrowLeft, AlertTriangle, Ban } from 'lucide-react';

import { employeeService } from '../../services/employee.service';
import { companyService } from '../../services/company.service';
import { idCardService } from '../../services/idcard.service';
import { resolveUploadUrl } from '../../utils/url';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmployeeIdCard from '../../components/idcard/EmployeeIdCard';

const PRINTABLE_STATUSES = ['ACTIVE', 'REISSUED'];

function IdCardPrint() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [card, setCard] = useState(null);
  const [companyLogo, setCompanyLogo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      employeeService.get(id),
      companyService.list().catch(() => []),
      idCardService.getByEmployee(id),
    ]).then(([emp, companies, cardData]) => {
      setEmployee(emp);
      setCard(cardData);
      const match = companies.find((c) => c.id === emp.companyId) || companies[0];
      if (match?.logoUrl) setCompanyLogo(resolveUploadUrl(match.logoUrl));
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner fullPage />;

  if (!employee) {
    return (
      <div className="flex min-h-full items-center justify-center bg-slate-50 dark:bg-slate-900/60 px-6 py-16">
        <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">Employee not found</div>
      </div>
    );
  }

  const canPrint = !card || PRINTABLE_STATUSES.includes(card.status);

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-900/60 px-6 py-6">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Print ID Card</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {employee.firstName} {employee.lastName} &middot; {employee.employeeCode}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => navigate('/id-card')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 transition hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <ArrowLeft size={15} strokeWidth={2.25} />
            Back
          </button>
          <button
            onClick={() => window.print()}
            disabled={!canPrint}
            className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-violet-600/20 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-violet-600"
          >
            <Printer size={15} strokeWidth={2.25} />
            Print
          </button>
        </div>
      </div>

      {/* Alerts */}
      {!card && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-900/10 px-4 py-3.5">
          <AlertTriangle size={18} strokeWidth={2} className="mt-0.5 shrink-0 text-amber-500" />
          <p className="text-sm text-amber-800 dark:text-amber-300">
            No ID card has been issued for this employee yet. Go to the ID Card page and issue one before printing.
          </p>
        </div>
      )}
      {card && !canPrint && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 dark:border-rose-900/40 dark:bg-rose-900/10 px-4 py-3.5">
          <Ban size={18} strokeWidth={2} className="mt-0.5 shrink-0 text-rose-500" />
          <p className="text-sm text-rose-800 dark:text-rose-300">
            This card is marked <strong>{card.status}</strong> and cannot be printed. Update its status to Active or Reissued first.
          </p>
        </div>
      )}

      {/* Card preview */}
      <div className="flex justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-10 shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
        <EmployeeIdCard employee={employee} card={card} companyLogo={companyLogo} />
      </div>
    </div>
  );
}

export default IdCardPrint;
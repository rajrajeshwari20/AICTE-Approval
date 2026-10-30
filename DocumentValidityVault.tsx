import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DocumentItem } from '../../types';
import { 
  FileWarning, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Upload, 
  Check, 
  Building, 
  ShieldAlert, 
  FileCheck,
  Search,
  ExternalLink
} from 'lucide-react';

export const DocumentValidityVault: React.FC = () => {
  const { applications, submitDocumentRenewal, verifyDocumentRenewal, setSelectedAppId } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedDocForRenewal, setSelectedDocForRenewal] = useState<{ doc: DocumentItem; appId: string } | null>(null);

  // Form states for renewal
  const [renewalFileName, setRenewalFileName] = useState('');
  const [newExpiryDate, setNewExpiryDate] = useState('2056-01-01');

  // Flatten documents with institute context
  const allDocs = applications.flatMap(app => 
    app.documents.map(d => ({
      doc: d,
      appId: app.id,
      institutionName: app.institutionName,
      region: app.region
    }))
  );

  const filteredDocs = allDocs.filter(({ doc }) => {
    const matchesCat = categoryFilter === 'ALL' || doc.category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || doc.status === statusFilter;
    return matchesCat && matchesStatus;
  });

  const handleRenewalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDocForRenewal) return;

    submitDocumentRenewal(
      selectedDocForRenewal.doc.id,
      renewalFileName || 'Renewed_Document_Deed.pdf',
      newExpiryDate
    );

    setSelectedDocForRenewal(null);
    setRenewalFileName('');
  };

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-500 mb-1 flex items-center gap-1.5">
            <span>Statutory Document Validity Radar</span>
            <span>·</span>
            <span>APH Sec 1.6 30-Year Lease & Life Safety Mandates</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Lease & Prescribed Document Validity Vault
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Real-time automated surveillance of registered land lease deeds, fire evacuation NOCs, building structural stability, and affiliation orders.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            <option value="Land Lease Deed">Registered Land Lease Deed</option>
            <option value="Fire Safety Certificate">Fire Safety Certificate</option>
            <option value="Building Safety NOC">Building Safety NOC</option>
            <option value="Affiliation Order">University Affiliation Order</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="EXPIRED">Expired / Overdue</option>
            <option value="EXPIRING_SOON">Expiring Soon (Alert Zone)</option>
            <option value="RENEWAL_SUBMITTED">Renewal Submitted</option>
            <option value="VALID">Valid</option>
          </select>
        </div>
      </div>

      {/* Grid of Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.length === 0 ? (
          <div className="col-span-full bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-500 text-xs">
            No documents found matching the filter criteria.
          </div>
        ) : (
          filteredDocs.map(({ doc, appId, institutionName, region }) => {
            const isExpired = doc.status === 'EXPIRED' || doc.daysRemaining < 0;
            const isExpiringSoon = doc.status === 'EXPIRING_SOON';
            const isRenewalSubmitted = doc.status === 'RENEWAL_SUBMITTED';

            return (
              <div 
                key={doc.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col justify-between"
              >
                <div>
                  {/* Category & Status */}
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {doc.category}
                    </span>
                    <span className={`text-[11px] font-bold ${
                      isExpired ? 'text-rose-600' : isExpiringSoon ? 'text-amber-600' : 'text-emerald-600'
                    }`}>
                      {isExpired 
                        ? 'EXPIRED' 
                        : isExpiringSoon 
                        ? `EXPIRES IN ${doc.daysRemaining}d` 
                        : isRenewalSubmitted 
                        ? 'RENEWAL SUBMITTED' 
                        : 'VALID'}
                    </span>
                  </div>

                  {/* Title & Institute */}
                  <h3 className="text-xs font-bold text-slate-900 mb-1 line-clamp-1">
                    {doc.title}
                  </h3>
                  <div className="text-[11px] text-slate-600 mb-3 truncate">
                    {institutionName} · {region}
                  </div>

                  {/* Dates & Mandate */}
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs space-y-1 mb-3">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Issue Date:</span>
                      <span className="font-mono text-slate-800">{doc.issueDate}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Expiry Date:</span>
                      <span className="font-mono text-slate-900 font-semibold">{doc.expiryDate}</span>
                    </div>
                    {doc.mandatedYears && (
                      <div className="flex justify-between text-[11px] pt-1 border-t border-slate-200/60">
                        <span className="text-slate-500">APH Mandate:</span>
                        <span className="font-semibold text-amber-700">Minimum {doc.mandatedYears} Years Lease</span>
                      </div>
                    )}
                  </div>

                  {/* Renewal file preview if submitted */}
                  {doc.renewalFile && (
                    <div className="p-2 rounded bg-blue-50 border border-blue-200 text-xs text-blue-900 mb-3">
                      <div className="text-[10px] font-semibold text-blue-700">Renewal Acknowledgment:</div>
                      <div className="font-mono text-[11px] truncate">{doc.renewalFile}</div>
                      <div className="text-[10px] text-slate-500">Submitted: {doc.renewalDate}</div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedAppId(appId)}
                    className="text-xs text-slate-500 hover:text-slate-900 font-medium cursor-pointer"
                  >
                    View Case
                  </button>

                  <div className="flex items-center gap-1.5">
                    {/* Submit Renewal */}
                    <button
                      onClick={() => setSelectedDocForRenewal({ doc, appId })}
                      className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium cursor-pointer shadow-xs flex items-center gap-1"
                    >
                      <Upload className="w-3 h-3 text-amber-400" />
                      <span>Upload Renewal</span>
                    </button>

                    {/* Officer verify if renewal was uploaded */}
                    {isRenewalSubmitted && (
                      <button
                        onClick={() => verifyDocumentRenewal(doc.id, true)}
                        className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer shadow-xs"
                        title="Verify Renewal"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Upload Document Renewal */}
      {selectedDocForRenewal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 max-w-md w-full p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Submit Document Renewal / Extension
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Document: <strong>{selectedDocForRenewal.doc.title}</strong>
            </p>

            <form onSubmit={handleRenewalSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">New Expiry Date (Post-Renewal)</label>
                <input
                  type="date"
                  value={newExpiryDate}
                  onChange={(e) => setNewExpiryDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Registered Document File Name</label>
                <input
                  type="text"
                  placeholder="e.g. Registered_Lease_Deed_SubRegistrar_2056.pdf"
                  value={renewalFileName}
                  onChange={(e) => setRenewalFileName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 font-mono"
                  required
                />
              </div>

              <div className="p-3 rounded-lg bg-slate-50 text-slate-600 text-xs border border-slate-200 leading-relaxed">
                For lease documents: Must be executed by Sub-Registrar / competent land revenue authority for at least 30 continuous years.
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedDocForRenewal(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Upload & Notify Bureau
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

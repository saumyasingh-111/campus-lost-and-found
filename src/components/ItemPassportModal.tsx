import React, { useState } from 'react';
import { X, ShieldCheck, MapPin, Lock, UserCheck } from 'lucide-react';
import { Item } from '../types';
import { formatRelativeTime } from '../utils/formatters';

interface ItemPassportModalProps {
  item: Item | null;
  isOpen: boolean;
  onClose: () => void;
  onClaim: (item: Item) => void;
  onSelectOnMap: (locationId: string) => void;
  onUpdateStatus?: (itemId: string, newStatus: Item['status'], trustStatus?: 'in_safe_custody' | 'staff_verified', timelineNote?: string) => void;
}

const LIFECYCLE_STEPS = [
  { id: 'reported', label: 'Reported' },
  { id: 'verification', label: 'Verification' },
  { id: 'claim_submitted', label: 'Claim Submitted' },
  { id: 'ownership_verified', label: 'Ownership Verified' },
  { id: 'handoff_scheduled', label: 'Handoff Scheduled' },
  { id: 'reunited', label: 'Reunited' },
];

export const ItemPassportModal: React.FC<ItemPassportModalProps> = ({
  item,
  isOpen,
  onClose,
  onClaim,
  onSelectOnMap,
  onUpdateStatus,
}) => {
  const [showAdminControls, setShowAdminControls] = useState(false);

  if (!isOpen || !item) return null;

  // Determine current lifecycle step index
  const getCurrentStepIndex = (): number => {
    if (item.status === 'reunited') return 5;
    if (item.safeHandoff?.status === 'ready') return 4;
    if (item.safeHandoff?.status === 'completed') return 5;
    if (item.trustBadge?.status === 'staff_verified') return 1;
    if (item.trustBadge?.status === 'in_safe_custody') return 1;
    return 0; // Reported
  };

  const currentStep = getCurrentStepIndex();

  const handleAdminAction = (
    status: Item['status'],
    trustStatus?: 'in_safe_custody' | 'staff_verified',
    note?: string
  ) => {
    if (onUpdateStatus) {
      onUpdateStatus(item.id, status, trustStatus, note);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-xs px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Item Passport
              </span>
              <span className="font-mono text-xs font-bold text-indigo-700">
                {item.passportId}
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-1">{item.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Section 6: Lifecycle Progress Bar */}
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
              Lifecycle Status
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 bg-slate-50 p-2 rounded-xl border border-slate-100 text-center">
              {LIFECYCLE_STEPS.map((step, idx) => {
                const isPassed = idx < currentStep;
                const isCurrent = idx === currentStep;
                return (
                  <div
                    key={step.id}
                    className={`py-1.5 px-1 rounded-lg text-[10px] font-medium transition-colors ${
                      isCurrent
                        ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                        : isPassed
                        ? 'bg-emerald-50 text-emerald-800'
                        : 'text-slate-400'
                    }`}
                  >
                    <div className="text-[9px] opacity-75">Step 0{idx + 1}</div>
                    <div className="truncate mt-0.5">{step.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Core Passport Specifications Table */}
          <div className="bg-slate-50 rounded-xl border border-slate-200/80 p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Passport Record Details
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Report ID</span>
                <span className="font-mono font-semibold text-slate-900">{item.passportId}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Status</span>
                <span
                  className={`font-semibold capitalize ${
                    item.status === 'lost'
                      ? 'text-amber-700'
                      : item.status === 'found'
                      ? 'text-emerald-700'
                      : 'text-blue-700'
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Category</span>
                <span className="font-semibold text-slate-800 capitalize">
                  {item.category.replace('_', ' ')}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Reported</span>
                <span className="font-semibold text-slate-800">
                  {formatRelativeTime(item.dateReported)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Campus Location</span>
                <button
                  onClick={() => {
                    onSelectOnMap(item.locationId);
                    onClose();
                  }}
                  className="font-semibold text-indigo-600 hover:underline flex items-center gap-1 truncate text-left"
                >
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{item.locationName}</span>
                </button>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Verification</span>
                <span className="font-semibold text-slate-800">
                  {item.trustBadge?.status === 'staff_verified'
                    ? 'Staff Verified'
                    : item.trustBadge?.status === 'in_safe_custody'
                    ? 'In Safe Custody'
                    : item.status === 'reunited'
                    ? 'Reunited'
                    : 'Pending Claim'}
                </span>
              </div>
            </div>

            {/* Trust Badge Display */}
            {item.trustBadge && (
              <div className="mt-3 pt-3 border-t border-slate-200/80 flex items-center gap-2 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-emerald-800 font-medium">
                  {item.trustBadge.status === 'staff_verified'
                    ? 'Verified by Campus Staff'
                    : 'In Safe Custody'}{' '}
                  • {item.trustBadge.verifiedBy || 'Proctor Desk'}
                </span>
              </div>
            )}
          </div>

          {/* Item Description & Media */}
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full sm:w-36 h-36 rounded-xl object-cover border border-slate-200 shrink-0"
            />
            <div className="space-y-2 text-xs flex-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Item Description
              </span>
              <p className="text-slate-700 leading-relaxed">{item.description}</p>
              {item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {item.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              {item.reward && (
                <div className="text-amber-800 font-semibold pt-1">
                  Honorarium / Reward: {item.reward}
                </div>
              )}
            </div>
          </div>

          {/* Section 3 & 4 Verification Clue Notice */}
          <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs text-indigo-950 flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-indigo-900 font-semibold">
                Private Ownership Verification Protected
              </strong>
              <span>
                "{item.privateClues?.question || item.secretVerification.hintQuestion}"
              </span>
              <p className="text-[11px] text-indigo-700/80 mt-1">
                The secret answer is encrypted. Claimants must provide this detail to initiate handoff.
              </p>
            </div>
          </div>

          {/* Section 7: Item Status Timeline */}
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-3">
              Item Status Timeline
            </span>
            <div className="border-l-2 border-slate-200 pl-4 space-y-4 ml-1">
              {item.timeline && item.timeline.length > 0 ? (
                item.timeline.map((event, idx) => (
                  <div key={event.id || idx} className="relative">
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-300 ring-2 ring-white"></span>
                    <div className="text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">{event.date}</span>
                        {event.time && (
                          <span className="text-[11px] text-slate-400">• {event.time}</span>
                        )}
                      </div>
                      <p className="font-medium text-slate-800 mt-0.5">{event.title}</p>
                      {event.location && (
                        <p className="text-[11px] text-slate-500 mt-0.5">{event.location}</p>
                      )}
                      {event.note && (
                        <p className="text-[11px] text-slate-500 italic mt-0.5">{event.note}</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400">
                  Initial report recorded on {formatRelativeTime(item.dateReported)}.
                </div>
              )}
            </div>
          </div>

          {/* Section 8: Proctor / Admin Trust Layer Actions */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-slate-600" />
                <span>Proctor &amp; Staff Custody Actions</span>
              </span>
              <button
                type="button"
                onClick={() => setShowAdminControls(!showAdminControls)}
                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium"
              >
                {showAdminControls ? 'Hide Controls' : 'Show Staff Controls'}
              </button>
            </div>

            {showAdminControls && (
              <div className="pt-2 border-t border-slate-200/80 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleAdminAction(
                      item.status,
                      'in_safe_custody',
                      'Turned in to staff safe custody counter'
                    )
                  }
                  className="px-2.5 py-1 rounded bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-[11px] font-medium"
                >
                  ✓ Mark in Safe Custody
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleAdminAction(
                      item.status,
                      'staff_verified',
                      'Verified by Proctor Desk Officer'
                    )
                  }
                  className="px-2.5 py-1 rounded bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-[11px] font-medium"
                >
                  ✓ Mark Staff Verified
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleAdminAction('reunited', undefined, 'Marked reunited by campus administrator')
                  }
                  className="px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-800 text-[11px] font-medium"
                >
                  ✓ Mark Reunited
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-white px-6 py-3 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => {
              onSelectOnMap(item.locationId);
              onClose();
            }}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
          >
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>Show on Map</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
            {item.status !== 'reunited' && (
              <button
                onClick={() => {
                  onClose();
                  onClaim(item);
                }}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
              >
                {item.status === 'found' ? 'Claim This Item' : 'Match & Claim'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

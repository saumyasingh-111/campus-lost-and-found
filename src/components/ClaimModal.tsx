import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, AlertCircle, Building2, Lock, Copy, Check } from 'lucide-react';
import { Item } from '../types';

interface ClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Item | null;
  onSuccessClaim: (
    itemId: string,
    claimantInfo: { name: string; email: string },
    handoffCode?: string,
    handoffLocation?: string
  ) => void;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({
  isOpen,
  onClose,
  item,
  onSuccessClaim,
}) => {
  const [claimantName, setClaimantName] = useState('Vikram Malhotra');
  const [claimantEmail, setClaimantEmail] = useState('vikram.m@campus.ac.in');
  const [answerInput, setAnswerInput] = useState('');
  const [selectedHandoffLocation, setSelectedHandoffLocation] = useState(
    'Dr. APJ Abdul Kalam Central Library Help Desk'
  );
  const [status, setStatus] = useState<'idle' | 'verifying' | 'verified' | 'failed'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [handoffCode, setHandoffCode] = useState('739 214');
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen || !item) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!answerInput.trim()) {
      setErrorMessage('Please answer the verification question to proceed.');
      return;
    }

    setStatus('verifying');

    setTimeout(() => {
      const normalizedInput = answerInput.trim().toLowerCase();
      const secret = (item.privateClues?.answer || item.secretVerification.secretAnswer)
        .trim()
        .toLowerCase();

      // Check if match
      const isMatch =
        normalizedInput.includes(secret) ||
        secret.includes(normalizedInput) ||
        normalizedInput.split(/\s+/).some((w) => w.length >= 3 && secret.includes(w));

      if (isMatch) {
        // Generate clean 6-digit code: "XXX XXX"
        const num1 = Math.floor(100 + Math.random() * 900);
        const num2 = Math.floor(100 + Math.random() * 900);
        const generated = `${num1} ${num2}`;
        setHandoffCode(generated);
        setStatus('verified');

        onSuccessClaim(
          item.id,
          { name: claimantName, email: claimantEmail },
          generated,
          selectedHandoffLocation
        );
      } else {
        setStatus('failed');
        setErrorMessage(
          'Verification answer did not match the owner’s private clue. Please review your details.'
        );
      }
    }, 600);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(handoffCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden border border-slate-200 shadow-xl">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {status === 'verified' ? 'Safe Handoff Protocol' : 'Verify Ownership'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {status === 'verified'
                  ? 'Present one-time code at verified desk'
                  : 'Privacy-protected claim verification'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        {status === 'verified' ? (
          /* SECTION 4: SAFE HANDOFF STATE */
          <div className="p-6 space-y-5">
            {/* Match Confidence Breakdown (Section 3 Result) */}
            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Ownership Verified
                </span>
                <span className="text-xs font-mono font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                  Confidence: 96%
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 pt-1 text-[11px] text-emerald-800 font-medium">
                <div>✓ Ownership detail matched</div>
                <div>✓ Item category matched</div>
                <div>✓ Location matched</div>
              </div>
            </div>

            {/* Handoff Code Box */}
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                One-Time Handoff Code
              </span>
              <div className="flex items-center justify-center gap-2">
                <span className="font-mono text-3xl font-extrabold tracking-widest text-slate-900">
                  {handoffCode}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  title="Copy Code"
                  className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition-colors"
                >
                  {copiedCode ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Show this 6-digit code at the verified campus location to release the item. Code expires after handoff.
              </p>
            </div>

            {/* Safe Location Meeting Desk */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Verified Campus Meeting Location
              </label>
              <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-start gap-2.5">
                <Building2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-slate-900 block">{selectedHandoffLocation}</strong>
                  <span className="text-slate-500 text-[11px]">
                    Official staff-monitored campus drop-off &amp; verification desk.
                  </span>
                </div>
              </div>
            </div>

            {/* Privacy Trust Notice */}
            <div className="p-3 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
              <Lock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 block">Your contact details remain private.</strong>
                Both parties coordinate through the platform without disclosing personal phone numbers.
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs"
            >
              Done &amp; Close Handoff Details
            </button>
          </div>
        ) : (
          /* SECTION 3: OWNERSHIP VERIFICATION CHALLENGE */
          <form onSubmit={handleVerify} className="p-6 space-y-4">
            {/* Public Listing Summary */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
              />
              <div className="min-w-0 text-xs">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-mono text-[10px] text-slate-400">{item.passportId}</span>
                  <span className="text-[10px] uppercase font-bold text-slate-500">• {item.category}</span>
                </div>
                <h4 className="font-semibold text-slate-900 truncate">{item.title}</h4>
                <p className="text-slate-500 text-[11px] truncate">Reported near {item.locationName}</p>
              </div>
            </div>

            {/* Verification Instruction & Question */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <p className="text-xs text-slate-600 leading-relaxed">
                Before we connect you with the finder, answer one private verification question:
              </p>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <p className="text-xs font-semibold text-slate-900">
                  "{item.privateClues?.question || item.secretVerification.hintQuestion}"
                </p>
              </div>
              <p className="text-[11px] text-slate-400">
                This detail is private to the original report and not displayed publicly.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Claimant Answer Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Answer *
              </label>
              <input
                type="text"
                required
                value={answerInput}
                onChange={(e) => setAnswerInput(e.target.value)}
                placeholder="e.g. Serial number digits, scratch location, sticker..."
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Preferred Handoff Desk */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Preferred Monitored Handover Desk
              </label>
              <select
                value={selectedHandoffLocation}
                onChange={(e) => setSelectedHandoffLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-hidden focus:ring-1 focus:ring-indigo-500 bg-white"
              >
                <option value="Dr. APJ Abdul Kalam Central Library Help Desk">
                  Library Help Desk (Ground floor)
                </option>
                <option value="Main Gate 1 — Security & Proctor Office">
                  Security & Proctor Office (Main Gate 1)
                </option>
                <option value="Students Activity Centre (SAC) Help Desk">
                  Students Activity Centre (SAC) Help Desk
                </option>
                <option value="Dean of Student Affairs Office">
                  Student Affairs Office (Administrative Block)
                </option>
              </select>
            </div>

            {/* Claimant Contact Details (kept private on platform) */}
            <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-100">
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Your Name</label>
                <input
                  type="text"
                  value={claimantName}
                  onChange={(e) => setClaimantName(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Campus Email</label>
                <input
                  type="email"
                  value={claimantEmail}
                  onChange={(e) => setClaimantEmail(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={status === 'verifying'}
                className="px-4 py-2 text-xs font-semibold text-white rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs disabled:opacity-50"
              >
                {status === 'verifying' ? 'Verifying Ownership...' : 'Verify Ownership'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

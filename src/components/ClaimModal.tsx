import React, { useState } from 'react';
import { X, ShieldCheck, KeyRound, CheckCircle2, AlertTriangle, Phone, Mail, MapPin, Sparkles, Building2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Item } from '../types';

interface ClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Item | null;
  onSuccessClaim: (itemId: string, claimantInfo: { name: string; email: string }) => void;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({
  isOpen,
  onClose,
  item,
  onSuccessClaim,
}) => {
  const [claimantName, setClaimantName] = useState('Vikram Malhotra');
  const [claimantEmail, setClaimantEmail] = useState('vikram.m@campus.ac.in');
  const [claimantPhone, setClaimantPhone] = useState('+91 98450 71239');
  const [answerInput, setAnswerInput] = useState('');
  const [additionalProof, setAdditionalProof] = useState('');
  const [status, setStatus] = useState<'idle' | 'checking' | 'success' | 'failed'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || !item) return null;

  const handleVerifyClaim = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!answerInput.trim()) {
      setErrorMessage('Please provide an answer to the verification question.');
      return;
    }

    setStatus('checking');

    setTimeout(() => {
      // Fuzzy check answer
      const normalizedInput = answerInput.trim().toLowerCase();
      const normalizedSecret = item.secretVerification.secretAnswer.trim().toLowerCase();

      // Check if input contains secret or secret contains input (or exact match)
      const isMatch =
        normalizedInput.includes(normalizedSecret) ||
        normalizedSecret.includes(normalizedInput) ||
        normalizedInput.split(/\s+/).some((w) => normalizedSecret.includes(w) && w.length >= 3);

      if (isMatch) {
        setStatus('success');
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4f46e5', '#10b981', '#f59e0b', '#3b82f6'],
        });
        onSuccessClaim(item.id, {
          name: claimantName,
          email: claimantEmail,
        });
      } else {
        setStatus('failed');
        setErrorMessage(
          `Verification did not match the owner's answer. (Hint: The secret answer is related to '${item.secretVerification.secretAnswer.slice(0, 3)}...')`
        );
      }
    }, 700);
  };

  const handleReset = () => {
    setStatus('idle');
    setAnswerInput('');
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Ownership Security Verification</h3>
              <p className="text-xs text-slate-500">Item Claim Protection Protocol</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {status === 'success' ? (
          /* SUCCESS STATE: Unlocked Contact & Handover Details */
          <div className="p-6 space-y-5 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm ring-8 ring-emerald-50">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-xl font-extrabold text-slate-900">Ownership Verified!</h4>
              <p className="text-xs text-slate-600 mt-1">
                Your answer matched the private security verification question. The item has been marked as <strong>Reunited</strong>.
              </p>
            </div>

            {/* Unlocked Contact Box */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Unlocked Contact Details
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Decrypted
                </span>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={item.reporter.avatar}
                  alt={item.reporter.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-200"
                />
                <div>
                  <p className="text-sm font-bold text-slate-900">{item.reporter.name}</p>
                  <p className="text-xs text-slate-500">{item.reporter.role} • Campus Community</p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-700 pt-1">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-indigo-600" />
                  <a href={`mailto:${item.reporter.email}`} className="font-semibold text-indigo-600 underline">
                    {item.reporter.email}
                  </a>
                </div>
                {item.reporter.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{item.reporter.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Item currently at: {item.locationName}</span>
                </div>
              </div>
            </div>

            {/* Safe Meetup Recommendation */}
            <div className="bg-blue-50/80 rounded-xl p-3 border border-blue-200 text-left flex items-start gap-2.5">
              <Building2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-900 leading-relaxed">
                <strong>Recommended Exchange Zone:</strong> We advise meeting at the Main Gate 1 Security/Proctor Office, SAC Help Desk, or Central Library Ground Floor for safe item handovers.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 text-xs font-bold text-white rounded-xl bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
            >
              Done & Close
            </button>
          </div>
        ) : (
          /* FORM STATE: Security Question Challenge */
          <form onSubmit={handleVerifyClaim} className="p-6 space-y-4">
            {/* Item Preview */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-14 h-14 rounded-xl object-cover shrink-0 ring-1 ring-slate-200"
              />
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Claiming Item
                </span>
                <h4 className="text-sm font-bold text-slate-900 truncate">{item.title}</h4>
                <p className="text-xs text-indigo-600 font-medium truncate flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {item.locationName}
                </p>
              </div>
            </div>

            {/* Verification Question Prompt */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                <KeyRound className="w-4 h-4 text-amber-600" />
                <span>Owner's Verification Question</span>
              </div>
              <p className="text-xs font-semibold text-slate-800 bg-white p-2.5 rounded-xl border border-amber-200/80">
                "{item.secretVerification.hintQuestion}"
              </p>
              <p className="text-[11px] text-amber-700">
                Provide the answer below. If your answer verifies ownership, contact details will unlock immediately.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Answer Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Your Answer *
              </label>
              <input
                type="text"
                required
                value={answerInput}
                onChange={(e) => setAnswerInput(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            {/* Additional Evidence or Proof */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Additional Proof / Description (Optional)
              </label>
              <textarea
                rows={2}
                value={additionalProof}
                onChange={(e) => setAdditionalProof(e.target.value)}
                placeholder="e.g. Serial number snippet, lock screen wallpaper description, unique scratch mark..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            {/* Claimant Identity Fields */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Your Name</label>
                <input
                  type="text"
                  value={claimantName}
                  onChange={(e) => setClaimantName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Campus Email</label>
                <input
                  type="email"
                  value={claimantEmail}
                  onChange={(e) => setClaimantEmail(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={status === 'checking'}
                className="px-5 py-2.5 text-xs font-bold text-white rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100 active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                {status === 'checking' ? (
                  <span>Verifying Answer...</span>
                ) : (
                  <>
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Verify & Unlock Contact</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

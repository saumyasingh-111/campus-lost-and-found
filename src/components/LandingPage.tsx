import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, MapPin, KeyRound, X } from 'lucide-react';

interface LandingPageProps {
  onExploreCampus: () => void;
  onReportItem: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onExploreCampus,
  onReportItem,
}) => {
  const [activeModal, setActiveModal] = useState<'how-it-works' | 'safety' | 'signin' | null>(null);

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#111827] flex flex-col justify-between selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Navigation */}
      <header className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#111827] text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-xs">
            CR
          </div>
          <div>
            <span className="font-semibold text-sm tracking-tight text-slate-900">Campus Reunite</span>
            <span className="hidden sm:inline-block ml-2 text-[11px] text-slate-400 font-normal border-l border-slate-200 pl-2">
              University Network
            </span>
          </div>
        </div>

        <nav className="flex items-center gap-6 text-xs font-medium text-slate-600">
          <button
            onClick={() => setActiveModal('how-it-works')}
            className="hover:text-slate-900 transition-colors"
          >
            How it works
          </button>
          <button
            onClick={() => setActiveModal('safety')}
            className="hover:text-slate-900 transition-colors"
          >
            Safety
          </button>
          <button
            onClick={() => setActiveModal('signin')}
            className="hover:text-slate-900 transition-colors hidden sm:block"
          >
            Sign in
          </button>
          <button
            onClick={onExploreCampus}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-900 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-xs"
          >
            <span>Enter App</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </nav>
      </header>

      {/* Main Hero & Content (Single-screen feel, ~1 to 1.5 screens) */}
      <main className="w-full max-w-4xl mx-auto px-6 py-8 sm:py-12 flex-1 flex flex-col justify-center">
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-700 mb-3">
            Campus Reunite
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-950 leading-tight">
            Lost something on campus? <br />
            <span className="text-slate-600 font-normal">Find it. Verify it. Bring it home.</span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl mx-auto">
            A smarter lost &amp; found network built for students, faculty and campus communities.
          </p>

          {/* Primary & Secondary Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onReportItem}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition-colors shadow-xs"
            >
              Report an Item
            </button>
            <button
              onClick={onExploreCampus}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-xs"
            >
              Explore Campus
            </button>
          </div>
        </div>

        {/* 3 Small Benefits */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-200/80 pt-10">
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
            <span className="text-[11px] font-mono font-semibold text-indigo-600">01</span>
            <h3 className="text-sm font-semibold text-slate-900 mt-2">Report easily</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Log misplaced items in seconds with optional private clues for verified claim ownership.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
            <span className="text-[11px] font-mono font-semibold text-indigo-600">02</span>
            <h3 className="text-sm font-semibold text-slate-900 mt-2">Find nearby</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Explore spatial reports on a real OpenStreetMap view of campus buildings, libraries, and grounds.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
            <span className="text-[11px] font-mono font-semibold text-indigo-600">03</span>
            <h3 className="text-sm font-semibold text-slate-900 mt-2">Verify ownership</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Confirm legitimate ownership before connection. Safe one-time handoff codes keep personal contacts private.
            </p>
          </div>
        </div>

        {/* Subtle Product Preview */}
        <div className="mt-10">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-200 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-slate-200 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-slate-200 inline-block"></span>
                <span className="text-slate-400 font-mono text-[11px] ml-2">campus-reunite.portal</span>
              </div>
              <span className="text-[11px] text-slate-400">Live Campus Registry</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Preview Item 1 */}
              <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                    LOST
                  </span>
                  <span className="font-mono text-slate-400">CR-2026-01482</span>
                </div>
                <p className="text-xs font-semibold text-slate-900 truncate">HP Envy x360 14" Laptop</p>
                <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  Central Library • 2h ago
                </p>
              </div>

              {/* Preview Item 2 */}
              <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    SAFE CUSTODY
                  </span>
                  <span className="font-mono text-slate-400">CR-2026-01504</span>
                </div>
                <p className="text-xs font-semibold text-slate-900 truncate">boAt Airdopes 441 in Matte Navy</p>
                <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Annapurna Canteen Staff Desk
                </p>
              </div>

              {/* Preview Item 3: Safe Handoff Snapshot */}
              <div className="p-3 rounded-lg border border-indigo-100 bg-indigo-50/40">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-semibold text-indigo-700 flex items-center gap-1">
                    <KeyRound className="w-3 h-3 text-indigo-600" />
                    SAFE HANDOFF
                  </span>
                  <span className="font-mono font-bold text-indigo-950">739 214</span>
                </div>
                <p className="text-xs font-medium text-slate-800">Library Help Desk Monitored Handover</p>
                <p className="text-[11px] text-indigo-700/80 mt-0.5">
                  Contact details private • One-time exchange
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto px-6 py-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <p>© 2026 Campus Reunite. Built for university student life, library staff &amp; campus security.</p>
        <div className="flex items-center gap-4 text-[11px]">
          <span>Chief Proctor Cell</span>
          <span>•</span>
          <span>Student Affairs</span>
          <span>•</span>
          <button onClick={onExploreCampus} className="text-indigo-600 hover:text-indigo-800 font-medium">
            Launch Portal →
          </button>
        </div>
      </footer>

      {/* "How It Works" Modal */}
      {activeModal === 'how-it-works' && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">How Campus Reunite Works</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex gap-3">
                <span className="font-mono font-bold text-indigo-600 shrink-0">01</span>
                <div>
                  <strong className="text-slate-800 block">Report item with private clues</strong>
                  Add a public description and an optional private clue (serial snippet, engraving, sticker) only you know.
                </div>
              </div>
              <div className="flex gap-3">
                <span className="font-mono font-bold text-indigo-600 shrink-0">02</span>
                <div>
                  <strong className="text-slate-800 block">Discover spatial reports</strong>
                  Browse the clean feed or locate items on the OpenStreetMap campus view.
                </div>
              </div>
              <div className="flex gap-3">
                <span className="font-mono font-bold text-indigo-600 shrink-0">03</span>
                <div>
                  <strong className="text-slate-800 block">Smart matching & verification</strong>
                  System ranks potential matches by area, category and time. Claimant must answer the private security question.
                </div>
              </div>
              <div className="flex gap-3">
                <span className="font-mono font-bold text-indigo-600 shrink-0">04</span>
                <div>
                  <strong className="text-slate-800 block">Safe handoff with one-time code</strong>
                  Both parties meet at a verified campus desk (e.g. Library counter or Security Office) using a 6-digit code. Personal phone numbers remain private.
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setActiveModal(null);
                onExploreCampus();
              }}
              className="w-full py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors"
            >
              Start Exploring Campus
            </button>
          </div>
        </div>
      )}

      {/* "Safety" Modal */}
      {activeModal === 'safety' && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Campus Trust &amp; Safety Protocol</span>
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="font-semibold text-slate-800 block mb-0.5">🔒 Private Verification Clues</span>
                Serial numbers, engraved initials, and secret markings are never shown publicly. Only claimants answering correctly unlock handoff.
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="font-semibold text-slate-800 block mb-0.5">🤝 Monitored Exchange Desks</span>
                Never exchange valuable items in isolated areas. Always use designated zones like Library Help Desk, SAC Help Desk, or Proctor Office.
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="font-semibold text-slate-800 block mb-0.5">🛡️ Contact Privacy Guaranteed</span>
                Your personal telephone number is never exposed by default. Coordination is conducted securely via verified handoff codes.
              </div>
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {/* "Sign In" Modal */}
      {activeModal === 'signin' && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">University Single Sign-On</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Campus Email</label>
                <input
                  type="email"
                  defaultValue="student@campus.ac.in"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Password</label>
                <input
                  type="password"
                  defaultValue="••••••••••••"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <button
                onClick={() => {
                  setActiveModal(null);
                  onExploreCampus();
                }}
                className="w-full py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors"
              >
                Sign In with Campus ID
              </button>
            </div>
            <p className="text-[11px] text-slate-400 text-center">
              Works with standard student, faculty &amp; staff credentials.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

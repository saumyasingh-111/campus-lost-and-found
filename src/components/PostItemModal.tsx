import React, { useState } from 'react';
import { X, Lock, ShieldCheck, AlertCircle } from 'lucide-react';
import { Item, ItemCategory, PrivateClue } from '../types';
import { CAMPUS_LOCATIONS } from '../data/campusLocations';

interface PostItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: Omit<Item, 'id' | 'status' | 'dateReported' | 'passportId'>) => void;
}

const PRESET_PHOTOS = [
  {
    name: 'Laptop / HP / Dell',
    url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
    category: 'electronics' as ItemCategory,
  },
  {
    name: 'boAt / AirPods / Earbuds',
    url: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=600&q=80',
    category: 'electronics' as ItemCategory,
  },
  {
    name: 'Institute ID & Metro Card',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    category: 'id_cards' as ItemCategory,
  },
  {
    name: 'Activa & Hostel Keys',
    url: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=600&q=80',
    category: 'keys' as ItemCategory,
  },
  {
    name: 'Milton / Steel Bottle',
    url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80',
    category: 'accessories' as ItemCategory,
  },
  {
    name: 'Wildcraft Backpack',
    url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
    category: 'bags' as ItemCategory,
  },
];

export const PostItemModal: React.FC<PostItemModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [type, setType] = useState<'lost' | 'found'>('lost');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ItemCategory>('electronics');
  const [locationId, setLocationId] = useState(CAMPUS_LOCATIONS[0].id);
  const [description, setDescription] = useState('');
  const [dateTime, setDateTime] = useState(() => new Date().toISOString().slice(0, 16));
  const [imageUrl, setImageUrl] = useState(PRESET_PHOTOS[0].url);

  // Private Ownership Clues (Section 3 & 11)
  const [clueType, setClueType] = useState<PrivateClue['type']>('serial');
  const [clueQuestion, setClueQuestion] = useState('What are the last 4 digits of the serial number?');
  const [clueAnswer, setClueAnswer] = useState('');

  // Found item custody options (Section 8 & 11)
  const [custodyOption, setCustodyOption] = useState<'safe_custody' | 'finder_held'>('safe_custody');
  const [custodyLocation, setCustodyLocation] = useState('Central Library Help Counter');

  // Optional Reward
  const [reward, setReward] = useState('');

  // Reporter Info
  const [reporterName, setReporterName] = useState('Aarav Sharma');
  const [reporterEmail, setReporterEmail] = useState('aarav.s@campus.ac.in');
  const [reporterRole, setReporterRole] = useState<'Student' | 'Faculty' | 'Staff' | 'Visitor'>('Student');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClueTypeChange = (selected: PrivateClue['type']) => {
    setClueType(selected);
    if (selected === 'serial') {
      setClueQuestion('What are the last 4 digits of the serial number?');
    } else if (selected === 'scratch') {
      setClueQuestion('Where is the hidden scratch or unique mark located?');
    } else if (selected === 'sticker') {
      setClueQuestion('What specific sticker or decal is on the item?');
    } else if (selected === 'engraving') {
      setClueQuestion('What text or initials are engraved on the item?');
    } else if (selected === 'wallpaper') {
      setClueQuestion('What wallpaper is currently set on the lock screen?');
    } else if (selected === 'contents') {
      setClueQuestion('What unique item or keychain is inside the bag?');
    } else {
      setClueQuestion('What specific identifying detail can verify your ownership?');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Please provide the item name.');
      return;
    }
    if (!description.trim()) {
      setError('Please provide a short description.');
      return;
    }

    const selectedLoc = CAMPUS_LOCATIONS.find((l) => l.id === locationId);
    const locationName = selectedLoc ? selectedLoc.name : 'Main Campus';

    const tags: string[] = [category, type];
    if (title.toLowerCase().includes('laptop')) tags.push('Laptop');
    if (title.toLowerCase().includes('boat')) tags.push('boAt');
    if (title.toLowerCase().includes('id')) tags.push('ID Card');

    const finalQuestion =
      type === 'lost'
        ? clueQuestion.trim() || 'What identifying mark verifies you own this item?'
        : 'Can you describe a specific hidden detail of this item?';

    const finalAnswer =
      type === 'lost'
        ? clueAnswer.trim() || 'Verified by owner'
        : clueAnswer.trim() || 'Verified';

    const trustBadge =
      type === 'found' && custodyOption === 'safe_custody'
        ? {
            status: 'in_safe_custody' as const,
            verifiedBy: custodyLocation,
            verifiedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          }
        : undefined;

    onSubmit({
      type,
      title: title.trim(),
      category,
      locationId,
      locationName,
      description: description.trim(),
      imageUrl: imageUrl.trim() || PRESET_PHOTOS[0].url,
      tags,
      reporter: {
        name: reporterName.trim() || 'Student Reporter',
        email: reporterEmail.trim() || 'student@campus.ac.in',
        role: reporterRole,
        avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 50)}?auto=format&fit=crop&w=150&q=80`,
      },
      secretVerification: {
        hintQuestion: finalQuestion,
        secretAnswer: finalAnswer,
      },
      privateClues: {
        type: clueType,
        question: finalQuestion,
        answer: finalAnswer,
      },
      trustBadge,
      reward: type === 'lost' && reward.trim() ? reward.trim() : undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-xs px-6 py-4 border-b border-slate-100 flex items-center justify-between z-10">
          <div>
            <h2 className="text-base font-bold text-slate-900">Report an item</h2>
            <p className="text-xs text-slate-500">
              Register item with campus lost &amp; found network
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Type Toggle: [ Lost ] [ Found ] */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Report Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('lost')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                  type === 'lost'
                    ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Lost Item</span>
              </button>
              <button
                type="button"
                onClick={() => setType('found')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                  type === 'found'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span>Found Item</span>
              </button>
            </div>
          </div>

          {/* Item Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Item Name *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. HP Envy x360 14'' Laptop"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ItemCategory)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-indigo-500 bg-white"
              >
                <option value="electronics">Electronics</option>
                <option value="id_cards">IDs &amp; Cards</option>
                <option value="keys">Keys &amp; Fobs</option>
                <option value="bags">Bags &amp; Packs</option>
                <option value="books">Books &amp; Notes</option>
                <option value="accessories">Accessories</option>
                <option value="clothing">Clothing</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Location & Date/Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Campus Location *
              </label>
              <select
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-indigo-500 bg-white"
              >
                {CAMPUS_LOCATIONS.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.code} — {loc.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date &amp; Time
              </label>
              <input
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description *
            </label>
            <textarea
              required
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Color, condition, specific room or landmark..."
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Photo */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Item Photo
            </label>
            <div className="flex gap-2 overflow-x-auto pb-1 mb-2 no-scrollbar">
              {PRESET_PHOTOS.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    setImageUrl(preset.url);
                    setCategory(preset.category);
                  }}
                  className={`shrink-0 px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors ${
                    imageUrl === preset.url
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Or paste photo image URL..."
              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* IF LOST: Section 3 & 11 Private ownership clues */}
          {type === 'lost' ? (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-slate-900">
                  Private ownership clues (optional)
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                These details stay private and may be used to verify ownership before handoff.
              </p>

              {/* Clue Category Selector */}
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Clue Type
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {(
                    [
                      { id: 'serial', label: 'Serial number' },
                      { id: 'scratch', label: 'Unique mark' },
                      { id: 'sticker', label: 'Sticker' },
                      { id: 'engraving', label: 'Engraving' },
                      { id: 'wallpaper', label: 'Wallpaper' },
                      { id: 'contents', label: 'Bag contents' },
                      { id: 'other', label: 'Other detail' },
                    ] as const
                  ).map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleClueTypeChange(c.id)}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                        clueType === c.id
                          ? 'bg-slate-900 text-white'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clue Question & Answer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Verification Question
                  </label>
                  <input
                    type="text"
                    value={clueQuestion}
                    onChange={(e) => setClueQuestion(e.target.value)}
                    placeholder="e.g. What are the last 4 digits of the serial number?"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Secret Answer *
                  </label>
                  <input
                    type="text"
                    value={clueAnswer}
                    onChange={(e) => setClueAnswer(e.target.value)}
                    placeholder="e.g. 4821 or Red cricket bat"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                  />
                </div>
              </div>

              {/* Optional Reward */}
              <div className="pt-1">
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Optional Reward (e.g. ₹500 or Canteen Voucher)
                </label>
                <input
                  type="text"
                  value={reward}
                  onChange={(e) => setReward(e.target.value)}
                  placeholder="e.g. ₹500"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                />
              </div>
            </div>
          ) : (
            /* IF FOUND: Section 8 & 11 Custody & Drop-off */
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-900">
                  Custody &amp; Handover Details
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <label
                  onClick={() => setCustodyOption('safe_custody')}
                  className={`p-2.5 rounded-lg border cursor-pointer flex flex-col justify-between ${
                    custodyOption === 'safe_custody'
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-semibold'
                      : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  <span>In Safe Custody</span>
                  <span className="text-[10px] text-slate-500 font-normal mt-1">
                    Deposited at campus security / desk
                  </span>
                </label>
                <label
                  onClick={() => setCustodyOption('finder_held')}
                  className={`p-2.5 rounded-lg border cursor-pointer flex flex-col justify-between ${
                    custodyOption === 'finder_held'
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-semibold'
                      : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  <span>With Finder</span>
                  <span className="text-[10px] text-slate-500 font-normal mt-1">
                    Will meet at verified desk for handoff
                  </span>
                </label>
              </div>

              {custodyOption === 'safe_custody' && (
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Drop-off Counter Location
                  </label>
                  <input
                    type="text"
                    value={custodyLocation}
                    onChange={(e) => setCustodyLocation(e.target.value)}
                    placeholder="e.g. Central Library Help Desk or Proctor Office"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                  />
                </div>
              )}

              {/* Secret feature for verifying claimant */}
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Hidden Feature or Identification Clue (for verification challenge)
                </label>
                <input
                  type="text"
                  value={clueAnswer}
                  onChange={(e) => setClueAnswer(e.target.value)}
                  placeholder="e.g. Name on card / charm on case / roll number"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                />
              </div>
            </div>
          )}

          {/* Reporter Information */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
              Reporter Identification
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] text-slate-500 mb-0.5">Name</label>
                <input
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-0.5">Campus Email</label>
                <input
                  type="email"
                  value={reporterEmail}
                  onChange={(e) => setReporterEmail(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-0.5">Role</label>
                <select
                  value={reporterRole}
                  onChange={(e) => setReporterRole(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                >
                  <option value="Student">Student</option>
                  <option value="Faculty">Faculty</option>
                  <option value="Staff">Staff</option>
                  <option value="Visitor">Visitor</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

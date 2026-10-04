import React, { useState } from 'react';
import { X, Image as ImageIcon, ShieldAlert, KeyRound, Sparkles, AlertCircle } from 'lucide-react';
import { Item } from '../types';
import { CAMPUS_LOCATIONS } from '../data/campusLocations';

interface PostItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: Omit<Item, 'id' | 'status' | 'dateReported'>) => void;
}

const PRESET_PHOTOS = [
  {
    name: 'Laptop / HP / Dell',
    url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
    category: 'electronics',
  },
  {
    name: 'boAt / AirPods / Earbuds',
    url: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=600&q=80',
    category: 'electronics',
  },
  {
    name: 'Institute ID / Metro Card',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    category: 'id_cards',
  },
  {
    name: 'Activa / Bike / Hostel Keys',
    url: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=600&q=80',
    category: 'keys',
  },
  {
    name: 'Milton / Cello Bottle',
    url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80',
    category: 'accessories',
  },
  {
    name: 'Wildcraft / Skybags Backpack',
    url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
    category: 'bags',
  },
];

export const PostItemModal: React.FC<PostItemModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [type, setType] = useState<'lost' | 'found'>('lost');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Item['category']>('electronics');
  const [locationId, setLocationId] = useState(CAMPUS_LOCATIONS[0].id);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(PRESET_PHOTOS[0].url);
  const [hintQuestion, setHintQuestion] = useState('');
  const [secretAnswer, setSecretAnswer] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [reward, setReward] = useState('');
  const [reporterName, setReporterName] = useState('Aarav Sharma');
  const [reporterEmail, setReporterEmail] = useState('aarav.s@campus.ac.in');
  const [reporterPhone, setReporterPhone] = useState('+91 98765 43210');
  const [reporterRole, setReporterRole] = useState<'Student' | 'Faculty' | 'Staff' | 'Visitor'>('Student');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a title for the item.');
      return;
    }
    if (!hintQuestion.trim()) {
      setError('Please provide a private verification question to protect ownership verification.');
      return;
    }
    if (!secretAnswer.trim()) {
      setError('Please provide the secret verification answer.');
      return;
    }

    const selectedLoc = CAMPUS_LOCATIONS.find((l) => l.id === locationId);
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    // If no custom tags, generate default from title
    if (tags.length === 0) {
      tags.push(category, type);
    }

    onSubmit({
      type,
      title: title.trim(),
      category,
      locationId,
      locationName: selectedLoc ? selectedLoc.name : 'Main Campus',
      description: description.trim(),
      imageUrl: imageUrl.trim() || PRESET_PHOTOS[0].url,
      tags,
      reporter: {
        name: reporterName.trim() || 'Anonymous Student',
        email: reporterEmail.trim() || 'student@campus.edu',
        phone: reporterPhone.trim() || undefined,
        role: reporterRole,
        avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 50)}?auto=format&fit=crop&w=150&q=80`,
      },
      secretVerification: {
        hintQuestion: hintQuestion.trim(),
        secretAnswer: secretAnswer.trim(),
      },
      reward: type === 'lost' && reward.trim() ? reward.trim() : undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Report an Item</h2>
            <p className="text-xs text-slate-500">
              Submit details to the campus registry. Matches are computed automatically.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Type Selector (I Lost vs I Found) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Report Category
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('lost')}
                className={`py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border-2 transition-all ${
                  type === 'lost'
                    ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                I Lost Something
              </button>
              <button
                type="button"
                onClick={() => setType('found')}
                className={`py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border-2 transition-all ${
                  type === 'found'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                I Found Something
              </button>
            </div>
          </div>

          {/* Title & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Item Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. HP Envy 14-inch / Casio fx-991EX Calculator"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Item['category'])}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="electronics">Electronics (Laptops, Phones, boAt/AirPods)</option>
                <option value="id_cards">College IDs & Metro Cards</option>
                <option value="keys">Activa, Bike & Hostel Keys</option>
                <option value="bags">Backpacks & Lab Folders</option>
                <option value="books">Textbooks & Engineering Notes</option>
                <option value="clothing">Jackets & Lab Coats</option>
                <option value="accessories">Water Bottles & Accessories</option>
                <option value="other">Other / Miscellaneous</option>
              </select>
            </div>
          </div>

          {/* Location & Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Campus Location *
              </label>
              <select
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                {CAMPUS_LOCATIONS.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} ({loc.code})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. boAt, Milton, Casio, Activa, Ganesha"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Detailed Description *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe where it was left/found, time, color, specific details..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Photo Presets & URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Item Photo (Pick a preset or paste image link)
            </label>
            <div className="flex gap-2 overflow-x-auto pb-2 mb-2 no-scrollbar">
              {PRESET_PHOTOS.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    setImageUrl(preset.url);
                    if (preset.category) setCategory(preset.category as Item['category']);
                  }}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    imageUrl === preset.url
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Security Verification Section (Step 2 & 3 Key requirement) */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 space-y-3">
            <div className="flex items-center gap-2 text-indigo-950 font-bold text-sm">
              <KeyRound className="w-4 h-4 text-indigo-600" />
              <span>Private Verification Hint (Security Check)</span>
            </div>
            <p className="text-xs text-indigo-800 leading-relaxed">
              To prevent fraudulent claims, set a question that only the real owner can answer (e.g., lock screen photo, engraved initials, sticker name). The claimant must answer this correctly before contact details are revealed.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-indigo-900 mb-1">
                  Public Security Question *
                </label>
                <input
                  type="text"
                  required
                  value={hintQuestion}
                  onChange={(e) => setHintQuestion(e.target.value)}
                  placeholder="e.g. What sticker is on the lower corner?"
                  className="w-full px-3 py-2 rounded-lg bg-white border border-indigo-200 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-indigo-900 mb-1">
                  Secret Correct Answer *
                </label>
                <input
                  type="text"
                  required
                  value={secretAnswer}
                  onChange={(e) => setSecretAnswer(e.target.value)}
                  placeholder="e.g. Chandrayaan-3"
                  className="w-full px-3 py-2 rounded-lg bg-white border border-indigo-200 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Optional Reward for Lost Items */}
          {type === 'lost' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Optional Reward (UPI Cash / Canteen Treat)
              </label>
              <input
                type="text"
                value={reward}
                onChange={(e) => setReward(e.target.value)}
                placeholder="e.g. ₹500 UPI / Canteen Cash"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          {/* Contact Details */}
          <div className="border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Reporter Contact Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Full Name</label>
                <input
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Campus Email</label>
                <input
                  type="email"
                  value={reporterEmail}
                  onChange={(e) => setReporterEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Campus Role</label>
                <select
                  value={reporterRole}
                  onChange={(e) => setReporterRole(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
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
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Publish {type === 'lost' ? 'Lost Item Report' : 'Found Item Report'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Send,
  Coffee,
  Palette,
  Wine,
  BookOpen,
  Compass,
  Check,
} from 'lucide-react';
import { Profile, DateProposal } from '../../types';
import {
  CuratedVenue,
  DatePlannerService,
  SAMPLE_CURATED_VENUES,
} from '../../services/datePlannerService';

interface DatePlannerModalProps {
  partner: Profile;
  onClose: () => void;
  onSendProposal: (proposal: DateProposal) => void;
}

export const DatePlannerModal: React.FC<DatePlannerModalProps> = ({
  partner,
  onClose,
  onSendProposal,
}) => {
  const venues = SAMPLE_CURATED_VENUES;
  const [selectedVenue, setSelectedVenue] = useState<CuratedVenue>(venues[0]);
  const [selectedDay, setSelectedDay] = useState('This Saturday');
  const [selectedTime, setSelectedTime] = useState('6:30 PM');
  const [customNote, setCustomNote] = useState(
    `Would love to explore ${venues[0].title} together! Are you free this weekend?`
  );

  const getVenueIcon = (type: string) => {
    switch (type) {
      case 'Coffee & Walk':
        return <Coffee size={16} className="text-amber-600" />;
      case 'Art & Museum':
        return <Palette size={16} className="text-indigo-600" />;
      case 'Cocktails & Jazz':
        return <Wine size={16} className="text-rose-600" />;
      case 'Bookstore & Pastry':
        return <BookOpen size={16} className="text-emerald-600" />;
      default:
        return <Compass size={16} className="text-rose-600" />;
    }
  };

  const handleSelectVenue = (venue: CuratedVenue) => {
    setSelectedVenue(venue);
    setCustomNote(
      `Would love to explore ${venue.title} together! Are you free for ${venue.type.toLowerCase()}?`
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const proposal = DatePlannerService.getInstance().createProposal(
      selectedVenue,
      selectedDay,
      selectedTime,
      'user_current',
      customNote
    );
    onSendProposal(proposal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] text-neutral-900 w-full max-w-sm rounded-t-[32px] sm:rounded-[32px] border border-neutral-200 shadow-2xl flex flex-col overflow-hidden max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-200/80 bg-white/90 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="font-serif font-bold text-sm text-neutral-900 leading-tight">
                Date Planner
              </h2>
              <p className="text-[10px] text-neutral-500">Plan a romantic meetup with {partner.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto no-scrollbar space-y-4">
          {/* Step 1: Curated Venue Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider font-mono">
                1. Select A Romantic Idea
              </span>
              <span className="text-[10px] text-rose-600 font-semibold">
                Curated Venues
              </span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 no-scrollbar">
              {venues.map((venue) => {
                const isSelected = selectedVenue.id === venue.id;
                return (
                  <div
                    key={venue.id}
                    onClick={() => handleSelectVenue(venue)}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-rose-50/70 border-rose-500 shadow-xs'
                        : 'bg-white border-neutral-200/80 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-xl bg-white border border-neutral-200 flex items-center justify-center shrink-0">
                          {getVenueIcon(venue.type)}
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-neutral-900 leading-tight">
                            {venue.title}
                          </h4>
                          <span className="text-[10px] text-neutral-500">
                            {venue.type} · {venue.neighborhood}
                          </span>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0">
                          <Check size={12} />
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-600 mt-2 line-clamp-2 leading-relaxed">
                      {venue.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Date & Time */}
          <div className="space-y-3">
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider font-mono block">
              2. Propose Date & Time
            </span>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-semibold text-neutral-500 block mb-1">
                  Proposed Day
                </label>
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-white border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-rose-500"
                >
                  <option value="This Friday">This Friday</option>
                  <option value="This Saturday">This Saturday</option>
                  <option value="This Sunday">This Sunday</option>
                  <option value="Next Tuesday">Next Tuesday</option>
                  <option value="Next Thursday">Next Thursday</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-neutral-500 block mb-1">
                  Time
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-white border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-rose-500"
                >
                  <option value="10:30 AM">10:30 AM (Morning)</option>
                  <option value="2:00 PM">2:00 PM (Afternoon)</option>
                  <option value="5:30 PM">5:30 PM (Golden Hour)</option>
                  <option value="7:00 PM">7:00 PM (Evening)</option>
                  <option value="8:15 PM">8:15 PM (Night)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Step 3: Invitation Note */}
          <div>
            <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider font-mono block mb-1">
              3. Invitation Note
            </label>
            <textarea
              rows={2}
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              className="w-full p-3 rounded-xl bg-white border border-neutral-200 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-rose-500 resize-none leading-relaxed"
            />
          </div>

          {/* Demo Notice */}
          <div className="p-2.5 bg-rose-50/70 border border-rose-100 rounded-xl text-[10px] text-rose-900">
            Sending this date invitation will render an interactive proposal card directly into your chat with {partner.name}.
          </div>

          {/* Send Button */}
          <button
            type="submit"
            className="w-full h-12 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-rose-600/20"
          >
            <Send size={15} />
            <span>Send Date Invitation to {partner.name}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

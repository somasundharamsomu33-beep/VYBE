import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle2, Loader2 } from 'lucide-react';
import { Profile } from '../../types';
import { SafetyService, ReportReportPayload } from '../../services/safetyService';

interface ReportModalProps {
  profile: Profile;
  onClose: () => void;
  onReportCompleted: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  profile,
  onClose,
  onReportCompleted,
}) => {
  const [reason, setReason] = useState<ReportReportPayload['reason']>('inappropriate_photos');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await SafetyService.getInstance().reportUser({
      targetUserId: profile.id,
      reason,
      details,
    });
    setIsSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      onReportCompleted();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#FAF8F5] text-neutral-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-neutral-200">
          <div className="flex items-center gap-2 text-rose-600">
            <ShieldAlert size={18} />
            <h3 className="font-serif font-bold text-base text-neutral-900">
              Report & Block {profile.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-200/60 hover:bg-neutral-200 flex items-center justify-center text-neutral-600"
          >
            <X size={16} />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
              <CheckCircle2 size={32} />
            </div>
            <h4 className="font-serif font-bold text-lg text-neutral-900">
              Report Submitted & Profile Blocked
            </h4>
            <p className="text-xs text-neutral-600 mt-1 max-w-xs leading-relaxed">
              Thank you for keeping our community safe. {profile.name} will no longer be able to view your profile or contact you.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-sans">
            <p className="text-neutral-600 leading-relaxed">
              Your report is completely confidential. Choose the reason that best describes this concern:
            </p>

            <div className="space-y-2">
              {[
                { id: 'inappropriate_photos', label: 'Inappropriate or explicit photos' },
                { id: 'harassment', label: 'Harassment, hostility, or offensive messages' },
                { id: 'spam_bot', label: 'Spam, bot, or commercial advertisement' },
                { id: 'underage', label: 'Suspected underage account (under 18)' },
                { id: 'other', label: 'Other community guideline concern' },
              ].map((item) => (
                <label
                  key={item.id}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-colors ${
                    reason === item.id
                      ? 'bg-rose-50 border-rose-500 text-rose-950 font-medium'
                      : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="reportReason"
                    value={item.id}
                    checked={reason === item.id}
                    onChange={() => setReason(item.id as any)}
                    className="accent-rose-600"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>

            <div>
              <label className="block font-semibold text-neutral-600 uppercase mb-1">
                Additional Details (Optional)
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={2}
                placeholder="Help our Trust & Safety moderation team understand what happened..."
                className="w-full p-2.5 rounded-xl bg-white border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:border-rose-500 resize-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                {isSubmitting ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <span>Submit & Block</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

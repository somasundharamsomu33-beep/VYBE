import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  AlertTriangle,
  Clock,
  PhoneCall,
  UserCheck,
  MapPin,
  CheckCircle2,
  Bell,
  MessageSquare,
  Lock,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { SafeDateConfig } from '../../types';
import { SafeDateService } from '../../services/safeDateService';

interface SafeDateModalProps {
  partnerName?: string;
  defaultVenue?: string;
  onClose: () => void;
  onOpenReport?: () => void;
}

export const SafeDateModal: React.FC<SafeDateModalProps> = ({
  partnerName,
  defaultVenue,
  onClose,
  onOpenReport,
}) => {
  const safeDateService = SafeDateService.getInstance();
  const [config, setConfig] = useState<SafeDateConfig>(safeDateService.getConfig());
  const [contactName, setContactName] = useState(config.trustedContactName);
  const [contactPhone, setContactPhone] = useState(config.trustedContactPhone);
  const [venueName, setVenueName] = useState(defaultVenue || config.dateVenueName || '');
  const [selectedMinutes, setSelectedMinutes] = useState(config.checkInMinutes || 120);
  const [isArmed, setIsArmed] = useState(safeDateService.isCheckInActive());
  const [remainingMins, setRemainingMins] = useState(safeDateService.getRemainingMinutes());
  const [sosStatus, setSosStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'checkin' | 'contact' | 'tips'>('checkin');

  useEffect(() => {
    const timer = setInterval(() => {
      setIsArmed(safeDateService.isCheckInActive());
      setRemainingMins(safeDateService.getRemainingMinutes());
    }, 5000);
    return () => clearInterval(timer);
  }, [safeDateService]);

  const handleArmCheckIn = () => {
    const updated = safeDateService.armCheckIn(
      partnerName || 'Date Partner',
      venueName || 'Designated Public Venue',
      selectedMinutes
    );
    setConfig(updated);
    setIsArmed(true);
    setRemainingMins(selectedMinutes);
  };

  const handleCancelCheckIn = () => {
    safeDateService.cancelCheckIn();
    setIsArmed(false);
    setRemainingMins(0);
    setConfig(safeDateService.getConfig());
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = safeDateService.updateConfig({
      trustedContactName: contactName,
      trustedContactPhone: contactPhone,
    });
    setConfig(updated);
    alert('Trusted contact updated successfully.');
  };

  const handleTriggerSOS = async () => {
    if (confirm('Simulate triggering emergency SOS to your trusted contact?')) {
      const res = await safeDateService.triggerEmergencySOS();
      setSosStatus(res.simulatedMessage);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] text-neutral-900 w-full max-w-sm rounded-t-[32px] sm:rounded-[32px] border border-neutral-200 shadow-2xl flex flex-col overflow-hidden max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-200/80 bg-white/90 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h2 className="font-serif font-bold text-sm text-neutral-900 leading-tight">
                SafeDate Center
              </h2>
              <p className="text-[10px] text-neutral-500">Date Protection & Check-ins</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-neutral-200 bg-white px-4">
          <button
            onClick={() => setActiveTab('checkin')}
            className={`flex-1 py-2.5 text-xs font-semibold border-b-2 text-center transition-colors ${
              activeTab === 'checkin'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Check-In Timer
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`flex-1 py-2.5 text-xs font-semibold border-b-2 text-center transition-colors ${
              activeTab === 'contact'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Trusted Contact
          </button>
          <button
            onClick={() => setActiveTab('tips')}
            className={`flex-1 py-2.5 text-xs font-semibold border-b-2 text-center transition-colors ${
              activeTab === 'tips'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Safety Rules
          </button>
        </div>

        {/* Body content */}
        <div className="p-5 overflow-y-auto no-scrollbar space-y-4">
          {/* TAB 1: CHECK-IN TIMER */}
          {activeTab === 'checkin' && (
            <div className="space-y-4">
              {/* Active or Inactive Card */}
              {isArmed ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>SafeDate Armed</span>
                  </div>

                  <div>
                    <span className="text-3xl font-serif font-bold text-emerald-950 block">
                      {remainingMins}m
                    </span>
                    <span className="text-xs text-emerald-700">until automated check-in ping</span>
                  </div>

                  <div className="p-3 bg-white/80 rounded-xl text-left text-xs space-y-1 border border-emerald-200/60">
                    <div className="flex justify-between text-neutral-600">
                      <span>Date Partner:</span>
                      <strong className="text-neutral-900">{config.datePartnerName || partnerName || 'Match'}</strong>
                    </div>
                    <div className="flex justify-between text-neutral-600">
                      <span>Venue:</span>
                      <strong className="text-neutral-900 truncate max-w-[150px]">{config.dateVenueName || 'Sightglass'}</strong>
                    </div>
                    <div className="flex justify-between text-neutral-600">
                      <span>Trusted Contact:</span>
                      <strong className="text-neutral-900 truncate max-w-[150px]">{config.trustedContactName}</strong>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleCancelCheckIn}
                      className="flex-1 py-2.5 rounded-xl bg-white hover:bg-neutral-50 text-emerald-800 border border-emerald-300 font-semibold text-xs transition-colors"
                    >
                      I’m Safe / End Date
                    </button>
                    <button
                      onClick={handleTriggerSOS}
                      className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <AlertTriangle size={14} />
                      <span>SOS</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-neutral-800">
                    <Clock size={16} className="text-emerald-600" />
                    <h3 className="font-semibold text-xs">Arm a Date Check-In</h3>
                  </div>

                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Set a time for VYBE to discreetly text you. If you don’t confirm you are safe within 15 minutes, an alert with your date details is sent to {config.trustedContactName}.
                  </p>

                  <div>
                    <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                      Meeting Venue / Area
                    </label>
                    <input
                      type="text"
                      value={venueName}
                      onChange={(e) => setVenueName(e.target.value)}
                      placeholder="e.g. Bix Supper Club / Presidio Tunnel Tops"
                      className="w-full h-10 px-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-neutral-600 block mb-1.5">
                      Check-In Interval
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[60, 120, 180].map((mins) => (
                        <button
                          key={mins}
                          type="button"
                          onClick={() => setSelectedMinutes(mins)}
                          className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                            selectedMinutes === mins
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-xs'
                              : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                          }`}
                        >
                          {mins / 60} {mins === 60 ? 'hour' : 'hours'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleArmCheckIn}
                    className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
                  >
                    <ShieldCheck size={16} />
                    <span>Arm SafeDate Check-In</span>
                  </button>
                </div>
              )}

              {/* Emergency SOS Banner */}
              {sosStatus && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-rose-700">
                    <AlertTriangle size={14} />
                    <span>Emergency Simulated Ping</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">{sosStatus}</p>
                </div>
              )}

              {/* Quick Report & Block button */}
              <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200/80 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-semibold text-neutral-800">Uncomfortable or in danger?</h4>
                  <p className="text-[11px] text-neutral-500">Immediate access to block & report.</p>
                </div>
                {onOpenReport && (
                  <button
                    onClick={onOpenReport}
                    className="px-3 py-1.5 rounded-xl bg-white border border-neutral-200 text-rose-600 hover:bg-rose-50 font-semibold text-xs transition-colors shrink-0 flex items-center gap-1"
                  >
                    <ShieldAlert size={14} />
                    <span>Report / Block</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: TRUSTED CONTACT */}
          {activeTab === 'contact' && (
            <form onSubmit={handleSaveContact} className="space-y-3.5">
              <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 space-y-3 shadow-xs">
                <div className="flex items-center gap-2 text-neutral-900">
                  <UserCheck size={16} className="text-emerald-600" />
                  <h3 className="font-semibold text-xs">Designate a Trusted Friend</h3>
                </div>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Your trusted contact will receive your date details and check-in status if you fail to check in or press SOS.
                </p>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                    Friend’s Name & Relation
                  </label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Maya Chen (Roommate)"
                    required
                    className="w-full h-10 px-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                    Mobile Phone Number
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    required
                    className="w-full h-10 px-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-10 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs transition-colors"
                >
                  Save Contact Information
                </button>
              </div>

              {/* Simulation Notice */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 leading-relaxed">
                <strong>Simulated Security Feature:</strong> In production iOS releases, this connects with Apple Watch Fall Detection and Twilio SMS gateways. In this demo preview, all alerts are stored and verified in local state.
              </div>
            </form>
          )}

          {/* TAB 3: SAFETY RULES */}
          {activeTab === 'tips' && (
            <div className="space-y-3">
              <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 space-y-2.5 text-xs shadow-xs">
                <h3 className="font-semibold text-neutral-900 mb-2">VYBE First-Date Safety Standards</h3>

                <div className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-neutral-700">
                    <strong>Meet in public places:</strong> Always choose well-lit cafes, restaurants, or museums for initial meetings.
                  </span>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-neutral-700">
                    <strong>Stay in control of your ride:</strong> Have your own transportation arranged so you can leave at any moment.
                  </span>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-neutral-700">
                    <strong>Guard sensitive data:</strong> Keep financial accounts, home addresses, and personal routines private until deep trust is formed.
                  </span>
                </div>

                <div className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-neutral-700">
                    <strong>Listen to your gut:</strong> If something feels off, you never owe anyone an explanation to depart.
                  </span>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={handleTriggerSOS}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold inline-flex items-center gap-1.5"
                >
                  <AlertTriangle size={14} />
                  <span>Test Emergency Alert Dispatch</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

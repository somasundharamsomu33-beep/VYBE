import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Send,
  Sparkles,
  Info,
  ShieldAlert,
  MoreVertical,
  CheckCheck,
  UserX,
  Phone,
  Video,
  Calendar,
  ShieldCheck,
  Coffee,
  Palette,
  Wine,
  BookOpen,
  Compass,
  Check,
} from 'lucide-react';
import { Match, Message, Profile, DateProposal } from '../types';
import { ChatService } from '../services/chatService';
import { AvatarImage } from '../components/common/AvatarImage';
import { AIWingmateDrawer } from '../components/chat/AIWingmateDrawer';
import { DatePlannerModal } from '../components/dateplanner/DatePlannerModal';
import { SafeDateModal } from '../components/safedate/SafeDateModal';
import { VoiceVibePlayer } from '../components/voicevibe/VoiceVibePlayer';
import { INITIAL_CURRENT_USER } from '../demoData/mockProfiles';

interface ChatScreenProps {
  match: Match;
  currentUser?: Profile;
  onBack: () => void;
  onOpenProfile: (profile: Profile) => void;
  onUnmatch: (matchId: string) => void;
  onReport: (profile: Profile) => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({
  match,
  currentUser = INITIAL_CURRENT_USER,
  onBack,
  onOpenProfile,
  onUnmatch,
  onReport,
}) => {
  const chatService = ChatService.getInstance();
  const [messages, setMessages] = useState<Message[]>(chatService.getMessages(match.id));
  const [inputText, setInputText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Modals state
  const [showWingmate, setShowWingmate] = useState(false);
  const [showDatePlanner, setShowDatePlanner] = useState(false);
  const [showSafeDate, setShowSafeDate] = useState(false);

  const partner = match.matchedProfile;

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    setMessages(chatService.getMessages(match.id));
    scrollToBottom();

    // Listen for custom simulated reply events
    const handleNewMessage = (e: any) => {
      if (e.detail?.matchId === match.id) {
        setIsTyping(false);
        setMessages([...chatService.getMessages(match.id)]);
        scrollToBottom();
      }
    };

    window.addEventListener('soulsync_new_message', handleNewMessage);
    return () => {
      window.removeEventListener('soulsync_new_message', handleNewMessage);
    };
  }, [match.id]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    chatService.sendMessage(match.id, 'user_current', text, partner.name);
    setMessages([...chatService.getMessages(match.id)]);
    setInputText('');
    setIsTyping(true);
    scrollToBottom();
  };

  const handleSendDateProposal = (proposal: DateProposal) => {
    chatService.sendDateProposal(match.id, 'user_current', proposal, partner.name);
    setMessages([...chatService.getMessages(match.id)]);
    setIsTyping(true);
    scrollToBottom();
  };

  const handleAcceptProposal = (msgId: string) => {
    chatService.respondToDateProposal(match.id, msgId, 'accepted');
    setMessages([...chatService.getMessages(match.id)]);
  };

  const getVenueIcon = (type: string) => {
    switch (type) {
      case 'Coffee & Walk':
        return <Coffee size={15} className="text-amber-600" />;
      case 'Art & Museum':
        return <Palette size={15} className="text-indigo-600" />;
      case 'Cocktails & Jazz':
        return <Wine size={15} className="text-rose-600" />;
      case 'Bookstore & Pastry':
        return <BookOpen size={15} className="text-emerald-600" />;
      default:
        return <Compass size={15} className="text-rose-600" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#FAF8F5] text-neutral-900 overflow-hidden relative">
      {/* Top Header */}
      <div className="px-3.5 py-2.5 bg-white/90 backdrop-blur-md border-b border-neutral-200/80 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={onBack}
            className="w-8 h-8 -ml-1 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-700 transition-colors shrink-0"
          >
            <ArrowLeft size={18} />
          </button>

          <button
            onClick={() => onOpenProfile(partner)}
            className="flex items-center gap-2 group text-left min-w-0"
          >
            <div className="w-9 h-9 rounded-full overflow-hidden border border-rose-200 shadow-xs shrink-0">
              <AvatarImage
                src={partner.photos[0]}
                alt={partner.name}
                fallbackName={partner.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <h3 className="text-xs font-semibold text-neutral-900 group-hover:text-rose-600 transition-colors leading-tight truncate">
                  {partner.name}
                </h3>
                {partner.verified && (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" title="Selfie Verified" />
                )}
              </div>
              <span className="text-[10px] text-neutral-500 truncate block">
                Seeking: {partner.relationshipGoal}
              </span>
            </div>
          </button>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 text-neutral-600 shrink-0">
          {/* Plan Date CTA */}
          <button
            onClick={() => setShowDatePlanner(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-[11px] font-semibold transition-colors"
            title="Plan a Date"
          >
            <Calendar size={13} />
            <span className="hidden sm:inline">Plan Date</span>
          </button>

          {/* SafeDate CTA */}
          <button
            onClick={() => setShowSafeDate(true)}
            className="w-8 h-8 rounded-full hover:bg-neutral-100 text-emerald-600 flex items-center justify-center transition-colors"
            title="SafeDate Security Center"
          >
            <ShieldCheck size={17} />
          </button>

          {/* Overflow Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center transition-colors text-neutral-500"
            >
              <MoreVertical size={16} />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 top-10 w-44 bg-white rounded-2xl shadow-xl border border-neutral-200 py-1 z-30 animate-in fade-in zoom-in-95 duration-150">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onOpenProfile(partner);
                  }}
                  className="w-full px-3.5 py-2 text-xs text-neutral-700 hover:bg-neutral-50 flex items-center gap-2"
                >
                  <Info size={14} />
                  <span>View Full Profile</span>
                </button>

                <button
                  onClick={() => {
                    setShowMenu(false);
                    setShowDatePlanner(true);
                  }}
                  className="w-full px-3.5 py-2 text-xs text-neutral-700 hover:bg-neutral-50 flex items-center gap-2"
                >
                  <Calendar size={14} />
                  <span>Explore Date Ideas</span>
                </button>

                <button
                  onClick={() => {
                    setShowMenu(false);
                    setShowSafeDate(true);
                  }}
                  className="w-full px-3.5 py-2 text-xs text-emerald-700 hover:bg-emerald-50 flex items-center gap-2"
                >
                  <ShieldCheck size={14} />
                  <span>SafeDate Settings</span>
                </button>

                <div className="border-t border-neutral-100 my-1" />

                <button
                  onClick={() => {
                    setShowMenu(false);
                    if (confirm(`Unmatch with ${partner.name}? This will remove your chat.`)) {
                      onUnmatch(match.id);
                    }
                  }}
                  className="w-full px-3.5 py-2 text-xs text-neutral-700 hover:bg-neutral-50 flex items-center gap-2"
                >
                  <UserX size={14} />
                  <span>Unmatch</span>
                </button>

                <button
                  onClick={() => {
                    setShowMenu(false);
                    onReport(partner);
                  }}
                  className="w-full px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                >
                  <ShieldAlert size={14} />
                  <span>Report / Block</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Voice Vibe Teaser Bar if available */}
      {partner.voiceVibe && (
        <div className="px-3.5 py-2 bg-gradient-to-r from-rose-50 via-white to-rose-50 border-b border-rose-100 shrink-0">
          <VoiceVibePlayer
            voiceVibe={partner.voiceVibe}
            authorName={partner.name}
          />
        </div>
      )}

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
        {/* Match celebration badge */}
        <div className="text-center my-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-neutral-200/80 text-[11px] text-neutral-500 shadow-xs">
            <span>You connected with {partner.name}</span>
            <span>·</span>
            <span className="font-medium text-rose-600">SoulSync</span>
          </div>
        </div>

        {/* Conversation Bubbles & Date Proposals */}
        {messages.map((msg) => {
          const isMe = msg.senderId === 'user_current';

          // Render Rich Date Proposal Card if attached to message
          if (msg.dateProposal) {
            const proposal = msg.dateProposal;
            const isAccepted = proposal.status === 'accepted';

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} my-2`}
              >
                <div className="w-full max-w-[85%] sm:max-w-xs bg-white rounded-2xl border border-rose-200 shadow-md p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 font-mono">
                      📅 Date Invitation
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isAccepted
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {isAccepted ? 'Accepted 🎉' : 'Proposed'}
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center shrink-0 mt-0.5">
                      {getVenueIcon(proposal.venueType)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900 leading-tight">
                        {proposal.venueTitle}
                      </h4>
                      <p className="text-[11px] text-neutral-500">
                        {proposal.locationArea} · {proposal.venueType}
                      </p>
                    </div>
                  </div>

                  <div className="p-2.5 bg-neutral-50 rounded-xl text-xs space-y-1">
                    <div className="text-neutral-700 font-medium">
                      🕒 {proposal.proposedDate} at {proposal.proposedTime}
                    </div>
                    {proposal.note && (
                      <p className="text-[11px] text-neutral-500 italic">
                        &ldquo;{proposal.note}&rdquo;
                      </p>
                    )}
                  </div>

                  {!isAccepted && !isMe && (
                    <button
                      onClick={() => handleAcceptProposal(msg.id)}
                      className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Check size={14} />
                      <span>Accept Invitation</span>
                    </button>
                  )}

                  {isAccepted && (
                    <div className="text-center text-[11px] font-semibold text-emerald-700">
                      Confirmed! You have a date scheduled ✨
                    </div>
                  )}
                </div>

                <span className="text-[10px] text-neutral-400 px-1 font-mono mt-0.5">
                  {msg.timestamp}
                </span>
              </div>
            );
          }

          // Standard Message Bubble
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
            >
              <div
                className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed font-sans shadow-xs ${
                  isMe
                    ? 'bg-rose-600 text-white rounded-br-xs'
                    : 'bg-white text-neutral-900 border border-neutral-200/80 rounded-bl-xs'
                }`}
              >
                {msg.text}
              </div>

              {/* Timestamp & Read Receipt */}
              <div className="flex items-center gap-1 text-[10px] text-neutral-500 px-1 font-mono">
                <span>{msg.timestamp}</span>
                {isMe && <CheckCheck size={11} className="text-rose-600" />}
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 p-2">
            <span className="font-medium">{partner.name} is typing</span>
            <span className="flex gap-0.5">
              <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce delay-150" />
              <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce delay-300" />
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Icebreakers Bar with AI Wingmate Highlight */}
      <div className="px-3.5 py-1.5 border-t border-neutral-100 bg-white/70 flex items-center justify-between gap-2">
        <button
          onClick={() => setShowWingmate(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 text-white text-[11px] font-bold shadow-xs hover:scale-102 active:scale-98 transition-all shrink-0"
        >
          <Sparkles size={13} className="text-amber-200" />
          <span>AI Wingmate</span>
        </button>

        <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => handleSend(`Hey ${partner.name}! Loved your prompt on "${partner.prompts[0]?.question || 'life'}".`)}
            className="shrink-0 text-left text-[11px] bg-rose-50/80 hover:bg-rose-100 text-rose-900 border border-rose-200/60 rounded-xl px-2.5 py-1 transition-colors truncate max-w-[200px]"
          >
            Ask about prompt
          </button>
          <button
            onClick={() => handleSend(`What’s your favorite quiet neighborhood spot for coffee or tea?`)}
            className="shrink-0 text-left text-[11px] bg-rose-50/80 hover:bg-rose-100 text-rose-900 border border-rose-200/60 rounded-xl px-2.5 py-1 transition-colors truncate max-w-[200px]"
          >
            Favorite quiet spot?
          </button>
        </div>
      </div>

      {/* Message Input Box */}
      <div className="p-3 bg-white/95 backdrop-blur-md border-t border-neutral-200/80 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message ${partner.name}...`}
            className="flex-1 h-11 px-4 rounded-2xl bg-neutral-100 border border-neutral-200 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:bg-white focus:border-rose-500 transition-all"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-11 h-11 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:scale-100 shadow-sm"
          >
            <Send size={16} />
          </button>
        </form>
      </div>

      {/* AI WINGMATE DRAWER MODAL */}
      {showWingmate && (
        <AIWingmateDrawer
          currentUser={currentUser}
          partner={partner}
          onClose={() => setShowWingmate(false)}
          onSelectStarter={(starter, autoSend) => {
            if (autoSend) {
              handleSend(starter);
            } else {
              setInputText(starter);
            }
          }}
        />
      )}

      {/* DATE PLANNER MODAL */}
      {showDatePlanner && (
        <DatePlannerModal
          partner={partner}
          onClose={() => setShowDatePlanner(false)}
          onSendProposal={handleSendDateProposal}
        />
      )}

      {/* SAFEDATE MODAL */}
      {showSafeDate && (
        <SafeDateModal
          partnerName={partner.name}
          defaultVenue="Sightglass Coffee / Presidio Walk"
          onClose={() => setShowSafeDate(false)}
          onOpenReport={() => {
            setShowSafeDate(false);
            onReport(partner);
          }}
        />
      )}
    </div>
  );
};

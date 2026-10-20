import { Message } from '../types';
import { INITIAL_CONVERSATIONS } from '../demoData/mockProfiles';
import { MatchService } from './matchService';

const CHAT_STORAGE_KEY = 'vibe_soulsync_chats';

export class ChatService {
  private static instance: ChatService;
  private conversations: Record<string, Message[]>;

  private constructor() {
    const stored = localStorage.getItem(CHAT_STORAGE_KEY);
    if (stored) {
      try {
        this.conversations = JSON.parse(stored);
      } catch {
        this.conversations = { ...INITIAL_CONVERSATIONS };
      }
    } else {
      this.conversations = { ...INITIAL_CONVERSATIONS };
      this.persist();
    }
  }

  public static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  private persist() {
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(this.conversations));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  }

  public getMessages(matchId: string): Message[] {
    return this.conversations[matchId] || [];
  }

  public sendMessage(
    matchId: string,
    senderId: string,
    text: string,
    partnerName?: string
  ): Message {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      matchId,
      senderId,
      text,
      timestamp: timeStr,
      status: 'sent',
    };

    if (!this.conversations[matchId]) {
      this.conversations[matchId] = [];
    }

    this.conversations[matchId].push(newMsg);
    this.persist();

    // Update match summary in MatchService
    MatchService.getInstance().updateLastMessage(matchId, text);

    // If sent by user, schedule a warm, thoughtful partner reply
    if (senderId === 'user_current') {
      setTimeout(() => {
        this.simulatePartnerReply(matchId, text, partnerName);
      }, 1400);
    }

    return newMsg;
  }

  public sendDateProposal(
    matchId: string,
    senderId: string,
    proposal: import('../types').DateProposal,
    partnerName?: string
  ): Message {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg: Message = {
      id: `msg_date_${Date.now()}`,
      matchId,
      senderId,
      text: `Proposed a date: ${proposal.venueTitle} (${proposal.proposedDate} at ${proposal.proposedTime})`,
      timestamp: timeStr,
      status: 'sent',
      dateProposal: proposal,
    };

    if (!this.conversations[matchId]) {
      this.conversations[matchId] = [];
    }

    this.conversations[matchId].push(newMsg);
    this.persist();

    MatchService.getInstance().updateLastMessage(
      matchId,
      `📅 Proposed date at ${proposal.venueTitle}`
    );

    // Partner simulated acceptance after 1.8 seconds
    if (senderId === 'user_current') {
      setTimeout(() => {
        this.simulatePartnerDateResponse(matchId, proposal, partnerName);
      }, 1800);
    }

    return newMsg;
  }

  public respondToDateProposal(
    matchId: string,
    messageId: string,
    newStatus: 'accepted' | 'declined'
  ): void {
    const msgs = this.conversations[matchId];
    if (!msgs) return;

    const targetMsg = msgs.find((m) => m.id === messageId);
    if (targetMsg && targetMsg.dateProposal) {
      targetMsg.dateProposal.status = newStatus;
      this.persist();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('soulsync_new_message', { detail: { matchId } }));
      }
    }
  }

  private simulatePartnerDateResponse(
    matchId: string,
    proposal: import('../types').DateProposal,
    partnerName?: string
  ) {
    const msgs = this.conversations[matchId];
    if (msgs) {
      const propMsg = msgs.find((m) => m.dateProposal?.id === proposal.id);
      if (propMsg && propMsg.dateProposal) {
        propMsg.dateProposal.status = 'accepted';
      }
    }

    const partnerResponses = [
      `I would love to meet you at ${proposal.venueTitle}! ${proposal.proposedDate} at ${proposal.proposedTime} works wonderfully for me. Looking forward to it! ✨`,
      `That sounds so delightful! I’ve been wanting to visit ${proposal.venueTitle}. Count me in for ${proposal.proposedTime}!`,
      `Yes, absolutely! It’s a date. I’ll see you at ${proposal.venueTitle} on ${proposal.proposedDate}.`,
    ];
    const replyText = partnerResponses[Math.floor(Math.random() * partnerResponses.length)];
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const replyMsg: Message = {
      id: `reply_date_${Date.now()}`,
      matchId,
      senderId: 'partner',
      text: replyText,
      timestamp: timeStr,
      status: 'delivered',
    };

    if (!this.conversations[matchId]) {
      this.conversations[matchId] = [];
    }
    this.conversations[matchId].push(replyMsg);
    this.persist();

    MatchService.getInstance().updateLastMessage(matchId, `🎉 Date confirmed at ${proposal.venueTitle}`);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('soulsync_new_message', { detail: { matchId } }));
    }
  }

  private simulatePartnerReply(matchId: string, userText: string, partnerName?: string) {
    const responses = [
      `I really appreciate you saying that! It’s rare to find someone who gets that so effortlessly.`,
      `That sounds so lovely. I’ve actually been wanting to explore that part of town too!`,
      `You have such a genuine way of expressing yourself. What’s your favorite memory related to that?`,
      `Haha completely agree! We should definitely share that over coffee or a glass of wine soon.`,
      `That’s so thoughtful! Tell me more about what inspired that.`,
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const replyMsg: Message = {
      id: `reply_${Date.now()}`,
      matchId,
      senderId: 'partner',
      text: randomResponse,
      timestamp: timeStr,
      status: 'delivered',
    };

    if (!this.conversations[matchId]) {
      this.conversations[matchId] = [];
    }

    this.conversations[matchId].push(replyMsg);
    this.persist();

    MatchService.getInstance().updateLastMessage(matchId, replyMsg.text);

    // Dispatch custom window event so open Chat screens can re-render reactively
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('soulsync_new_message', { detail: { matchId } }));
    }
  }

  public clearConversation(matchId: string): void {
    delete this.conversations[matchId];
    this.persist();
  }
}

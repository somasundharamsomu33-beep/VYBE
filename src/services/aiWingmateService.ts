import { Profile } from '../types';

export interface WingmateSuggestion {
  id: string;
  category: 'shared_interest' | 'prompt_hook' | 'romantic_curiosity' | 'playful_vibe';
  starter: string;
  rationale: string;
}

export interface IAIWingmateService {
  generateStarters(currentUser: Profile, partner: Profile): Promise<WingmateSuggestion[]>;
}

export class AIWingmateService implements IAIWingmateService {
  private static instance: AIWingmateService;

  public static getInstance(): AIWingmateService {
    if (!AIWingmateService.instance) {
      AIWingmateService.instance = new AIWingmateService();
    }
    return AIWingmateService.instance;
  }

  /**
   * Generates tailored conversation starters using shared profile heuristics.
   * Can be swapped out for a server-side Gemini API or LLM endpoint in production.
   */
  public async generateStarters(
    currentUser: Profile,
    partner: Profile
  ): Promise<WingmateSuggestion[]> {
    // Simulate brief generation delay for realistic feeling
    await new Promise((res) => setTimeout(res, 400));

    const sharedInterests = currentUser.interests.filter((item) =>
      partner.interests.some((pi) => pi.toLowerCase() === item.toLowerCase())
    );

    const suggestions: WingmateSuggestion[] = [];

    // 1. Shared Interest or Top Partner Interest Hook
    if (sharedInterests.length > 0) {
      const topShared = sharedInterests[0];
      suggestions.push({
        id: `wm_shared_${Date.now()}_1`,
        category: 'shared_interest',
        starter: `I saw that we both share a love for ${topShared}. What got you into it, and do you have a favorite spot in town for it?`,
        rationale: `Leverages your mutual connection on "${topShared}" to build immediate rapport.`,
      });
    } else if (partner.interests.length > 0) {
      const partnerInterest = partner.interests[0];
      suggestions.push({
        id: `wm_interest_${Date.now()}_1`,
        category: 'shared_interest',
        starter: `Your passion for ${partnerInterest} caught my eye! How did that start for you?`,
        rationale: `Asks an open-ended question about ${partner.name}'s highlighted passion.`,
      });
    }

    // 2. Prompt Hook from partner's prompt answers
    if (partner.prompts && partner.prompts.length > 0) {
      const prompt = partner.prompts[0];
      suggestions.push({
        id: `wm_prompt_${Date.now()}_2`,
        category: 'prompt_hook',
        starter: `I had a smile reading what you said about "${prompt.question}" — "${prompt.answer.slice(0, 48)}...". Tell me more about that story!`,
        rationale: `Directly references a specific prompt quote to prove you read their profile attentively.`,
      });
    } else {
      suggestions.push({
        id: `wm_prompt_${Date.now()}_2`,
        category: 'prompt_hook',
        starter: `Your photography and bio have such a calming energy. How has your week been treating you so far?`,
        rationale: `Warm, observant compliment that invites an easy reply.`,
      });
    }

    // 3. Goal / Vibe / Lifestyle Curiosity
    if (partner.relationshipGoal === currentUser.relationshipGoal) {
      suggestions.push({
        id: `wm_curiosity_${Date.now()}_3`,
        category: 'romantic_curiosity',
        starter: `It’s so refreshing to see someone else who is also looking for a ${partner.relationshipGoal.toLowerCase()}. What does building an intentional connection feel like to you?`,
        rationale: `Celebrates aligned relationship intentions for depth from message one.`,
      });
    } else if (partner.spotifyAnthem) {
      suggestions.push({
        id: `wm_music_${Date.now()}_3`,
        category: 'playful_vibe',
        starter: `Loved seeing "${partner.spotifyAnthem.songTitle}" on your profile. Incredible taste — do you have a soundtrack for Sunday mornings?`,
        rationale: `Connects effortlessly over music and acoustic aesthetic.`,
      });
    } else {
      suggestions.push({
        id: `wm_vibe_${Date.now()}_3`,
        category: 'playful_vibe',
        starter: `Coffee walk or evening gallery stroll — if we were planning a relaxed first catch-up, what’s your ideal rhythm?`,
        rationale: `Low pressure, imaginative question exploring date compatibility.`,
      });
    }

    return suggestions;
  }
}

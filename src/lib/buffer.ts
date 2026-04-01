// Buffer API Integration for Trademate AI
// Handles auto-posting to Facebook, Instagram, LinkedIn, Twitter

const BUFFER_API_BASE = 'https://api.bufferapp.com/1';

interface BufferProfile {
  id: string;
  service: string;
  formatted_username: string;
  avatar: string;
}

interface BufferUpdate {
  text: string;
  profile_ids: string[];
  media?: {
    link?: string;
    photo?: string;
    thumbnail?: string;
    picture?: string;
  };
  scheduled_at?: number; // Unix timestamp
}

export class BufferService {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${BUFFER_API_BASE}${endpoint}`;
    const params = new URLSearchParams({ access_token: this.accessToken });
    
    const response = await fetch(`${url}?${params}`, {
      ...options,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Buffer API error');
    }

    return response.json();
  }

  // Get connected profiles
  async getProfiles(): Promise<BufferProfile[]> {
    return this.request('/profiles.json', { method: 'GET' });
  }

  // Get pending updates
  async getPendingUpdates(profileId: string) {
    return this.request(`/profiles/${profileId}/updates/pending.json`, { method: 'GET' });
  }

  // Create a new update (post)
  async createUpdate(update: BufferUpdate) {
    const formData = new URLSearchParams();
    formData.append('text', update.text);
    update.profile_ids.forEach(id => formData.append('profile_ids[]', id));
    
    if (update.media) {
      if (update.media.link) formData.append('media[link]', update.media.link);
      if (update.media.photo) formData.append('media[photo]', update.media.photo);
      if (update.media.thumbnail) formData.append('media[thumbnail]', update.media.thumbnail);
    }

    if (update.scheduled_at) {
      formData.append('scheduled_at', update.scheduled_at.toString());
    }

    return this.request('/updates/create.json', {
      method: 'POST',
      body: formData,
    });
  }

  // Post now (no scheduling)
  async postNow(text: string, profileIds: string[], media?: BufferUpdate['media']) {
    return this.createUpdate({ text, profile_ids: profileIds, media });
  }

  // Schedule a post
  async schedulePost(text: string, profileIds: string[], scheduleAt: Date, media?: BufferUpdate['media']) {
    const unixTime = Math.floor(scheduleAt.getTime() / 1000);
    return this.createUpdate({ 
      text, 
      profile_ids: profileIds, 
      scheduled_at: unixTime,
      media 
    });
  }

  // Share a link with media
  async shareLink(url: string, text: string, profileIds: string[], scheduleAt?: Date) {
    const update: BufferUpdate = {
      text,
      profile_ids: profileIds,
      media: { link: url },
    };

    if (scheduleAt) {
      update.scheduled_at = Math.floor(scheduleAt.getTime() / 1000);
    }

    return this.createUpdate(update);
  }

  // Post job completion to all platforms
  async postJobCompletion(
    job: {
      trade: string;
      town: string;
      description: string;
      photoUrl?: string;
    },
    profileIds: string[],
    scheduleAt?: Date
  ) {
    const templates: Record<string, string> = {
      facebook: `${job.trade} job complete in ${job.town}! 🔧 ${job.description} | Free quotes available — call us or DM. #${job.trade} #${job.town} #UKtrades`,
      instagram: `${job.trade} job done! ✨ ${job.description} | DM for free quote | #${job.trade}${job.town} #uktrades #professional`,
      linkedin: `${job.trade} job completed in ${job.town}. ${job.description}. #UKTrades #SmallBusiness`,
      twitter: `Just finished a ${job.trade} job in ${job.town}! 🔧 #${job.trade} #UKTrades`,
    };

    // For now, use the first template (would iterate per platform in production)
    const text = templates.facebook;

    if (job.photoUrl) {
      return this.schedulePost(text, profileIds, scheduleAt || new Date(), {
        photo: job.photoUrl,
      });
    }

    return this.schedulePost(text, profileIds, scheduleAt || new Date());
  }
}

// Helper to post from job completion
export async function autoPostJobCompletion(
  bufferToken: string,
  job: {
    trade: string;
    town: string;
    description: string;
    photoUrl?: string;
  },
  platforms: ('facebook' | 'instagram' | 'linkedin' | 'twitter')[]
) {
  const buffer = new BufferService(bufferToken);
  
  const profiles = await buffer.getProfiles();
  
  const platformMap: Record<string, string> = {
    facebook: 'facebook',
    instagram: 'instagram',
    linkedin: 'linkedin',
    twitter: 'twitter',
  };

  const profileIds = profiles
    .filter(p => platforms.includes(p.service as any))
    .map(p => p.id);

  if (profileIds.length === 0) {
    throw new Error('No connected profiles found for selected platforms');
  }

  return buffer.postJobCompletion(job, profileIds);
}

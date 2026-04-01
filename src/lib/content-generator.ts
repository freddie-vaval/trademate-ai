// AI Content Generator for Trademate AI
// Generates social media captions from job data

interface JobData {
  trade: string;
  town: string;
  description: string;
  customerName?: string;
  photos?: string[];
}

interface GeneratedPost {
  platform: string;
  content: string;
  hashtags: string[];
  mediaUrls: string[];
}

// Template prompts for different platforms
const TEMPLATES = {
  facebook: {
    jobCompletion: (d: JobData) => 
      `${d.trade} job complete in ${d.town}! 🔧 ${d.description} | Free quotes available — call us or DM. #${d.trade} #${d.town} #UKtrades`,
    reviewRequest: (d: JobData) =>
      `Hi${d.customerName ? ` ${d.customerName}` : ''}! Thanks for choosing us for your ${d.trade} work. We'd love a quick review — it helps other homeowners find us! ⭐⭐⭐⭐⭐`,
    weeklyStats: (d: JobData) =>
      `${d.town} ${d.trade} update: Another great week! ${d.description}. Ready to help with your next job. #${d.trade} #${d.town} #UKTrades`,
  },
  instagram: {
    jobCompletion: (d: JobData) =>
      `${d.trade} job done! ✨ ${d.description} | DM for free quote | #${d.trade}${d.town} #uktrades #professional #${d.trade}life`,
    reviewRequest: (d: JobData) =>
      `Thanks for choosing us${d.customerName ? ` ${d.customerName}` : ''}! ⭐ We'd love a review: link in bio #${d.trade} #customerlove`,
    beforeAfter: (d: JobData) =>
      `Before & after ✨ ${d.description} #${d.trade} #transformation #${d.town} #UKTrades`,
  },
  linkedin: {
    jobCompletion: (d: JobData) =>
      `${d.trade} job completed in ${d.town}. ${d.description}. #UKTrades #SmallBusiness #${d.trade} #Professional`,
    testimonial: (d: JobData) =>
      `Another happy customer! ${d.description}. Great working in ${d.town}. #CustomerSuccess #UKTrades`,
  },
  tiktok: {
    jobCompletion: (d: JobData) =>
      `Just finished this ${d.trade} job in ${d.town}! 🔥 ${d.description} #tradeslife #${d.trade} #uktrades #fyp`,
    behindScenes: (d: JobData) =>
      `Day in the life of a ${d.trade} in ${d.town} 🔧 #tradesman #${d.trade} #uktrades #viral`,
  },
};

// Generate content using templates (fallback when AI is unavailable)
export function generateFromTemplate(
  platform: string,
  type: 'jobCompletion' | 'reviewRequest' | 'weeklyStats' | 'beforeAfter',
  data: JobData
): string {
  const platformTemplates = TEMPLATES[platform as keyof typeof TEMPLATES];
  if (!platformTemplates) {
    return TEMPLATES.facebook.jobCompletion(data);
  }

  const templateFn = platformTemplates[type as keyof typeof platformTemplates];
  if (!templateFn) {
    return TEMPLATES.facebook.jobCompletion(data);
  }

  return templateFn(data);
}

// Generate all platforms at once
export function generateAllPlatforms(job: JobData): GeneratedPost[] {
  const posts: GeneratedPost[] = [];
  
  const platforms = ['facebook', 'instagram', 'linkedin', 'tiktok'] as const;
  
  for (const platform of platforms) {
    const content = generateFromTemplate(platform, 'jobCompletion', job);
    posts.push({
      platform,
      content,
      hashtags: extractHashtags(content),
      mediaUrls: job.photos || [],
    });
  }

  return posts;
}

// Extract hashtags from text
function extractHashtags(text: string): string[] {
  const matches = text.match(/#[a-z0-9]+/gi);
  return matches ? matches.map(h => h.toLowerCase()) : [];
}

// AI-powered generation (requires MiniMax/OpenAI)
export async function generateAIContent(
  apiKey: string,
  job: JobData,
  platform: string
): Promise<string> {
  const prompt = `Generate a social media post for a ${job.trade} in ${job.town}.
  
Job details: ${job.description}
Platform: ${platform}
Tone: Professional but friendly, UK English

Requirements:
- Include relevant hashtags
- Include a call to action
- Keep it under 280 characters (or 2200 for Facebook/LinkedIn)
- Sound like a real tradesperson, not a robot

Generate the post:`;

  // This would call MiniMax or OpenAI in production
  // For now, fall back to template
  return generateFromTemplate(platform, 'jobCompletion', job);
}

// Weekly stats generator
export function generateWeeklyStats(
  businessName: string,
  stats: {
    jobsCompleted: number;
    newCustomers: number;
    quotesSent: number;
    revenue: number;
  }
): Record<string, string> {
  const text = `${businessName} week in numbers: ${stats.jobsCompleted} jobs completed | ${stats.newCustomers} new customers | ${stats.quotesSent} quotes sent | £${stats.revenue} revenue. How's your week looking? #UKTrades #SmallBusiness`;

  return {
    facebook: text,
    instagram: `${stats.jobsCompleted} jobs this week 🔥 #${businessName.toLowerCase().replace(/\s/g, '')} #uktrades`,
    linkedin: `${businessName} Weekly Report: ${stats.jobsCompleted} completed, ${stats.newCustomers} new customers, £${stats.revenue} revenue. #UKTrades #BusinessGrowth`,
    twitter: `${stats.jobsCompleted} jobs | £${stats.revenue} revenue | ${stats.newCustomers} new customers this week! 🔧 #UKTrades`,
  };
}

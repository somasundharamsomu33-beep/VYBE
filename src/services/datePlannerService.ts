import { DateProposal } from '../types';

export interface CuratedVenue {
  id: string;
  title: string;
  type: 'Coffee & Walk' | 'Cocktails & Jazz' | 'Art & Museum' | 'Bookstore & Pastry' | 'Dinner';
  neighborhood: string;
  atmosphere: string;
  estimatedCost: '$' | '$$' | '$$$';
  recommendedTime: string;
  description: string;
}

export const SAMPLE_CURATED_VENUES: CuratedVenue[] = [
  {
    id: 'venue_1',
    title: 'Sightglass Coffee & Pastries',
    type: 'Coffee & Walk',
    neighborhood: 'SOMA / 7th St',
    atmosphere: 'Spacious, industrial wood & copper aesthetic, fresh roasts',
    estimatedCost: '$',
    recommendedTime: 'Saturday 10:30 AM',
    description: 'Casual morning coffee with skylight seating and warm artisan pastries.',
  },
  {
    id: 'venue_2',
    title: 'SFMOMA & Rooftop Sculpture Terrace',
    type: 'Art & Museum',
    neighborhood: 'Downtown / Yerba Buena',
    atmosphere: 'Serene, contemporary, quiet art conversation',
    estimatedCost: '$$',
    recommendedTime: 'Thursday 5:00 PM',
    description: 'Stroll through 20th-century paintings followed by drinks on the living wall terrace.',
  },
  {
    id: 'venue_3',
    title: 'Bix Jazz Supper Club',
    type: 'Cocktails & Jazz',
    neighborhood: 'Jackson Square',
    atmosphere: 'Candlelit 1930s speakeasy, grand piano jazz, classic cocktails',
    estimatedCost: '$$$',
    recommendedTime: 'Friday 7:30 PM',
    description: 'Tucked down an alleyway, romantic live jazz and bespoke negronis.',
  },
  {
    id: 'venue_4',
    title: 'Green Apple Books & Tartine Bakery',
    type: 'Bookstore & Pastry',
    neighborhood: 'Inner Sunset',
    atmosphere: 'Cozy, nostalgic, literary banter & fresh morning sourdough',
    estimatedCost: '$',
    recommendedTime: 'Sunday 11:00 AM',
    description: 'Browse vintage paperbacks together, then share warm morning pastries on a park bench.',
  },
  {
    id: 'venue_5',
    title: 'Presidio Tunnel Tops & Sunset Walk',
    type: 'Coffee & Walk',
    neighborhood: 'Presidio',
    atmosphere: 'Coastal breeze, sweeping Golden Gate vistas, outdoor fire pits',
    estimatedCost: '$',
    recommendedTime: 'Saturday 5:30 PM',
    description: 'Unbeatable golden-hour views of the bay with hot thermoses of tea or mulled cider.',
  },
];

export class DatePlannerService {
  private static instance: DatePlannerService;

  public static getInstance(): DatePlannerService {
    if (!DatePlannerService.instance) {
      DatePlannerService.instance = new DatePlannerService();
    }
    return DatePlannerService.instance;
  }

  public getCuratedVenues(): CuratedVenue[] {
    return SAMPLE_CURATED_VENUES;
  }

  public createProposal(
    venue: CuratedVenue,
    dateStr: string,
    timeStr: string,
    senderId: string,
    note?: string
  ): DateProposal {
    return {
      id: `prop_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      venueTitle: venue.title,
      venueType: venue.type,
      locationArea: venue.neighborhood,
      proposedDate: dateStr,
      proposedTime: timeStr,
      note: note || `Would love to invite you for ${venue.type.toLowerCase()} here!`,
      status: 'proposed',
      senderId,
    };
  }
}

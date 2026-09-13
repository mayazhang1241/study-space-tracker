export interface StudySpot {
  id: string;
  name: string;
  building: string;
  floor: string;
  capacity: number;
  currentOccupancy: number;
  isAvailable: boolean;
  lat: number;
  lng: number;
  description: string;
  amenities: string[];
  lastUpdated: Date;
}

export interface CheckIn {
  id: string;
  userId: string;
  spotId: string;
  action: 'checkin' | 'checkout';
  timestamp: Date;
}

export interface AppUser {
  uid: string;
  email: string;
  favoriteSpots: string[];
  currentCheckin: string | null;
}

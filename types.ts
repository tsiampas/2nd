
export enum SportType {
  FOOTBALL = 'Ποδόσφαιρο',
  BASKETBALL = 'Μπάσκετ',
  TENNIS = 'Τένις',
  VOLLEYBALL = 'Βόλεϊ',
  MOTORSPORT = 'Μηχανοκίνητα',
  OTHER = 'Άλλα Αθλήματα'
}

export interface BroadcastEvent {
  id: string;
  time: string;
  sport: SportType;
  competition: string;
  match: string;
  channel: string;
}

export interface SportsDay {
  date: string;
  events: BroadcastEvent[];
}

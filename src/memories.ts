export type MemoryCategory =
  | "Memories"
  | "Photos"
  | "Things I Love"
  | "Places We've Been"
  | "Future Plans"
  | "Inside Jokes";

export interface Memory {
  id: string;
  category: MemoryCategory;
  title: string;
  description: string;
  imageQuery: string;
  x: number;
  y: number;
}

export const CATEGORY_META: Record<
  MemoryCategory,
  { color: string; glow: string; icon: string }
> = {
  Memories: { color: "#fbbf24", glow: "rgba(251,191,36,0.7)", icon: "Sparkles" },
  Photos: { color: "#38bdf8", glow: "rgba(56,189,248,0.7)", icon: "Camera" },
  "Things I Love": { color: "#f472b6", glow: "rgba(244,114,182,0.7)", icon: "Heart" },
  "Places We've Been": { color: "#34d399", glow: "rgba(52,211,153,0.7)", icon: "MapPin" },
  "Future Plans": { color: "#c084fc", glow: "rgba(192,132,252,0.7)", icon: "Rocket" },
  "Inside Jokes": { color: "#fb923c", glow: "rgba(251,146,60,0.7)", icon: "Smile" },
};

export const MEMORIES: Memory[] = [
  // Memories
  { id: "m1", category: "Memories", title: "The First Hello", description: "I still remember the exact moment we met. The way you smiled made the whole world feel quieter. Everything since has been a beautiful echo of that first second.", imageQuery: "first meeting romantic", x: 0.18, y: 0.22 },
  { id: "m2", category: "Memories", title: "Rainy Sunday", description: "We did nothing that day — absolutely nothing — and it became one of my favorite days of my life. Just you, the sound of rain, and nowhere to be.", imageQuery: "rainy window cozy", x: 0.72, y: 0.18 },
  { id: "m3", category: "Memories", title: "Midnight Conversations", description: "Talking until 3am about everything and nothing. Those conversations taught me who you really are — and made me fall harder every time.", imageQuery: "night sky stars conversation", x: 0.45, y: 0.72 },

  // Photos
  { id: "p1", category: "Photos", title: "That Sunset", description: "You looked back at me over your shoulder and the sky was on fire behind you. I took the photo, but it never quite captured how that moment felt.", imageQuery: "golden sunset silhouette", x: 0.12, y: 0.55 },
  { id: "p2", category: "Photos", title: "Laughing Eyes", description: "The candid one where you're mid-laugh, eyes crinkled, completely yourself. It's my favorite photo in the world.", imageQuery: "woman laughing candid", x: 0.82, y: 0.42 },
  { id: "p3", category: "Photos", title: "Hands Held", description: "A quiet photo of our hands together. Simple, ordinary, and everything.", imageQuery: "couple holding hands", x: 0.58, y: 0.12 },

  // Things I Love
  { id: "l1", category: "Things I Love", title: "Your Laugh", description: "The way your laugh starts before the joke is even finished. It's the soundtrack to my best days.", imageQuery: "sparkles light", x: 0.28, y: 0.78 },
  { id: "l2", category: "Things I Love", title: "How You Care", description: "You remember the little things about everyone. You make people feel seen without ever making a show of it.", imageQuery: "warm glowing heart", x: 0.62, y: 0.55 },
  { id: "l3", category: "Things I Love", title: "Your Curiosity", description: "The way you ask 'why' about everything. You make the world feel like it's worth paying attention to.", imageQuery: "curious light trail", x: 0.88, y: 0.68 },

  // Places We've Been
  { id: "pl1", category: "Places We've Been", title: "The Beach", description: "Salt in our hair, sand in everything, and you grinning like a kid. That trip reset something in both of us.", imageQuery: "beach ocean sunset couple", x: 0.35, y: 0.35 },
  { id: "pl2", category: "Places We've Been", title: "The Little Café", description: "Our spot. The one with the creaky door and the warm light. We've solved every problem in the world from that corner table.", imageQuery: "cozy cafe warm light", x: 0.68, y: 0.82 },
  { id: "pl3", category: "Places We've Been", title: "The Mountain", description: "We climbed until we couldn't breathe and then we just sat. You said 'this is the kind of tired that feels good.' You were right.", imageQuery: "mountain summit view", x: 0.15, y: 0.85 },

  // Future Plans
  { id: "f1", category: "Future Plans", title: "The Trip We Keep Planning", description: "One day we'll actually book it. And when we do, I already know it'll be the best adventure because you're the one I'm going with.", imageQuery: "airplane sky travel", x: 0.52, y: 0.28 },
  { id: "f2", category: "Future Plans", title: "A Home", description: "Not a house — a home. With a kitchen that smells like something you're experimenting with and a door that always feels like arriving.", imageQuery: "warm home evening light", x: 0.78, y: 0.88 },
  { id: "f3", category: "Future Plans", title: "Growing Old", description: "I want to know what your laugh sounds like at 70. I have a feeling it'll still be my favorite sound.", imageQuery: "two rocking chairs sunset", x: 0.42, y: 0.88 },

  // Inside Jokes
  { id: "j1", category: "Inside Jokes", title: "The Squirrel Incident", description: "You know the one. We still can't talk about it without losing it. Some things are only funny to us — and that's what makes them ours.", imageQuery: "squirrel park funny", x: 0.25, y: 0.45 },
  { id: "j2", category: "Inside Jokes", title: "'Just Five More Minutes'", description: "It's never five minutes. It was never going to be. And I wouldn't change a single one of them.", imageQuery: "clock morning light", x: 0.92, y: 0.25 },
  { id: "j3", category: "Inside Jokes", title: "The Code Word", description: "We invented a word for when we want to leave a party. It has saved us approximately one thousand times.", imageQuery: "secret whisper night", x: 0.55, y: 0.45 },
];

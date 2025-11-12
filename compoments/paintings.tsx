// /lib/paintings.ts

export interface Painting {
  id: string;
  label: string;
  src: string;
  source: string;
  position?: string; 
}

export const paintings: Painting[] = [
  {
    id: "bedroom-in-arles",
    label: "Bedroom in Arles",
    src: "/bedroom.png",
    source: "https://en.wikipedia.org/wiki/Bedroom_in_Arles",
  },
  {
    id: "starry-night",
    label: "The Starry Night",
    src: "/Starry_Night.jpg",
    source: "https://en.wikipedia.org/wiki/The_Starry_Night",
  },
  {
    id: "wheatfield-with-crows",
    label: "Wheatfield with Crows",
    src: "/wheatfield-with-crows.jpg",
    source: "https://en.wikipedia.org/wiki/Wheatfield_with_Crows",
  },
  {
    id: "sorrowing-old-man",
    label: "Sorrowing Old Man (At Eternity’s Gate)",
    src: "/At_Eternity's_Gate.jpg",
    source: "https://en.wikipedia.org/wiki/At_Eternity%27s_Gate_(painting)",
    position: "object-top",
  },
];

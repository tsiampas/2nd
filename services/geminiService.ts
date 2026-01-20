
import { GoogleGenAI, Type } from "@google/genai";
import { SportType, BroadcastEvent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchSportsSchedule = async (date: string): Promise<BroadcastEvent[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Εμφάνισε όλες τις αθλητικές τηλεοπτικές μεταδόσεις στην ελληνική τηλεόραση (Nova, Cosmote TV, ΕΡΤ, Mega, Alpha, κλπ) για την ημερομηνία ${date}.
      Πρέπει να συμπεριλάβεις την ώρα, το άθλημα, τη διοργάνωση, τον αγώνα και το κανάλι.
      Χρησιμοποίησε τις παρακάτω κατηγορίες αθλημάτων: Ποδόσφαιρο, Μπάσκετ, Τένις, Βόλεϊ, Μηχανοκίνητα, Άλλα Αθλήματα.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              time: { type: Type.STRING, description: "Η ώρα έναρξης, π.χ. 21:45" },
              sport: { type: Type.STRING, enum: Object.values(SportType) },
              competition: { type: Type.STRING, description: "Η διοργάνωση, π.χ. Champions League" },
              match: { type: Type.STRING, description: "Ο αγώνας, π.χ. Ρεάλ Μαδρίτης - Μίλαν" },
              channel: { type: Type.STRING, description: "Το κανάλι μετάδοσης, π.χ. Cosmote Sport 1" },
            },
            required: ["id", "time", "sport", "competition", "match", "channel"],
          }
        },
      },
    });

    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr) as BroadcastEvent[];
  } catch (error) {
    console.error("Error fetching sports schedule:", error);
    return [];
  }
};

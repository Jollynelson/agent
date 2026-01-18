
import { GoogleGenAI, Type } from "@google/genai";
import { AgentStats } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getOptimizationTips(stats: AgentStats) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on these rental agent performance metrics:
        - Active Listings: ${stats.activeListings}
        - Successful Rentals: ${stats.successfulRentals}
        - Total Listing Views: ${stats.totalListingViews}
        - Avg Response Time: ${stats.responseTime}
        - Rating: ${stats.avgRating}
        
        Provide 3 concise, actionable optimization tips to help this agent perform better on the Better Tenant platform. Return as a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      }
    });

    return JSON.parse(response.text.trim()) as string[];
  } catch (error) {
    console.error("Error fetching tips:", error);
    return [
      "Improve your response time to under 15 minutes to gain the 'Hyper Responder' badge.",
      "Listings with video walk-throughs receive 4x more engagement.",
      "Encourage recent tenants to leave a review to boost your visibility score."
    ];
  }
}

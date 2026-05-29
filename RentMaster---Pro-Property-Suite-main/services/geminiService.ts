
import { GoogleGenAI, Type } from "@google/genai";
import { Property, PropertyType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const geminiService = {
  /**
   * Helps a user find a property based on natural language query.
   */
  async recommendProperties(query: string, availableProperties: Property[]): Promise<string> {
    try {
      const propertyData = JSON.stringify(availableProperties.map(p => ({
        id: p.id,
        name: p.name,
        type: p.type,
        city: p.city,
        price: p.price,
        amenities: p.amenities
      })));

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `I have the following properties available: ${propertyData}. 
        User query: "${query}". 
        Recommend the best 2 properties and explain why briefly. Return your answer in a professional concierge tone.`,
      });

      return response.text || "I'm sorry, I couldn't find a recommendation right now.";
    } catch (error) {
      console.error("Gemini recommendation error:", error);
      return "I'm having trouble connecting to my recommendation engine.";
    }
  },

  /**
   * Generates a draft rental agreement.
   */
  async generateRentalAgreement(property: Property, tenantName: string, rentAmount: number): Promise<string> {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate a short legal draft for a rental agreement between Owner of ${property.name} at ${property.address} and Tenant ${tenantName}. Monthly rent is $${rentAmount}. Keep it professional but concise.`,
      });
      return response.text || "Draft could not be generated.";
    } catch (error) {
      console.error("Gemini agreement generation error:", error);
      return "Agreement draft generation failed.";
    }
  }
};

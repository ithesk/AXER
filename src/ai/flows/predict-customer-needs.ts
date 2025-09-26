'use server';

/**
 * @fileOverview Uses generative AI to analyze customer data and purchase history to predict customer needs.
 *
 * - predictCustomerNeeds - A function that handles the prediction of customer needs.
 * - PredictCustomerNeedsInput - The input type for the predictCustomerNeeds function.
 * - PredictCustomerNeedsOutput - The return type for the predictCustomerNeeds function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictCustomerNeedsInputSchema = z.object({
  customerData: z
    .string()
    .describe('Detailed information about the customer, including demographics and contact information.'),
  purchaseHistory: z
    .string()
    .describe('A detailed history of the customer\'s purchases, including dates, items, and amounts.'),
  storeDetails: z
    .string()
    .describe('Details about the store, such as location, popular items, and current promotions.'),
});
export type PredictCustomerNeedsInput = z.infer<typeof PredictCustomerNeedsInputSchema>;

const PredictCustomerNeedsOutputSchema = z.object({
  predictedNeeds: z
    .string()
    .describe('A prediction of the customer\'s future needs and potential purchases.'),
  recommendations: z
    .string()
    .describe('Personalized recommendations for the customer based on their predicted needs.'),
});
export type PredictCustomerNeedsOutput = z.infer<typeof PredictCustomerNeedsOutputSchema>;

export async function predictCustomerNeeds(input: PredictCustomerNeedsInput): Promise<PredictCustomerNeedsOutput> {
  return predictCustomerNeedsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictCustomerNeedsPrompt',
  input: {schema: PredictCustomerNeedsInputSchema},
  output: {schema: PredictCustomerNeedsOutputSchema},
  prompt: `You are an AI assistant designed to analyze customer data and purchase history to predict their future needs and provide personalized recommendations.

  Analyze the following customer data, purchase history, and store details to predict the customer's needs and provide relevant recommendations.

  Customer Data: {{{customerData}}}
  Purchase History: {{{purchaseHistory}}}
  Store Details: {{{storeDetails}}}

  Based on this information, predict what the customer might need in the future and what products or services you would recommend to them.

  Format your response as follows:
  Predicted Needs: [A detailed prediction of the customer's future needs]
  Recommendations: [A list of personalized recommendations for the customer]`,
});

const predictCustomerNeedsFlow = ai.defineFlow(
  {
    name: 'predictCustomerNeedsFlow',
    inputSchema: PredictCustomerNeedsInputSchema,
    outputSchema: PredictCustomerNeedsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

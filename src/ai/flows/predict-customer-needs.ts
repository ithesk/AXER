'use server';

/**
 * @fileOverview Utiliza IA generativa para analizar datos de clientes e historial de compras para predecir las necesidades del cliente.
 *
 * - predictCustomerNeeds - Una función que maneja la predicción de las necesidades del cliente.
 * - PredictCustomerNeedsInput - El tipo de entrada para la función predictCustomerNeeds.
 * - PredictCustomerNeedsOutput - El tipo de retorno para la función predictCustomerNeeds.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictCustomerNeedsInputSchema = z.object({
  customerData: z
    .string()
    .describe('Información detallada sobre el cliente, incluidos datos demográficos e información de contacto.'),
  purchaseHistory: z
    .string()
    .describe('Un historial detallado de las compras del cliente, que incluye fechas, artículos y montos.'),
  storeDetails: z
    .string()
    .describe('Detalles sobre la tienda, como ubicación, artículos populares y promociones actuales.'),
});
export type PredictCustomerNeedsInput = z.infer<typeof PredictCustomerNeedsInputSchema>;

const PredictCustomerNeedsOutputSchema = z.object({
  predictedNeeds: z
    .string()
    .describe('Una predicción de las necesidades futuras y posibles compras del cliente.'),
  recommendations: z
    .string()
    .describe('Recomendaciones personalizadas para el cliente en función de sus necesidades previstas.'),
});
export type PredictCustomerNeedsOutput = z.infer<typeof PredictCustomerNeedsOutputSchema>;

export async function predictCustomerNeeds(input: PredictCustomerNeedsInput): Promise<PredictCustomerNeedsOutput> {
  return predictCustomerNeedsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictCustomerNeedsPrompt',
  input: {schema: PredictCustomerNeedsInputSchema},
  output: {schema: PredictCustomerNeedsOutputSchema},
  prompt: `Eres un asistente de IA diseñado para analizar datos de clientes e historial de compras para predecir sus necesidades futuras y ofrecer recomendaciones personalizadas.

  Analiza los siguientes datos del cliente, historial de compras y detalles de la tienda para predecir las necesidades del cliente y ofrecer recomendaciones relevantes.

  Datos del Cliente: {{{customerData}}}
  Historial de Compras: {{{purchaseHistory}}}
  Detalles de la Tienda: {{{storeDetails}}}

  Basado en esta información, predice lo que el cliente podría necesitar en el futuro y qué productos o servicios le recomendarías.

  Formatea tu respuesta de la siguiente manera:
  Necesidades Previstas: [Una predicción detallada de las necesidades futuras del cliente]
  Recomendaciones: [Una lista de recomendaciones personalizadas para el cliente]`,
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

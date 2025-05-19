
import { http, HttpResponse } from 'msw';
import { setupWorker } from 'msw/browser';

// Define interface for the request body
interface GenerateRequest {
  prompt: string;
}

// This function returns a handler for the generateWithLocalLLM endpoint
const generateLLMHandler = http.post('/api/generate', async ({ request }) => {
  try {
    const { prompt } = await request.json() as GenerateRequest;
    
    // This is where we would call the python subprocess in a real backend
    // For the frontend mock, we'll just return a simulated response
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return HttpResponse.json({
      response: `This is a simulated response from the local LLM. In a real implementation, this would call the Python subprocess to run:\n\nollama run hermes3:3b\n\nWith your prompt:\n"${prompt}"\n\nIn a production environment, you would need to set up a backend server that can execute shell commands to interact with Ollama.`
    });
  } catch (error) {
    console.error('Error in LLM generation handler:', error);
    return HttpResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
});

// Create handler array
const handlers = [generateLLMHandler];

// Setup MSW for browser only
export function createServer() {
  const worker = setupWorker(...handlers);
  worker.start({ onUnhandledRequest: 'bypass' });
  return worker;
}

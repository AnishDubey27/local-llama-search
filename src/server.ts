
import { setupWorker, rest } from 'msw';
import { setupServer } from 'msw/node';

// This function returns a handler for the generateWithLocalLLM endpoint
const generateLLMHandler = rest.post('/api/generate', async (req, res, ctx) => {
  try {
    const { prompt } = await req.json();
    
    // This is where we would call the python subprocess in a real backend
    // For the frontend mock, we'll just return a simulated response
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return res(
      ctx.status(200),
      ctx.json({
        response: `This is a simulated response from the local LLM. In a real implementation, this would call the Python subprocess to run:\n\nollama run hermes3:3b\n\nWith your prompt:\n"${prompt}"\n\nIn a production environment, you would need to set up a backend server that can execute shell commands to interact with Ollama.`
      })
    );
  } catch (error) {
    console.error('Error in LLM generation handler:', error);
    return res(
      ctx.status(500),
      ctx.json({ error: 'Failed to generate response' })
    );
  }
});

// Create handler array
const handlers = [generateLLMHandler];

// Setup MSW
export function createServer() {
  if (typeof window === 'undefined') {
    const server = setupServer(...handlers);
    server.listen();
    return server;
  } else {
    const worker = setupWorker(...handlers);
    worker.start({ onUnhandledRequest: 'bypass' });
    return worker;
  }
}

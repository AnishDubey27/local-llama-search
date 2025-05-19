
export async function generateWithLocalLLM(prompt: string): Promise<string> {
  try {
    // In a browser environment, we need to call our backend API that will run the subprocess
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`LLM API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    return data.response || "No response generated.";
  } catch (error) {
    console.error("Error generating with local LLM:", error);
    throw error;
  }
}

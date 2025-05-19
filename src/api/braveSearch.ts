
export interface SearchResult {
  title: string;
  url: string;
  description?: string;
}

export async function searchWithBrave(query: string, apiKey: string): Promise<SearchResult[]> {
  try {
    if (!apiKey) {
      throw new Error("Brave Search API key is not set");
    }
    
    const response = await fetch('https://api.search.brave.com/res/v1/web/search', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip',
        'X-Subscription-Token': apiKey
      },
      credentials: 'omit',
      cache: 'no-store',
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Brave Search API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    return data.web?.results?.slice(0, 3).map((result: any) => ({
      title: result.title,
      url: result.url,
      description: result.description
    })) || [];
  } catch (error) {
    console.error("Error searching with Brave:", error);
    throw error;
  }
}


import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ApiKeyProvider, useApiKey } from '@/contexts/ApiKeyContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ChatInput } from '@/components/ChatInput';
import { ChatMessage } from '@/components/ChatMessage';
import { searchWithBrave, SearchResult } from '@/api/braveSearch';
import { generateWithLocalLLM } from '@/api/localLLM';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  const { toast } = useToast();
  const { braveApiKey, setBraveApiKey } = useApiKey();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (message: string, useInternet: boolean) => {
    try {
      // Add user message to chat
      const userMessage: Message = {
        id: uuidv4(),
        content: message,
        role: 'user',
      };
      setMessages((prev) => [...prev, userMessage]);
      setIsProcessing(true);

      // Prepare the prompt
      let finalPrompt = message;
      let searchResults: SearchResult[] = [];

      // If using internet and API key is set, get search results
      if (useInternet && braveApiKey) {
        try {
          searchResults = await searchWithBrave(message, braveApiKey);
          if (searchResults.length > 0) {
            const searchContext = searchResults
              .map((result, index) => `[${index + 1}] ${result.title}\n${result.url}`)
              .join('\n\n');
            
            finalPrompt = `Here are some search results that might help answer the query:\n\n${searchContext}\n\n---\n\nUser query: ${message}\n\nPlease use these search results if relevant to answer the query.`;
          }
        } catch (error) {
          console.error("Error searching with Brave:", error);
          toast({
            title: "Search Error",
            description: "Failed to fetch search results. Continuing without them.",
            variant: "destructive",
          });
        }
      } else if (useInternet && !braveApiKey) {
        setApiKeyDialogOpen(true);
        setIsProcessing(false);
        return;
      }

      // Generate response with local LLM
      const aiResponse = await generateWithLocalLLM(finalPrompt);

      // Add AI response to chat
      const assistantMessage: Message = {
        id: uuidv4(),
        content: aiResponse,
        role: 'assistant',
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error processing request:", error);
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSetApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const apiKey = formData.get('apiKey') as string;
    
    if (apiKey) {
      setBraveApiKey(apiKey);
      setApiKeyDialogOpen(false);
      toast({
        title: "API Key Saved",
        description: "Your Brave Search API key has been saved for this session.",
      });
    }
  };

  return (
    <div className="chat-container p-4">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Local AI Assistant</h1>
        <ThemeToggle />
      </header>

      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-grow py-12">
          <h2 className="text-xl mb-2">Welcome to your Local AI Assistant</h2>
          <p className="text-muted-foreground mb-6 text-center max-w-md">
            Ask anything, and get answers from your local Ollama LLM. Enable "Use Internet" to enhance responses with Brave Search results.
          </p>
          <Alert className="max-w-lg">
            <AlertDescription>
              This app runs entirely on your machine, connecting to Ollama locally. Make sure you have Ollama installed with the hermes3:3b model.
            </AlertDescription>
          </Alert>
        </div>
      ) : (
        <div className="messages-container">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}

      <ChatInput onSubmit={handleSubmit} isProcessing={isProcessing} />

      <Dialog open={apiKeyDialogOpen} onOpenChange={setApiKeyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Brave Search API Key</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSetApiKey} className="space-y-4 mt-2">
            <Input 
              name="apiKey" 
              placeholder="Paste your Brave Search API key here" 
              type="password"
            />
            <div className="flex justify-end">
              <Button type="submit">Save Key</Button>
            </div>
          </form>
          <p className="text-sm text-muted-foreground mt-2">
            Your API key will only be stored in memory for this session.
          </p>
        </DialogContent>
      </Dialog>

      <footer className="text-center text-sm text-muted-foreground mt-6">
        <p>Running on localhost with Ollama</p>
      </footer>
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <ApiKeyProvider>
      <ChatInterface />
    </ApiKeyProvider>
  );
};

export default Index;

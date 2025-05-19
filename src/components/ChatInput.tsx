
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface ChatInputProps {
  onSubmit: (message: string, useInternet: boolean) => void;
  isProcessing: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSubmit, isProcessing }) => {
  const [message, setMessage] = useState('');
  const [useInternet, setUseInternet] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isProcessing) {
      onSubmit(message, useInternet);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="input-container">
      <textarea
        className="textarea"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter your message here..."
        disabled={isProcessing}
      />
      
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="useInternet"
            checked={useInternet}
            onCheckedChange={(checked) => setUseInternet(checked === true)}
          />
          <label
            htmlFor="useInternet"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Use Internet
          </label>
        </div>
        
        <Button
          type="submit"
          disabled={isProcessing || !message.trim()}
          className="px-6"
        >
          {isProcessing ? (
            <div className="typing-animation">
              <span></span>
              <span></span>
              <span></span>
            </div>
          ) : (
            'Submit'
          )}
        </Button>
      </div>
    </form>
  );
};

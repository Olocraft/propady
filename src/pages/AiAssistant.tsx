
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2, Send } from 'lucide-react';

const AiAssistant = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    // Add user message to conversation
    const userMessage = { role: 'user' as const, content: prompt };
    setConversation(prev => [...prev, userMessage]);
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: { prompt }
      });

      if (error) throw error;

      // Add AI response to conversation
      const aiMessage = { role: 'ai' as const, content: data.response };
      setConversation(prev => [...prev, aiMessage]);
      setResponse(data.response);
      setPrompt('');
    } catch (error) {
      console.error('Error calling AI assistant:', error);
      toast({
        title: 'Error',
        description: 'Failed to get a response from the AI assistant. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Propady AI Assistant</h1>
          
          <Card className="glass-morphism border-white/10 text-white">
            <CardHeader>
              <CardTitle>Ask me anything about real estate</CardTitle>
              <CardDescription className="text-white/70">
                Get expert advice on property investment, management, and market trends
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4 mb-6">
                {conversation.length === 0 ? (
                  <div className="text-center text-white/50 py-8">
                    <p>No conversation yet. Ask your first question below!</p>
                  </div>
                ) : (
                  conversation.map((message, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-propady-purple/30 ml-auto max-w-[80%]'
                          : 'bg-black/30 mr-auto max-w-[80%]'
                      }`}
                    >
                      <div className="font-semibold mb-1">
                        {message.role === 'user' ? 'You' : 'Propady AI'}
                      </div>
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    </div>
                  ))
                )}
                
                {isLoading && (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-propady-mint" />
                    <span className="ml-2 text-white/70">Propady AI is thinking...</span>
                  </div>
                )}
              </div>
              
              <Separator className="bg-white/20 my-4" />
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <Textarea
                  placeholder="Ask about property investment, market trends, or management advice..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="border-white/20 bg-black/20 text-white resize-none"
                  rows={3}
                />
                
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isLoading || !prompt.trim()}
                    className="bg-propady-mint text-black hover:bg-propady-mint/90 disabled:bg-propady-mint/50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
            
            <CardFooter className="flex justify-between text-sm text-white/50">
              <p>Powered by OpenAI</p>
              <p>Ask specific questions for better results</p>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AiAssistant;

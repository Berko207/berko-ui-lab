
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Code2, Sparkles, AlertTriangle, Lightbulb, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { OpenAIService } from '../services/openai';
import type { CodeAnalysis, Suggestion } from '../types/ai';

const SAMPLE_CODE = `interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

async function fetchUser(id: string) {
  const response = await fetch(\`/api/users/\${id}\`);
  return response.json();
}

const users: User[] = [];
users.push({ id: "1", name: "John", email: "john@example.com" });`;

export const TypeScriptAssistant: React.FC = () => {
  const [code, setCode] = useState<string>(SAMPLE_CODE);
  const [analysis, setAnalysis] = useState<CodeAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [useOpenAI, setUseOpenAI] = useState<boolean>(false);

  const handleAnalyze = useCallback(async () => {
    if (!code.trim()) {
      toast.error('Please enter some TypeScript code to analyze');
      return;
    }

    setIsAnalyzing(true);
    console.log('🚀 Starting code analysis...');

    try {
      let service: OpenAIService;
      
      if (useOpenAI && apiKey) {
        service = new OpenAIService({ apiKey, model: 'gpt-4' });
        const result = await service.analyzeCode(code);
        
        if (result.success) {
          setAnalysis(result.data);
          toast.success('Code analyzed successfully with OpenAI! 🎉');
        } else {
          toast.error(`Analysis failed: ${result.error.message}`);
        }
      } else {
        // Use mock analysis for demo
        service = new OpenAIService({ apiKey: 'demo' });
        const result = await service.getMockAnalysis(code);
        
        if (result.success) {
          setAnalysis(result.data);
          toast.success('Code analyzed with demo mode! 🎉');
        }
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze code. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [code, apiKey, useOpenAI]);

  const getSeverityColor = (severity: Suggestion['severity']): string => {
    switch (severity) {
      case 'high': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getTypeIcon = (type: Suggestion['type']) => {
    switch (type) {
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'improvement': return <Lightbulb className="w-4 h-4 text-blue-400" />;
      case 'optimization': return <Sparkles className="w-4 h-4 text-purple-400" />;
      default: return <Code2 className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold gradient-text glow-text">
          TypeScript AI Assistant
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Analyze your TypeScript code with AI-powered suggestions for modern patterns, 
          type safety, and performance optimizations
        </p>
      </div>

      {/* Settings */}
      <Card className="glass glow p-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5 text-ai-purple" />
          <h3 className="text-lg font-semibold">Configuration</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">OpenAI API Key (optional)</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="glass"
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to use demo mode with mock analysis
            </p>
          </div>
          
          <div className="flex items-center space-y-2 pt-6">
            <Button
              variant={useOpenAI ? "default" : "outline"}
              onClick={() => setUseOpenAI(!useOpenAI)}
              className="glass"
              disabled={!apiKey}
            >
              {useOpenAI ? '🤖 Using OpenAI' : '🎭 Demo Mode'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Code Input */}
      <Card className="glass glow p-6 max-w-4xl mx-auto">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Code2 className="w-5 h-5 text-ai-blue" />
              TypeScript Code
            </h3>
            <Button 
              onClick={handleAnalyze} 
              disabled={isAnalyzing}
              className="bg-gradient-to-r from-ai-purple to-ai-blue hover:from-ai-blue hover:to-ai-cyan transition-all duration-300"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Analyze Code
                </>
              )}
            </Button>
          </div>
          
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter your TypeScript code here..."
            className="min-h-[300px] font-mono text-sm glass"
            style={{ resize: 'vertical' }}
          />
        </div>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <Card className="glass glow p-6 max-w-4xl mx-auto animate-fade-in">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-ai-cyan" />
            Analysis Results
          </h3>

          <Tabs defaultValue="suggestions" className="space-y-4">
            <TabsList className="glass">
              <TabsTrigger value="suggestions">
                Suggestions ({analysis.suggestions.length})
              </TabsTrigger>
              <TabsTrigger value="types">
                Type Issues ({analysis.typeIssues.length})
              </TabsTrigger>
              <TabsTrigger value="patterns">
                Modern Patterns ({analysis.modernPatterns.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="suggestions" className="space-y-3">
              {analysis.suggestions.length > 0 ? (
                analysis.suggestions.map((suggestion, index) => (
                  <Card key={index} className="glass p-4 border-l-4 border-ai-purple">
                    <div className="flex items-start gap-3">
                      {getTypeIcon(suggestion.type)}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge className={getSeverityColor(suggestion.severity)}>
                            {suggestion.severity}
                          </Badge>
                          <Badge variant="outline">{suggestion.type}</Badge>
                          {suggestion.line && (
                            <Badge variant="secondary">Line {suggestion.line}</Badge>
                          )}
                        </div>
                        <p className="text-sm">{suggestion.message}</p>
                        {suggestion.modernAlternative && (
                          <pre className="text-xs bg-muted p-2 rounded syntax-keyword overflow-x-auto">
                            {suggestion.modernAlternative}
                          </pre>
                        )}
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No suggestions found. Your code looks good! ✨
                </p>
              )}
            </TabsContent>

            <TabsContent value="types" className="space-y-3">
              {analysis.typeIssues.length > 0 ? (
                analysis.typeIssues.map((issue, index) => (
                  <Card key={index} className="glass p-4 border-l-4 border-red-500">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <Badge variant="destructive">Line {issue.line}</Badge>
                      </div>
                      <p className="text-sm text-red-300">{issue.message}</p>
                      <div className="bg-green-500/10 p-2 rounded">
                        <p className="text-xs text-green-300 font-semibold">Solution:</p>
                        <p className="text-xs text-green-200">{issue.solution}</p>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No type issues detected! 🎯
                </p>
              )}
            </TabsContent>

            <TabsContent value="patterns" className="space-y-3">
              {analysis.modernPatterns.length > 0 ? (
                analysis.modernPatterns.map((pattern, index) => (
                  <Card key={index} className="glass p-4 border-l-4 border-ai-cyan">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-ai-cyan">{pattern.name}</h4>
                        <p className="text-sm text-muted-foreground">{pattern.description}</p>
                      </div>
                      
                      <pre className="text-xs bg-muted p-3 rounded overflow-x-auto syntax-keyword">
                        {pattern.example}
                      </pre>
                      
                      <div>
                        <p className="text-xs font-semibold mb-1">Benefits:</p>
                        <ul className="text-xs space-y-1">
                          {pattern.benefits.map((benefit, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <span className="w-1 h-1 bg-ai-cyan rounded-full"></span>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No modern patterns suggested at this time 🔧
                </p>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      )}
    </div>
  );
};

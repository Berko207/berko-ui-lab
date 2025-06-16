
import { toast } from 'sonner';
import type { OpenAIConfig, CodeAnalysis, APIResponse, Suggestion, TypeIssue, ModernPattern } from '../types/ai';

export class OpenAIService {
  private readonly config: Readonly<OpenAIConfig>;

  constructor(config: OpenAIConfig) {
    this.config = Object.freeze(config);
  }

  async analyzeCode(code: string): Promise<APIResponse<CodeAnalysis>> {
    try {
      console.log('🤖 Analyzing TypeScript code with OpenAI...');
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.config.model ?? 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are an expert TypeScript developer focused on 2025 modern patterns. 
              Analyze TypeScript code and provide suggestions for:
              1. Modern TypeScript patterns (generics, utility types, conditional types)
              2. Type safety improvements
              3. Performance optimizations
              4. Code quality enhancements
              
              Respond with a JSON object matching this structure:
              {
                "suggestions": [{"type": "improvement|warning|error|optimization", "message": "...", "line": 1, "severity": "low|medium|high", "modernAlternative": "..."}],
                "typeIssues": [{"message": "...", "line": 1, "solution": "..."}],
                "modernPatterns": [{"name": "...", "description": "...", "example": "...", "benefits": ["..."]}]
              }`
            },
            {
              role: 'user',
              content: `Please analyze this TypeScript code:\n\n${code}`
            }
          ],
          max_tokens: this.config.maxTokens ?? 1500,
          temperature: this.config.temperature ?? 0.1,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      const content = result.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No response content from OpenAI');
      }

      // Parse the AI response
      const aiAnalysis = JSON.parse(content);
      
      const analysis: CodeAnalysis = {
        id: crypto.randomUUID(),
        code,
        suggestions: aiAnalysis.suggestions ?? [],
        typeIssues: aiAnalysis.typeIssues ?? [],
        modernPatterns: aiAnalysis.modernPatterns ?? [],
        timestamp: new Date(),
      };

      console.log('✅ Code analysis completed successfully');
      
      return {
        success: true,
        data: analysis,
        timestamp: new Date(),
      };

    } catch (error) {
      console.error('❌ OpenAI analysis failed:', error);
      
      return {
        success: false,
        error: {
          code: 'ANALYSIS_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error occurred',
        },
        timestamp: new Date(),
      };
    }
  }

  // Mock analysis for demo purposes (when no API key is provided)
  async getMockAnalysis(code: string): Promise<APIResponse<CodeAnalysis>> {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay

    const mockSuggestions: readonly Suggestion[] = [
      {
        type: 'improvement',
        message: 'Consider using const assertions for better type inference',
        line: 1,
        severity: 'medium',
        modernAlternative: 'const config = { apiUrl: "..." } as const;'
      },
      {
        type: 'optimization',
        message: 'Use readonly arrays for immutable data structures',
        severity: 'low',
        modernAlternative: 'readonly string[] instead of string[]'
      }
    ];

    const mockTypeIssues: readonly TypeIssue[] = [
      {
        message: 'Missing return type annotation',
        line: 3,
        solution: 'Add explicit return type: (): Promise<User> =>'
      }
    ];

    const mockPatterns: readonly ModernPattern[] = [
      {
        name: 'Branded Types',
        description: 'Create type-safe IDs using branded types',
        example: 'type UserId = string & { readonly __brand: unique symbol };',
        benefits: ['Type safety', 'Prevents mixing different ID types', 'Zero runtime cost']
      },
      {
        name: 'Template Literal Types',
        description: 'Use template literal types for dynamic string types',
        example: 'type EventName<T> = `on${Capitalize<T>}`;',
        benefits: ['Compile-time string validation', 'Better autocomplete', 'Type-safe event handling']
      }
    ];

    const analysis: CodeAnalysis = {
      id: crypto.randomUUID(),
      code,
      suggestions: mockSuggestions,
      typeIssues: mockTypeIssues,
      modernPatterns: mockPatterns,
      timestamp: new Date(),
    };

    return {
      success: true,
      data: analysis,
      timestamp: new Date(),
    };
  }
}

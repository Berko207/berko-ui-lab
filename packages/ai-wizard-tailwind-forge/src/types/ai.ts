
// Advanced TypeScript patterns for 2025 AI dev

export interface OpenAIConfig {
  apiKey: string;
  model?: 'gpt-4' | 'gpt-4-turbo' | 'gpt-3.5-turbo';
  maxTokens?: number;
  temperature?: number;
}

export interface CodeAnalysis {
  readonly id: string;
  readonly code: string;
  readonly suggestions: readonly Suggestion[];
  readonly typeIssues: readonly TypeIssue[];
  readonly modernPatterns: readonly ModernPattern[];
  readonly timestamp: Date;
}

export interface Suggestion {
  readonly type: 'improvement' | 'warning' | 'error' | 'optimization';
  readonly message: string;
  readonly line?: number;
  readonly severity: 'low' | 'medium' | 'high';
  readonly modernAlternative?: string;
}

export interface TypeIssue {
  readonly message: string;
  readonly line: number;
  readonly solution: string;
}

export interface ModernPattern {
  readonly name: string;
  readonly description: string;
  readonly example: string;
  readonly benefits: readonly string[];
}

// Advanced generic types for API responses
export type APIResponse<T> = {
  readonly success: true;
  readonly data: T;
  readonly timestamp: Date;
} | {
  readonly success: false;
  readonly error: APIError;
  readonly timestamp: Date;
};

export interface APIError {
  readonly code: string;
  readonly message: string;
  readonly details?: Record<string, unknown>;
}

// Utility types for modern TypeScript
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends (infer U)[]
    ? readonly DeepReadonly<U>[]
    : T[P] extends object
    ? DeepReadonly<T[P]>
    : T[P];
};

export type NonEmptyArray<T> = readonly [T, ...T[]];

export type AsyncReturnType<T extends (...args: any) => Promise<any>> = 
  T extends (...args: any) => Promise<infer R> ? R : never;

// Modern pattern for exhaustive type checking
export const assertNever = (value: never): never => {
  throw new Error(`Unexpected value: ${value}`);
};

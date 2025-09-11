# Implementation Specifications for LLM Integration

## File Structure and Implementation Details

### Core LLM Provider System

#### 1. Base Provider Interface (`/src/lib/llm-providers/base-provider.ts`)

```typescript
export interface LLMProvider {
  name: string;
  apiKey: string;
  baseUrl: string;
  models: LLMModel[];
  capabilities: LLMCapability;
  costPerToken: number;
  educationalFocus: boolean;
  rateLimit: RateLimit;
}

export interface LLMModel {
  id: string;
  name: string;
  contextWindow: number;
  maxTokens: number;
  strengths: ModelStrength[];
  useCases: CodeAssistanceType[];
  latency: LatencyProfile;
}

export interface LLMCapability {
  codeCompletion: boolean;
  codeExplanation: boolean;
  debugging: boolean;
  refactoring: boolean;
  codeGeneration: boolean;
  conceptExplanation: boolean;
  multiLanguage: string[];
}

export interface RateLimit {
  requestsPerMinute: number;
  tokensPerMinute: number;
  concurrent: number;
}

export interface LatencyProfile {
  average: number; // milliseconds
  p95: number;
  p99: number;
}

export type ModelStrength = 
  | 'reasoning' 
  | 'code_completion' 
  | 'explanation' 
  | 'debugging' 
  | 'speed' 
  | 'accuracy' 
  | 'educational_content';

export type CodeAssistanceType = 
  | 'completion' 
  | 'explanation' 
  | 'debugging' 
  | 'refactoring' 
  | 'generation' 
  | 'review'
  | 'concept_teaching';

export abstract class BaseLLMProvider implements LLMProvider {
  abstract name: string;
  abstract apiKey: string;
  abstract baseUrl: string;
  abstract models: LLMModel[];
  abstract capabilities: LLMCapability;
  abstract costPerToken: number;
  abstract educationalFocus: boolean;
  abstract rateLimit: RateLimit;

  // Core methods all providers must implement
  abstract generateCompletion(
    prompt: string, 
    options: CompletionOptions
  ): Promise<CompletionResult>;

  abstract generateCodeSuggestions(
    context: CodeContext
  ): Promise<CodeSuggestion[]>;

  abstract explainConcept(
    concept: string, 
    context: EducationalContext
  ): Promise<ConceptExplanation>;

  abstract debugCode(
    code: string, 
    error: CodeError, 
    context: EducationalContext
  ): Promise<DebugSuggestion>;

  abstract refactorCode(
    code: string, 
    intent: RefactorIntent, 
    context: EducationalContext
  ): Promise<RefactorSuggestion>;

  // Utility methods with default implementations
  protected buildHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'User-Agent': 'AgentAcademy-IDE/1.0'
    };
  }

  protected async rateLimitCheck(): Promise<boolean> {
    // Implement rate limiting logic
    return true;
  }

  protected formatEducationalPrompt(
    prompt: string, 
    context: EducationalContext
  ): string {
    return `
Educational Context:
- Student Level: ${context.student.skillLevel}
- Lesson: ${context.lesson.title}
- Learning Objectives: ${context.lesson.objectives.join(', ')}
- Student Learning Style: ${context.student.learningStyle}

${prompt}

Please provide responses that:
1. Match the student's skill level
2. Include educational explanations
3. Encourage learning and understanding
4. Suggest next steps for improvement
`;
  }
}

export interface CompletionOptions {
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  presencePenalty?: number;
  frequencyPenalty?: number;
  educationalMode?: boolean;
  skillLevel?: SkillLevel;
}

export interface CompletionResult {
  text: string;
  confidence: number;
  provider: string;
  model: string;
  tokensUsed: number;
  latency: number;
  educational: boolean;
  explanation?: string;
}
```

#### 2. Claude Provider (`/src/lib/llm-providers/claude-provider.ts`)

```typescript
import { BaseLLMProvider } from './base-provider';
import Anthropic from '@anthropic-ai/sdk';

export class ClaudeProvider extends BaseLLMProvider {
  name = 'Claude';
  apiKey = process.env.ANTHROPIC_API_KEY || '';
  baseUrl = 'https://api.anthropic.com';
  costPerToken = 0.000008;
  educationalFocus = true;

  models: LLMModel[] = [
    {
      id: 'claude-3-sonnet-20240229',
      name: 'Claude 3 Sonnet',
      contextWindow: 200000,
      maxTokens: 4096,
      strengths: ['reasoning', 'explanation', 'educational_content'],
      useCases: ['explanation', 'debugging', 'concept_teaching', 'review'],
      latency: { average: 1200, p95: 2000, p99: 3000 }
    },
    {
      id: 'claude-3-haiku-20240307',
      name: 'Claude 3 Haiku',
      contextWindow: 200000,
      maxTokens: 4096,
      strengths: ['speed', 'reasoning'],
      useCases: ['completion', 'debugging'],
      latency: { average: 400, p95: 600, p99: 800 }
    }
  ];

  capabilities: LLMCapability = {
    codeCompletion: true,
    codeExplanation: true,
    debugging: true,
    refactoring: true,
    codeGeneration: true,
    conceptExplanation: true,
    multiLanguage: ['python', 'javascript', 'typescript', 'java', 'cpp']
  };

  rateLimit: RateLimit = {
    requestsPerMinute: 50,
    tokensPerMinute: 40000,
    concurrent: 5
  };

  private client: Anthropic;

  constructor() {
    super();
    this.client = new Anthropic({
      apiKey: this.apiKey,
    });
  }

  async generateCompletion(
    prompt: string,
    options: CompletionOptions = {}
  ): Promise<CompletionResult> {
    const startTime = Date.now();
    
    try {
      const educationalPrompt = options.educationalMode 
        ? this.formatEducationalPrompt(prompt, options as any)
        : prompt;

      const message = await this.client.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: options.maxTokens || 1000,
        temperature: options.temperature || 0.7,
        messages: [
          {
            role: 'user',
            content: educationalPrompt
          }
        ]
      });

      const text = message.content[0].type === 'text' 
        ? message.content[0].text 
        : '';

      return {
        text,
        confidence: 0.9, // Claude generally high confidence
        provider: this.name,
        model: 'claude-3-sonnet-20240229',
        tokensUsed: message.usage.input_tokens + message.usage.output_tokens,
        latency: Date.now() - startTime,
        educational: options.educationalMode || false,
        explanation: options.educationalMode ? this.extractExplanation(text) : undefined
      };

    } catch (error) {
      console.error('Claude API error:', error);
      throw new Error(`Claude completion failed: ${error}`);
    }
  }

  async generateCodeSuggestions(
    context: CodeContext
  ): Promise<CodeSuggestion[]> {
    const prompt = `
Analyze this code context and provide 3-5 intelligent code completions:

Current Code:
\`\`\`${context.language}
${context.currentCode}
\`\`\`

Cursor Position: Line ${context.cursorPosition.line}, Column ${context.cursorPosition.column}
Incomplete Line: "${context.incompleteLine}"

Educational Context:
- Lesson: ${context.educationalContext?.lesson.title}
- Student Level: ${context.educationalContext?.student.skillLevel}
- Learning Objectives: ${context.educationalContext?.lesson.objectives.join(', ')}

Requirements:
1. Provide completions that match the context
2. Include educational explanations for each suggestion
3. Rank by educational value and correctness
4. Consider the student's skill level
5. Suggest alternative approaches when appropriate

Return JSON format:
{
  "suggestions": [
    {
      "text": "completion_code",
      "explanation": "educational explanation",
      "confidence": 0.95,
      "concepts": ["concept1", "concept2"],
      "difficulty": "beginner|intermediate|advanced",
      "alternative": "alternative_approach"
    }
  ]
}
`;

    const result = await this.generateCompletion(prompt, {
      educationalMode: true,
      maxTokens: 1500,
      temperature: 0.3
    });

    return this.parseCodeSuggestions(result.text);
  }

  async explainConcept(
    concept: string,
    context: EducationalContext
  ): Promise<ConceptExplanation> {
    const prompt = `
Explain the concept "${concept}" for a ${context.student.skillLevel} level student.

Context:
- Current Lesson: ${context.lesson.title}
- Learning Objectives: ${context.lesson.objectives.join(', ')}
- Student's Learning Style: ${context.student.learningStyle}
- Previously Mastered: ${context.student.masteredConcepts.join(', ')}
- Currently Struggling With: ${context.student.strugglingConcepts.join(', ')}

Please provide:
1. A clear, level-appropriate explanation
2. Simple analogies if helpful
3. Code examples that demonstrate the concept
4. Common mistakes to avoid
5. Practice exercises to reinforce understanding
6. Connections to previously learned concepts

Format as educational content that engages and teaches effectively.
`;

    const result = await this.generateCompletion(prompt, {
      educationalMode: true,
      maxTokens: 2000,
      temperature: 0.5
    });

    return this.parseConceptExplanation(result.text);
  }

  async debugCode(
    code: string,
    error: CodeError,
    context: EducationalContext
  ): Promise<DebugSuggestion> {
    const prompt = `
Help debug this code for a ${context.student.skillLevel} student:

Code:
\`\`\`${context.codeContext.language}
${code}
\`\`\`

Error: ${error.message}
Error Type: ${error.type}
Line Number: ${error.line}

Educational Context:
- Lesson: ${context.lesson.title}
- Student has struggled with: ${context.student.strugglingConcepts.join(', ')}

Provide:
1. Clear explanation of what went wrong
2. Step-by-step fix instructions
3. Why this error occurred (educational insight)
4. How to prevent similar errors in the future
5. Corrected code with explanatory comments

Make this a learning opportunity, not just a fix.
`;

    const result = await this.generateCompletion(prompt, {
      educationalMode: true,
      maxTokens: 1500,
      temperature: 0.2
    });

    return this.parseDebugSuggestion(result.text);
  }

  async refactorCode(
    code: string,
    intent: RefactorIntent,
    context: EducationalContext
  ): Promise<RefactorSuggestion> {
    const prompt = `
Refactor this code with the intent: "${intent.description}"

Original Code:
\`\`\`${context.codeContext.language}
${code}
\`\`\`

Refactoring Goals: ${intent.goals.join(', ')}
Student Level: ${context.student.skillLevel}
Learning Objectives: ${context.lesson.objectives.join(', ')}

Provide:
1. Refactored code with improvements
2. Explanation of changes made
3. Why each change improves the code
4. Educational benefits of the refactoring
5. Alternative refactoring approaches

Focus on teaching good coding practices while improving the code.
`;

    const result = await this.generateCompletion(prompt, {
      educationalMode: true,
      maxTokens: 2000,
      temperature: 0.3
    });

    return this.parseRefactorSuggestion(result.text);
  }

  // Helper methods for parsing responses
  private parseCodeSuggestions(response: string): CodeSuggestion[] {
    try {
      const parsed = JSON.parse(response);
      return parsed.suggestions || [];
    } catch {
      // Fallback parsing for non-JSON responses
      return this.fallbackParseCodeSuggestions(response);
    }
  }

  private parseConceptExplanation(response: string): ConceptExplanation {
    return {
      concept: '',
      explanation: response,
      examples: this.extractCodeExamples(response),
      analogies: this.extractAnalogies(response),
      commonMistakes: this.extractCommonMistakes(response),
      practiceExercises: this.extractExercises(response),
      relatedConcepts: this.extractRelatedConcepts(response)
    };
  }

  private parseDebugSuggestion(response: string): DebugSuggestion {
    return {
      explanation: this.extractSection(response, 'explanation'),
      steps: this.extractSteps(response),
      correctedCode: this.extractCodeBlock(response),
      learningPoints: this.extractLearningPoints(response),
      prevention: this.extractPrevention(response)
    };
  }

  private parseRefactorSuggestion(response: string): RefactorSuggestion {
    return {
      refactoredCode: this.extractCodeBlock(response),
      changes: this.extractChanges(response),
      explanation: this.extractSection(response, 'explanation'),
      benefits: this.extractBenefits(response),
      alternatives: this.extractAlternatives(response)
    };
  }

  // Utility parsing methods
  private extractExplanation(text: string): string {
    // Extract educational explanation from response
    const explanationMatch = text.match(/Explanation:\s*(.*?)(?:\n\n|\n[A-Z])/s);
    return explanationMatch ? explanationMatch[1].trim() : '';
  }

  private extractCodeExamples(text: string): string[] {
    const codeBlocks = text.match(/```[\s\S]*?```/g) || [];
    return codeBlocks.map(block => block.replace(/```\w*\n?|\n?```/g, '').trim());
  }

  private extractAnalogies(text: string): string[] {
    // Look for analogies in the text
    const analogyPatterns = [
      /like.*?(?=\.|!|\?)/gi,
      /imagine.*?(?=\.|!|\?)/gi,
      /think of.*?(?=\.|!|\?)/gi
    ];
    
    const analogies: string[] = [];
    analogyPatterns.forEach(pattern => {
      const matches = text.match(pattern) || [];
      analogies.push(...matches);
    });
    
    return analogies;
  }

  private extractCommonMistakes(text: string): string[] {
    const mistakeSection = text.match(/common mistakes?:?\s*(.*?)(?:\n\n|\n[A-Z])/si);
    if (!mistakeSection) return [];
    
    return mistakeSection[1]
      .split(/\n|•|-/)
      .map(mistake => mistake.trim())
      .filter(mistake => mistake.length > 0);
  }

  private extractExercises(text: string): string[] {
    const exerciseSection = text.match(/practice exercises?:?\s*(.*?)(?:\n\n|\n[A-Z])/si);
    if (!exerciseSection) return [];
    
    return exerciseSection[1]
      .split(/\n|•|-/)
      .map(exercise => exercise.trim())
      .filter(exercise => exercise.length > 0);
  }

  private extractRelatedConcepts(text: string): string[] {
    const conceptSection = text.match(/related concepts?:?\s*(.*?)(?:\n\n|\n[A-Z])/si);
    if (!conceptSection) return [];
    
    return conceptSection[1]
      .split(/,|•|-|\n/)
      .map(concept => concept.trim())
      .filter(concept => concept.length > 0);
  }

  private extractSection(text: string, sectionName: string): string {
    const pattern = new RegExp(`${sectionName}:?\\s*(.*?)(?:\\n\\n|\\n[A-Z])`, 'si');
    const match = text.match(pattern);
    return match ? match[1].trim() : '';
  }

  private extractSteps(text: string): string[] {
    const stepsSection = text.match(/steps?:?\s*(.*?)(?:\n\n|\n[A-Z])/si);
    if (!stepsSection) return [];
    
    return stepsSection[1]
      .split(/\n|\d+\./)
      .map(step => step.trim())
      .filter(step => step.length > 0);
  }

  private extractCodeBlock(text: string): string {
    const codeBlock = text.match(/```[\s\S]*?```/);
    return codeBlock ? codeBlock[0].replace(/```\w*\n?|\n?```/g, '').trim() : '';
  }

  private extractLearningPoints(text: string): string[] {
    const learningSection = text.match(/learning points?:?\s*(.*?)(?:\n\n|\n[A-Z])/si);
    if (!learningSection) return [];
    
    return learningSection[1]
      .split(/\n|•|-/)
      .map(point => point.trim())
      .filter(point => point.length > 0);
  }

  private extractPrevention(text: string): string[] {
    const preventionSection = text.match(/prevent.*?:?\s*(.*?)(?:\n\n|\n[A-Z])/si);
    if (!preventionSection) return [];
    
    return preventionSection[1]
      .split(/\n|•|-/)
      .map(tip => tip.trim())
      .filter(tip => tip.length > 0);
  }

  private extractChanges(text: string): RefactorChange[] {
    const changesSection = text.match(/changes?:?\s*(.*?)(?:\n\n|\n[A-Z])/si);
    if (!changesSection) return [];
    
    const changes = changesSection[1]
      .split(/\n|•|-/)
      .map(change => change.trim())
      .filter(change => change.length > 0);
    
    return changes.map(change => ({
      description: change,
      type: this.inferChangeType(change),
      lineNumber: this.extractLineNumber(change)
    }));
  }

  private extractBenefits(text: string): string[] {
    const benefitsSection = text.match(/benefits?:?\s*(.*?)(?:\n\n|\n[A-Z])/si);
    if (!benefitsSection) return [];
    
    return benefitsSection[1]
      .split(/\n|•|-/)
      .map(benefit => benefit.trim())
      .filter(benefit => benefit.length > 0);
  }

  private extractAlternatives(text: string): string[] {
    const alternativesSection = text.match(/alternatives?:?\s*(.*?)(?:\n\n|\n[A-Z])/si);
    if (!alternativesSection) return [];
    
    return alternativesSection[1]
      .split(/\n|•|-/)
      .map(alt => alt.trim())
      .filter(alt => alt.length > 0);
  }

  private inferChangeType(change: string): RefactorChangeType {
    if (change.includes('rename') || change.includes('name')) return 'rename';
    if (change.includes('extract') || change.includes('function')) return 'extract';
    if (change.includes('remove') || change.includes('delete')) return 'remove';
    if (change.includes('add') || change.includes('insert')) return 'add';
    if (change.includes('move') || change.includes('reorganize')) return 'move';
    return 'modify';
  }

  private extractLineNumber(change: string): number | undefined {
    const lineMatch = change.match(/line\s+(\d+)/i);
    return lineMatch ? parseInt(lineMatch[1]) : undefined;
  }

  private fallbackParseCodeSuggestions(response: string): CodeSuggestion[] {
    // Fallback parsing when JSON parsing fails
    const suggestions: CodeSuggestion[] = [];
    const lines = response.split('\n');
    
    let currentSuggestion: Partial<CodeSuggestion> = {};
    
    for (const line of lines) {
      if (line.includes('```')) {
        if (currentSuggestion.text) {
          suggestions.push(currentSuggestion as CodeSuggestion);
          currentSuggestion = {};
        } else {
          currentSuggestion.text = '';
        }
      } else if (currentSuggestion.text !== undefined && line.trim()) {
        currentSuggestion.text += line + '\n';
      } else if (line.toLowerCase().includes('explanation')) {
        currentSuggestion.explanation = line.replace(/explanation:?\s*/i, '');
      }
    }
    
    if (currentSuggestion.text) {
      suggestions.push(currentSuggestion as CodeSuggestion);
    }
    
    return suggestions.map(s => ({
      ...s,
      confidence: 0.8,
      concepts: [],
      difficulty: 'intermediate' as SkillLevel,
      educational: true
    }));
  }
}

// Type definitions for parsing
interface ConceptExplanation {
  concept: string;
  explanation: string;
  examples: string[];
  analogies: string[];
  commonMistakes: string[];
  practiceExercises: string[];
  relatedConcepts: string[];
}

interface DebugSuggestion {
  explanation: string;
  steps: string[];
  correctedCode: string;
  learningPoints: string[];
  prevention: string[];
}

interface RefactorSuggestion {
  refactoredCode: string;
  changes: RefactorChange[];
  explanation: string;
  benefits: string[];
  alternatives: string[];
}

interface RefactorChange {
  description: string;
  type: RefactorChangeType;
  lineNumber?: number;
}

type RefactorChangeType = 'rename' | 'extract' | 'remove' | 'add' | 'move' | 'modify';

interface RefactorIntent {
  description: string;
  goals: string[];
}

interface CodeSuggestion {
  text: string;
  explanation: string;
  confidence: number;
  concepts: string[];
  difficulty: SkillLevel;
  educational: boolean;
  alternative?: string;
}

interface CodeContext {
  language: string;
  currentCode: string;
  cursorPosition: { line: number; column: number };
  incompleteLine: string;
  educationalContext?: EducationalContext;
}

interface CodeError {
  message: string;
  type: string;
  line: number;
  column?: number;
}

interface EducationalContext {
  student: {
    skillLevel: SkillLevel;
    learningStyle: string;
    masteredConcepts: string[];
    strugglingConcepts: string[];
  };
  lesson: {
    title: string;
    objectives: string[];
  };
  codeContext: {
    language: string;
  };
}

type SkillLevel = 'beginner' | 'intermediate' | 'advanced';
```

#### 3. OpenAI Provider (`/src/lib/llm-providers/openai-provider.ts`)

```typescript
import { BaseLLMProvider } from './base-provider';
import OpenAI from 'openai';

export class OpenAIProvider extends BaseLLMProvider {
  name = 'OpenAI';
  apiKey = process.env.OPENAI_API_KEY || '';
  baseUrl = 'https://api.openai.com/v1';
  costPerToken = 0.00001;
  educationalFocus = false;

  models: LLMModel[] = [
    {
      id: 'gpt-4-turbo-preview',
      name: 'GPT-4 Turbo',
      contextWindow: 128000,
      maxTokens: 4096,
      strengths: ['code_completion', 'speed', 'accuracy'],
      useCases: ['completion', 'generation', 'refactoring'],
      latency: { average: 800, p95: 1500, p99: 2500 }
    },
    {
      id: 'gpt-3.5-turbo',
      name: 'GPT-3.5 Turbo',
      contextWindow: 16000,
      maxTokens: 4096,
      strengths: ['speed', 'code_completion'],
      useCases: ['completion', 'debugging'],
      latency: { average: 300, p95: 600, p99: 1000 }
    }
  ];

  capabilities: LLMCapability = {
    codeCompletion: true,
    codeExplanation: true,
    debugging: true,
    refactoring: true,
    codeGeneration: true,
    conceptExplanation: true,
    multiLanguage: ['python', 'javascript', 'typescript', 'java', 'cpp', 'go', 'rust']
  };

  rateLimit: RateLimit = {
    requestsPerMinute: 60,
    tokensPerMinute: 90000,
    concurrent: 10
  };

  private client: OpenAI;

  constructor() {
    super();
    this.client = new OpenAI({
      apiKey: this.apiKey,
    });
  }

  async generateCompletion(
    prompt: string,
    options: CompletionOptions = {}
  ): Promise<CompletionResult> {
    const startTime = Date.now();
    
    try {
      const model = options.educationalMode ? 'gpt-4-turbo-preview' : 'gpt-3.5-turbo';
      
      const educationalPrompt = options.educationalMode 
        ? this.formatEducationalPrompt(prompt, options as any)
        : prompt;

      const completion = await this.client.chat.completions.create({
        model,
        messages: [
          {
            role: 'system',
            content: options.educationalMode 
              ? 'You are an expert programming tutor focused on teaching concepts clearly and providing educational explanations.'
              : 'You are a helpful programming assistant.'
          },
          {
            role: 'user',
            content: educationalPrompt
          }
        ],
        max_tokens: options.maxTokens || 1000,
        temperature: options.temperature || 0.7,
        top_p: options.topP || 1,
        presence_penalty: options.presencePenalty || 0,
        frequency_penalty: options.frequencyPenalty || 0
      });

      const text = completion.choices[0]?.message?.content || '';

      return {
        text,
        confidence: this.calculateConfidence(completion),
        provider: this.name,
        model,
        tokensUsed: completion.usage?.total_tokens || 0,
        latency: Date.now() - startTime,
        educational: options.educationalMode || false,
        explanation: options.educationalMode ? this.extractExplanation(text) : undefined
      };

    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI completion failed: ${error}`);
    }
  }

  async generateCodeSuggestions(
    context: CodeContext
  ): Promise<CodeSuggestion[]> {
    const prompt = `
As a programming tutor, analyze this code and provide intelligent completions:

Current Code:
\`\`\`${context.language}
${context.currentCode}
\`\`\`

Cursor at: Line ${context.cursorPosition.line}, Column ${context.cursorPosition.column}
Incomplete: "${context.incompleteLine}"

Student Context:
- Level: ${context.educationalContext?.student.skillLevel}
- Lesson: ${context.educationalContext?.lesson.title}

Provide 3-5 code completions with:
1. The completion code
2. Brief explanation of what it does
3. Why it's appropriate for this context
4. Educational value

Format as JSON:
{
  "suggestions": [
    {
      "code": "completion_text",
      "explanation": "what this does",
      "educational_note": "why this teaches good practices",
      "confidence": 0.9
    }
  ]
}
`;

    const result = await this.generateCompletion(prompt, {
      educationalMode: true,
      maxTokens: 1200,
      temperature: 0.3
    });

    return this.parseCodeSuggestions(result.text);
  }

  // ... implement other methods similar to Claude provider
  // (explainConcept, debugCode, refactorCode)

  private calculateConfidence(completion: any): number {
    // Calculate confidence based on OpenAI response characteristics
    const logprobs = completion.choices[0]?.logprobs;
    if (!logprobs) return 0.8; // Default confidence
    
    // Use logprobs to calculate actual confidence
    const avgLogprob = logprobs.content?.reduce((sum: number, token: any) => 
      sum + token.logprob, 0) / (logprobs.content?.length || 1);
    
    return Math.min(0.95, Math.max(0.1, Math.exp(avgLogprob)));
  }

  // ... other helper methods
}
```

#### 4. Local Provider (`/src/lib/llm-providers/local-provider.ts`)

```typescript
import { BaseLLMProvider } from './base-provider';

export class LocalProvider extends BaseLLMProvider {
  name = 'Local';
  apiKey = 'local';
  baseUrl = process.env.LOCAL_LLM_ENDPOINT || 'http://localhost:8080';
  costPerToken = 0;
  educationalFocus = false;

  models: LLMModel[] = [
    {
      id: 'codellama-13b',
      name: 'Code Llama 13B',
      contextWindow: 16000,
      maxTokens: 2048,
      strengths: ['code_completion', 'privacy'],
      useCases: ['completion', 'debugging'],
      latency: { average: 200, p95: 400, p99: 600 }
    }
  ];

  capabilities: LLMCapability = {
    codeCompletion: true,
    codeExplanation: false,
    debugging: true,
    refactoring: false,
    codeGeneration: true,
    conceptExplanation: false,
    multiLanguage: ['python', 'javascript', 'typescript']
  };

  rateLimit: RateLimit = {
    requestsPerMinute: 120,
    tokensPerMinute: 50000,
    concurrent: 20
  };

  async generateCompletion(
    prompt: string,
    options: CompletionOptions = {}
  ): Promise<CompletionResult> {
    const startTime = Date.now();
    
    try {
      const response = await fetch(`${this.baseUrl}/v1/completions`, {
        method: 'POST',
        headers: this.buildHeaders(),
        body: JSON.stringify({
          prompt,
          max_tokens: options.maxTokens || 500,
          temperature: options.temperature || 0.3,
          stop: ['```', '\n\n\n']
        })
      });

      if (!response.ok) {
        throw new Error(`Local LLM request failed: ${response.statusText}`);
      }

      const data = await response.json();
      const text = data.choices[0]?.text || '';

      return {
        text,
        confidence: 0.7, // Local models generally lower confidence
        provider: this.name,
        model: 'codellama-13b',
        tokensUsed: data.usage?.total_tokens || 0,
        latency: Date.now() - startTime,
        educational: false,
      };

    } catch (error) {
      console.error('Local LLM error:', error);
      throw new Error(`Local LLM completion failed: ${error}`);
    }
  }

  async generateCodeSuggestions(
    context: CodeContext
  ): Promise<CodeSuggestion[]> {
    // Simplified implementation for local model
    const prompt = `Complete this ${context.language} code:\n\n${context.currentCode}`;
    
    const result = await this.generateCompletion(prompt, {
      maxTokens: 200,
      temperature: 0.2
    });

    // Simple parsing for local model
    return [{
      text: result.text.trim(),
      explanation: 'Code completion suggestion',
      confidence: result.confidence,
      concepts: [],
      difficulty: 'intermediate' as SkillLevel,
      educational: false
    }];
  }

  // Simplified implementations for other methods
  async explainConcept(): Promise<ConceptExplanation> {
    throw new Error('Concept explanation not supported by local provider');
  }

  async debugCode(): Promise<DebugSuggestion> {
    throw new Error('Advanced debugging not supported by local provider');
  }

  async refactorCode(): Promise<RefactorSuggestion> {
    throw new Error('Refactoring not supported by local provider');
  }
}
```

#### 5. Provider Selector (`/src/lib/llm-providers/provider-selector.ts`)

```typescript
import { BaseLLMProvider } from './base-provider';
import { ClaudeProvider } from './claude-provider';
import { OpenAIProvider } from './openai-provider';
import { LocalProvider } from './local-provider';

export interface ProviderConstraints {
  maxLatency?: number;
  costOptimized?: boolean;
  privacyRequired?: boolean;
  allowLocal?: boolean;
  educationalFocus?: boolean;
  reliability?: 'high' | 'medium' | 'low';
}

export class ProviderSelector {
  private providers: Map<string, BaseLLMProvider>;
  private usageStats: Map<string, ProviderStats>;

  constructor() {
    this.providers = new Map([
      ['claude', new ClaudeProvider()],
      ['openai', new OpenAIProvider()],
      ['local', new LocalProvider()]
    ]);
    
    this.usageStats = new Map();
    this.initializeStats();
  }

  selectProvider(
    task: CodeAssistanceType,
    context: EducationalContext,
    constraints: ProviderConstraints = {}
  ): BaseLLMProvider {
    
    // Filter available providers based on constraints
    const availableProviders = this.filterProviders(constraints);
    
    // Score providers for this specific task
    const scoredProviders = this.scoreProviders(
      availableProviders,
      task,
      context,
      constraints
    );
    
    // Select best provider
    const bestProvider = this.selectBestProvider(scoredProviders);
    
    // Update usage statistics
    this.updateUsageStats(bestProvider.name, task);
    
    return bestProvider;
  }

  private filterProviders(constraints: ProviderConstraints): BaseLLMProvider[] {
    const filtered: BaseLLMProvider[] = [];
    
    for (const [name, provider] of this.providers) {
      // Privacy constraint
      if (constraints.privacyRequired && name !== 'local') {
        continue;
      }
      
      // Local allowance
      if (name === 'local' && !constraints.allowLocal) {
        continue;
      }
      
      // Check if provider is available
      if (!this.isProviderAvailable(name)) {
        continue;
      }
      
      filtered.push(provider);
    }
    
    return filtered;
  }

  private scoreProviders(
    providers: BaseLLMProvider[],
    task: CodeAssistanceType,
    context: EducationalContext,
    constraints: ProviderConstraints
  ): Array<{ provider: BaseLLMProvider; score: number }> {
    
    return providers.map(provider => ({
      provider,
      score: this.calculateProviderScore(provider, task, context, constraints)
    })).sort((a, b) => b.score - a.score);
  }

  private calculateProviderScore(
    provider: BaseLLMProvider,
    task: CodeAssistanceType,
    context: EducationalContext,
    constraints: ProviderConstraints
  ): number {
    let score = 0;
    
    // Task suitability score (0-40 points)
    score += this.getTaskSuitabilityScore(provider, task);
    
    // Educational context score (0-30 points)
    score += this.getEducationalScore(provider, context);
    
    // Performance score (0-20 points)
    score += this.getPerformanceScore(provider, constraints);
    
    // Cost efficiency score (0-10 points)
    score += this.getCostScore(provider, constraints);
    
    return score;
  }

  private getTaskSuitabilityScore(
    provider: BaseLLMProvider,
    task: CodeAssistanceType
  ): number {
    const model = provider.models[0]; // Primary model
    
    if (!model.useCases.includes(task)) {
      return 0;
    }
    
    // Score based on model strengths
    const relevantStrengths = this.getRelevantStrengths(task);
    const matchingStrengths = model.strengths.filter(
      strength => relevantStrengths.includes(strength)
    ).length;
    
    return (matchingStrengths / relevantStrengths.length) * 40;
  }

  private getEducationalScore(
    provider: BaseLLMProvider,
    context: EducationalContext
  ): number {
    let score = 0;
    
    // Educational focus bonus
    if (provider.educationalFocus) {
      score += 15;
    }
    
    // Explanation capability
    if (provider.capabilities.conceptExplanation) {
      score += 10;
    }
    
    // Student level appropriate
    if (context.student.skillLevel === 'beginner' && provider.educationalFocus) {
      score += 5;
    }
    
    return score;
  }

  private getPerformanceScore(
    provider: BaseLLMProvider,
    constraints: ProviderConstraints
  ): number {
    const model = provider.models[0];
    let score = 20; // Base score
    
    // Latency penalty
    if (constraints.maxLatency) {
      if (model.latency.average > constraints.maxLatency) {
        score -= 10;
      }
    }
    
    // Reliability bonus
    const stats = this.usageStats.get(provider.name);
    if (stats) {
      score += (stats.successRate - 0.9) * 100; // Bonus for >90% success rate
    }
    
    return Math.max(0, score);
  }

  private getCostScore(
    provider: BaseLLMProvider,
    constraints: ProviderConstraints
  ): number {
    if (!constraints.costOptimized) {
      return 5; // Neutral score
    }
    
    // Lower cost = higher score
    const maxCost = 0.00002; // Maximum reasonable cost per token
    const costRatio = provider.costPerToken / maxCost;
    
    return Math.max(0, 10 * (1 - costRatio));
  }

  private selectBestProvider(
    scoredProviders: Array<{ provider: BaseLLMProvider; score: number }>
  ): BaseLLMProvider {
    if (scoredProviders.length === 0) {
      // Fallback to OpenAI if no providers available
      return this.providers.get('openai')!;
    }
    
    return scoredProviders[0].provider;
  }

  private getRelevantStrengths(task: CodeAssistanceType): ModelStrength[] {
    const strengthMap: Record<CodeAssistanceType, ModelStrength[]> = {
      'completion': ['code_completion', 'speed', 'accuracy'],
      'explanation': ['reasoning', 'explanation', 'educational_content'],
      'debugging': ['debugging', 'reasoning', 'accuracy'],
      'refactoring': ['code_completion', 'reasoning', 'accuracy'],
      'generation': ['code_completion', 'reasoning'],
      'review': ['reasoning', 'explanation', 'educational_content'],
      'concept_teaching': ['reasoning', 'explanation', 'educational_content']
    };
    
    return strengthMap[task] || ['reasoning'];
  }

  private isProviderAvailable(providerName: string): boolean {
    // Check if provider API keys are configured and service is available
    const provider = this.providers.get(providerName);
    if (!provider) return false;
    
    // For local provider, check if endpoint is reachable
    if (providerName === 'local') {
      return this.checkLocalProviderHealth();
    }
    
    // For cloud providers, check if API key is configured
    return !!provider.apiKey && provider.apiKey !== '';
  }

  private checkLocalProviderHealth(): boolean {
    // Implement health check for local LLM endpoint
    // This could be cached for performance
    return true; // Simplified for now
  }

  private updateUsageStats(providerName: string, task: CodeAssistanceType): void {
    const stats = this.usageStats.get(providerName) || {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageLatency: 0,
      taskUsage: new Map(),
      successRate: 1
    };
    
    stats.totalRequests++;
    
    const taskCount = stats.taskUsage.get(task) || 0;
    stats.taskUsage.set(task, taskCount + 1);
    
    this.usageStats.set(providerName, stats);
  }

  private initializeStats(): void {
    for (const providerName of this.providers.keys()) {
      this.usageStats.set(providerName, {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        averageLatency: 0,
        taskUsage: new Map(),
        successRate: 1
      });
    }
  }

  // Public methods for monitoring and configuration
  getProviderStats(): Map<string, ProviderStats> {
    return new Map(this.usageStats);
  }

  resetStats(): void {
    this.initializeStats();
  }

  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys()).filter(name => 
      this.isProviderAvailable(name)
    );
  }
}

interface ProviderStats {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageLatency: number;
  taskUsage: Map<CodeAssistanceType, number>;
  successRate: number;
}
```

This implementation provides a robust foundation for the multi-LLM provider system with:

1. **Flexible Provider Architecture**: Easy to add new LLM providers
2. **Intelligent Provider Selection**: Automatic selection based on task requirements, educational context, and constraints
3. **Educational Focus**: Special handling for educational explanations and context
4. **Performance Monitoring**: Usage statistics and health checking
5. **Cost Optimization**: Provider selection considers cost efficiency
6. **Privacy Options**: Local model support for sensitive data
7. **Fallback Systems**: Graceful degradation when providers are unavailable

The system is designed to enhance the existing Agent Academy IDE while maintaining educational integrity and providing powerful AI assistance comparable to modern development tools.
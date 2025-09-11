# 🤖 Agent Academy IDE - Claude Code Experience Setup

## Overview

The Agent Academy IDE now includes terminal-based AI interaction similar to Claude Code in VS Code! You can get AI assistance directly in the terminal with natural language commands.

## Quick Setup

### Option 1: Claude API (Recommended)
1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Add your Anthropic API key to `.env.local`:
   ```bash
   ANTHROPIC_API_KEY=your-anthropic-api-key-here
   ```

3. Get your API key from: https://console.anthropic.com/

### Option 2: OpenAI API
1. Add your OpenAI API key to `.env.local`:
   ```bash
   OPENAI_API_KEY=your-openai-api-key-here
   ```

2. Get your API key from: https://platform.openai.com/api-keys

### Option 3: Local Development (No API key needed)
The system will automatically use mock responses for testing without any API keys.

## Features Added

### ✅ Fixed Issues
- **Border/Viewport**: Added proper borders and prevented content cropping
- **Terminal Resize**: Fixed bi-directional resize (drag up to expand, down to shrink)
- **Hydration Errors**: Fixed keyboard shortcut display issues

### 🤖 AI Terminal Commands

#### Basic AI Commands:
```bash
ai How do I create a class in Python?
ai What's the difference between lists and tuples?
debug NameError: name 'x' is not defined
explain this function
```

#### AI Terminal Commands:
```bash
/help      # Show AI terminal help
/model     # Show current AI model
/clear     # Clear AI conversation history
/provider  # Show current AI provider
```

#### Natural Language (Claude Code-like):
```bash
How to sort a list in Python?
What is the difference between == and is?
Fix this error: TypeError: 'int' object is not iterable
Generate a function to calculate fibonacci numbers
```

## Usage Examples

### 1. Debug Code Errors
```bash
$ debug TypeError: 'int' object is not iterable
🐛 Debug Analysis:
This error occurs when you try to iterate over an integer...
```

### 2. Explain Code
```bash
$ explain
🧠 Code Explanation:
This code defines an AIAgent class that...
```

### 3. Natural Questions
```bash
$ How do I read a file in Python?
🤖 AI Assistant:
To read a file in Python, you can use the open() function...
```

### 4. AI Commands
```bash
$ ai Generate a sorting function
🤖 AI Assistant:
Here's a sorting function implementation...
```

## Terminal Interface

The terminal now includes:
- **Better borders**: Rounded corners and proper viewport constraints
- **Bi-directional resize**: Drag the resize handle up/down to adjust terminal height
- **AI integration**: Natural language processing for coding help
- **Visual feedback**: Icons and color coding for different response types

## Test the Setup

1. **Open the IDE**: http://localhost:3025/ide-demo (or your available port)
2. **Open Terminal**: Click the terminal toggle button
3. **Try AI Commands**:
   ```bash
   help                    # See all commands
   ai hello world         # Test AI response
   /help                  # AI terminal help
   ```

## Advanced Configuration

### Custom AI Provider
You can initialize with a specific provider:
```typescript
import { AITerminalClient } from '@/lib/ai-terminal-client'

// Force Claude even with OpenAI key available
const ai = new AITerminalClient('claude', 'your-api-key')

// Force OpenAI
const ai = new AITerminalClient('openai', 'your-api-key')

// Local development
const ai = new AITerminalClient('local')
```

### Environment Variables
```bash
# .env.local
ANTHROPIC_API_KEY=sk-ant-api03-...    # Claude API
OPENAI_API_KEY=sk-proj-...            # OpenAI API
```

## Troubleshooting

### Issue: "AI Error: API key not configured"
**Solution**: Add your API key to `.env.local` file

### Issue: "Command not found"
**Solution**: Check the help menu with `help` command for available commands

### Issue: AI responses are mock/placeholder text
**Solution**: This means you're in local development mode. Add an API key to enable real AI.

### Issue: Terminal not resizing properly
**Solution**: Try refreshing the page. The resize handle should work in both directions.

## What's Different from Claude Code?

### Similarities:
✅ Natural language queries  
✅ Code debugging assistance  
✅ Contextual code explanations  
✅ Terminal-based interaction  

### Enhancements:
🚀 Integrated into a full IDE  
🚀 Educational context (Agent Academy)  
🚀 Python code execution  
🚀 Multi-provider AI support  
🚀 Conversation history  
🚀 Export functionality  

## Next Steps

1. **Test the AI integration** with your API key
2. **Try different AI commands** to see what works best
3. **Use natural language** just like you would with Claude Code
4. **Combine with code execution** for a complete learning experience

The Agent Academy IDE now provides a Claude Code-like experience directly in your browser! 🎉
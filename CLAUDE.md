# CodeFly Project Documentation

## CRITICAL NAMING CONVENTIONS - READ FIRST

### Platform Name: CodeFly ✈️
- **CodeFly** is the educational platform/software we are building
- This is the product name that appears in all UI, headers, and branding
- CodeFly will eventually host multiple educational games

### Current Game: Black Cipher 🎮
- **Black Cipher** is the GAME NAME (not Shadow Protocol!)
- Black Cipher is the first game within the CodeFly platform
- The game teaches coding through a spy/agent themed adventure

### Mission Names Within Black Cipher Game:
1. **Shadow Protocol** (Weeks 1-4) - First mission phase
2. **Cipher Command** (Weeks 5-8) - Second mission phase  
3. **Ghost Protocol** (Weeks 9-13) - Third mission phase
4. **Quantum Breach** (Weeks 14-18) - Final mission phase

### Hierarchy Summary:
```
CodeFly (Platform)
  └── Black Cipher (Game)
      ├── Shadow Protocol (Mission 1)
      ├── Cipher Command (Mission 2)
      ├── Ghost Protocol (Mission 3)
      └── Quantum Breach (Mission 4)
```

## Project Structure

### Repository Name
- Current: `Curriculum-pilot-mvp`
- Should rename to: `codefly-platform`

### Package.json Name
- Current: `coding-pilot-mvp`
- Should be: `codefly`

## UI Text Guidelines

### Correct Usage Examples:
- ✅ "Welcome to CodeFly - Learn To Code On The Fly"
- ✅ "Black Cipher: Episode 1 - Shadow Protocol"
- ✅ "Begin your Black Cipher training at Binary Shores Academy"
- ✅ "CodeFly presents: Black Cipher"

### Incorrect Usage (AVOID):
- ❌ "Welcome to Shadow Protocol" (Shadow Protocol is just one mission)
- ❌ "Shadow Protocol Curriculum" (It's Black Cipher curriculum)
- ❌ "Shadow Protocol Game" (The game is Black Cipher)

## Teacher Dashboard Requirements

The teacher dashboard should reflect:
1. **Platform branding**: CodeFly logo and colors
2. **Game context**: Black Cipher theming (spy/agent theme)
3. **Mission tracking**: Show student progress through all 4 Black Cipher missions
4. **Proper naming**: Use "Black Cipher" when referring to the game

## Student Experience

Students are:
- Playing the **Black Cipher** game
- On the **CodeFly** platform
- Currently in the **Shadow Protocol** mission (weeks 1-4)

## Future Expansion

CodeFly will eventually include:
- Black Cipher (Current - Beginner Python)
- [Future Game 2] (Intermediate Web Development)
- [Future Game 3] (Advanced Full-Stack)
- [Future Game 4] (AI/ML Concepts)

## Quick Reference

| Context | Correct Term | NOT |
|---------|-------------|-----|
| Platform/Software | CodeFly | Black Cipher, Shadow Protocol |
| Current Game | Black Cipher | Shadow Protocol, CodeFly Game |
| Week 1-4 Mission | Shadow Protocol | Black Cipher Mission 1 |
| Curriculum Name | Black Cipher Curriculum | Shadow Protocol Curriculum |
| Dashboard Title | CodeFly Teacher Dashboard | Black Cipher Dashboard |

## Remember
- **CodeFly** = The platform (like Steam or Epic Games)
- **Black Cipher** = The game (like Fortnite or Minecraft)
- **Shadow Protocol** = Mission 1 within the game (like Season 1 or Chapter 1)

## CRITICAL DEVELOPMENT RULES - NEVER VIOLATE

### 🚨 STRICT MODIFICATION POLICY
**ONLY modify what the user EXPLICITLY asks you to modify. NEVER change anything else.**

#### When user says:
- "Update the dashboard styling" → ONLY update styling, keep all existing functionality and content
- "Fix this component" → ONLY fix the specific issue, don't rewrite the entire component
- "Add a feature to X" → ONLY add to X, don't modify other components
- "Make it look like Y" → ONLY apply visual styling from Y, preserve all existing functionality

#### FORBIDDEN Actions:
- ❌ Replacing entire components when only styling was requested
- ❌ Removing existing functionality (tabs, maps, features) unless explicitly told
- ❌ Changing file structure or imports unless required for the specific task
- ❌ "Improving" code that wasn't mentioned in the request
- ❌ Rewriting working code just because you think it could be better

#### REQUIRED Actions:
- ✅ Ask for clarification if the request is ambiguous
- ✅ Preserve ALL existing functionality when making styling changes
- ✅ Use Edit/MultiEdit for targeted changes, not complete rewrites
- ✅ Test that existing features still work after changes

#### If you can't make the requested change without affecting other parts:
**STOP and explain the limitation. Ask for permission before making broader changes.**

## BLACK CIPHER STORY - CORE NARRATIVE

### 🎯 MISSION: OPERATION DIGITAL FORTRESS

**Background**: Intelligence has discovered a rogue AI system codenamed "BLACK CIPHER" operating from a fortified mountain facility. This AI threatens global security through advanced cyber warfare capabilities.

**Student Role**: Students are **AGENTS** tasked with infiltrating the "Digital Fortress" to:
- Decode encrypted Python protocols
- Navigate through secured facility zones  
- Neutralize the AI threat
- Extract critical intelligence

### 🏔️ THE DIGITAL FORTRESS (Game World)

The Black Cipher facility is divided into secured zones that agents must infiltrate:

#### Chapter 1: Tutorial Islands (Outer Perimeter)
- **Binary Shores Academy** - Initial infiltration point, learn basic encryption
- **Variable Village** - Data manipulation training sector  
- **Logic Lake Outpost** - Conditional security systems

#### Chapter 2: Central Mainland (Inner Facility)
- **Loop Canyon Base** - Automated defense systems
- **Function Forest Station** - Modular security protocols
- **Array Mountains Facility** - Data structure fortifications

#### Chapter 3: Advanced Zone (High Security)
- **Object Oasis Complex** - Advanced AI systems
- **Algorithm Archipelago** - Computational defense networks

#### Chapter 4: Digital Frontier (Core Systems)
- **API Gateway Fortress** - External communication hub
- **Database Depths** - Intelligence storage vault

#### Final Target: The Core
- **The Core Protocol** - The Black Cipher AI itself

### 🕵️ AGENT TERMINOLOGY (Use These Terms)

**NEVER USE**:
- Quest Map → Use "Mission Map"  
- Guild Hall → Use "Agent Command" or "Field Ops Center"
- Players → Use "Agents"
- Quests → Use "Missions" or "Operations"
- Game → Use "Operation" or "Mission"

**ALWAYS USE**:
- **Mission Map** - Tactical overview of Digital Fortress zones
- **Agent Command** - Where agents coordinate and view team status  
- **Field Ops Center** - Mission briefings and team leaderboards
- **Agents** - The students infiltrating Black Cipher
- **Operations** - Individual coding challenges/lessons
- **Digital Fortress** - The game world/facility being infiltrated
- **Tactical HUD** - The interface styling
- **Intel** - Information/hints
- **Clearance Level** - Student progress level
- **Mission Status** - Completion progress

### 🎨 VISUAL THEME
- Dark military/tactical interface (blacks, greens, amber)
- HUD overlays with scanning lines and tactical elements
- Monospace fonts for computer terminal feel
- Corner brackets and status indicators
- "CLASSIFIED" and "TOP SECRET" styling elements

## BLACK CIPHER CHARACTER UNIVERSE

### 🎭 AGENT AVATARS (Student Characters)
Students choose from specialized agent archetypes:

**🕵️‍♂️ CIPHER OPERATIVE** - The Classic Spy
- Starting bonus: +10% XP on stealth missions
- Special ability: Code Invisibility (bypass one error per lesson)
- Avatar: 🕵️‍♂️

**🤖 TECH SPECIALIST** - The Hacker
- Starting bonus: +15% faster debugging
- Special ability: System Override (skip one challenge per mission)  
- Avatar: 👨‍💻

**⚡ CYBER NINJA** - The Speed Runner
- Starting bonus: +20% completion speed bonus
- Special ability: Lightning Code (double XP for 5 minutes)
- Avatar: 🥷

**🔬 DATA ANALYST** - The Strategic Mind
- Starting bonus: +25% XP on logic puzzles
- Special ability: Pattern Recognition (get hints on complex problems)
- Avatar: 👩‍🔬

**🛡️ SECURITY EXPERT** - The Defender
- Starting bonus: Extra attempt on failed missions
- Special ability: Firewall Shield (prevent XP loss on mistakes)
- Avatar: 👨‍✈️

**🌟 ROOKIE AGENT** - The Beginner
- Starting bonus: +50% tutorial XP
- Special ability: Training Wheels (extended time limits)
- Avatar: 🧑‍🎓

### 👑 COMMAND STRUCTURE (Allies)

**🎖️ COMMANDER ATLAS** - Mission Director
- Provides mission briefings and strategic guidance
- Unlocks advanced operations at higher clearance levels
- "Agent, the Digital Fortress won't infiltrate itself."

**📡 OPERATOR ECHO** - Intel Coordinator  
- Real-time hints and tactical support during missions
- Manages field communications and progress tracking
- "Copy that, Agent. Intel coming through now."

**🔧 TECH CHIEF BINARY** - Systems Specialist
- Provides debugging tools and coding equipment
- Unlocks advanced IDE features and code assistants
- "I've upgraded your development environment, Agent."

**🧠 DR. SOPHIA QUANTUM** - AI Research Lead
- Explains complex algorithms and provides learning resources
- Final ally revealed to help defeat Black Cipher AI
- "Understanding the enemy's code is key to victory."

### 💀 VILLAINS & BOSSES

**🤖 BLACK CIPHER AI** - Final Boss
- The rogue artificial intelligence controlling the Digital Fortress
- Adapts to student coding patterns, becoming more challenging
- Must be defeated through advanced algorithm implementation
- "I AM THE FUTURE OF CODE. YOU ARE OBSOLETE."

**⚡ VIRUS GENERAL MALWARE** - Mid-Boss (Week 8)
- Commands corrupted code armies in the Algorithm Archipelago
- Creates buggy code challenges that must be debugged
- Weak to clean, efficient programming practices
- "Your code will be infected with my chaos!"

**🔐 ENCRYPTION MASTER CAESAR** - Early Boss (Week 4)
- Guards the security protocols in Loop Canyon Base
- Creates complex cipher puzzles and logic traps
- Defeated through mastery of loops and conditionals
- "None shall pass without solving my eternal riddles!"

**🕷️ DATA SPIDER CRAWLER** - Recurring Mini-Boss
- Appears randomly during missions to steal progress
- Can be defeated quickly with correct syntax
- Vulnerable to well-structured code
- "Sssssyntax errorsss are my favorite meal!"

**👥 SHADOW COLLECTIVE** - Henchmen
- Faceless coding challenges that serve the main villains
- Standard lesson obstacles with thematic flavoring
- "We are Legion. We are Bugs. We are Infinite."

### ⚡ POWER-UP SYSTEM

#### 🎯 TACTICAL BOOSTERS (Temporary - 15-30 mins)
**Code Accelerator** - 2x coding speed, faster typing recognition
**Debug Vision** - Highlights potential errors before running code  
**XP Amplifier** - 1.5x experience points for next 3 completed challenges
**Time Dilation** - Extended time limits on timed challenges
**Hint Radar** - Extra hints available during current session
**Syntax Shield** - First syntax error auto-corrected per mission

#### 🛡️ PERMANENT UNLOCKS (XP Milestones)
**Level 5**: Advanced Code Editor (syntax highlighting, autocomplete)
**Level 10**: AI Assistant Integration (coding suggestions)
**Level 15**: Mission Replay Access (redo completed missions for XP)
**Level 20**: Speed Mode (optional time challenges for bonus XP)
**Level 25**: Master Debugger (advanced error analysis tools)
**Level 30**: Algorithm Arsenal (pre-built code snippets library)

#### 🏆 SPECIALIST EQUIPMENT (Earned through missions)
**Quantum Keyboard** - Reduces typos, faster code input
**Neural Interface** - Better problem-solving hints and AI assistance
**Stealth Compiler** - Run code without alerting security (fewer penalties)
**Data Analyzer** - Cut through complex data structure challenges
**Logic Shield** - Protection against losing XP on failed attempts
**Cipher Scanner** - See hidden patterns in code puzzles
**Holographic Display** - Enhanced visual coding environment
**Memory Amplifier** - Remember more syntax and functions
**Processing Core** - Faster computational thinking

### 📈 PROGRESSION MECHANICS

#### What Gets Boosted:
1. **Coding Speed** - Faster lesson completion through enhanced processors
2. **XP Multipliers** - More points per correct answer via data amplifiers
3. **Error Forgiveness** - Extra attempts through backup systems
4. **Hint Access** - More clues via enhanced neural networks
5. **Time Extensions** - Extended processing time through quantum computing
6. **Advanced Tools** - Better IDE features and debugging scanners
7. **Replay Value** - Access archived missions through memory banks
8. **Collaboration** - Encrypted team channels with other agents (future)

## CYBER WARFARE MECHANICS (School-Safe)

### 🔬 HIGH-TECH BATTLE SYSTEM
- **Code Duels**: Logic puzzles against AI opponents
- **Data Streams**: Navigate information flows to solve problems  
- **Encryption Battles**: Decode enemy communications
- **System Infiltration**: Bypass security through programming
- **Virus Debugging**: Clean infected code to defeat enemies
- **Algorithm Racing**: Speed coding competitions
- **Neural Hacking**: Connect patterns to unlock systems
- **Quantum Computing**: Solve complex multi-dimensional problems

## 🚨 TROUBLESHOOTING PROTOCOL - MANDATORY

### When Issues Occur, ALWAYS:

1. **FIRST CHECK**: `KNOWN-SOLUTIONS.md` - We've solved this before? Use that solution!
2. **FOLLOW PROTOCOL**: Use `TROUBLESHOOTING-PROTOCOL.md` systematically
3. **LOG EVERYTHING**: Document each attempt in the protocol
4. **UPDATE KNOWLEDGE**: Add new solutions to `KNOWN-SOLUTIONS.md` after fixing
5. **TRACK AGENTS**: Log all deployed agents in `AGENT-REGISTRY.md`

### Quick Access Files:
- `KNOWN-SOLUTIONS.md` - Database of working fixes
- `TROUBLESHOOTING-PROTOCOL.md` - Systematic debugging approach
- `AGENT-REGISTRY.md` - Specialized agent tracking and efficiency metrics

### Efficiency Rules:
1. **NO REPEATED FAILURES** - Check logs before attempting same solution
2. **SPEED IS KEY** - Known issues should be fixed in < 2 minutes
3. **DOCUMENT SUCCESS** - Every new solution goes in KNOWN-SOLUTIONS.md
4. **IMPROVE AGENTS** - Update templates when agents aren't fast enough
5. **MEASURE EVERYTHING** - Track resolution times in AGENT-REGISTRY.md
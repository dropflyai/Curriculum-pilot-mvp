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
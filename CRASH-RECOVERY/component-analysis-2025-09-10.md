# COMPONENT INTERACTION ANALYSIS
**SESSION**: DOC-001-2025-09-10  
**FOCUS**: Terminal Resize Troubleshooting  

## COMPONENT HIERARCHY & DATA FLOW

### Parent Component: AgentAcademyIDE-Enhanced.tsx
```
Location: /Users/rioallen/Documents/DropFly-OS-App-Builder/DropFly-PROJECTS/Curriculum-pilot-mvp/src/components/AgentAcademyIDE-Enhanced.tsx
Lines: 889 total
Status: ACTIVE with TypeScript errors
```

#### Key State Management
- **terminalHeight** (line 117): `useState(300)` - Controls bottom panel height
- **showTerminal** (line 116): `useState(true)` - Controls panel visibility
- **setTerminalHeight**: Height update function passed to BottomPanel

#### Integration Point (Lines 864-871)
```typescript
<BottomPanel
  isVisible={showTerminal}
  onToggle={() => setShowTerminal(!showTerminal)}
  height={terminalHeight}
  onHeightChange={setTerminalHeight}
  pyodide={pyodideRef.current}
  codeContent={getCurrentCode()}
/>
```

#### Current Issues
- **Line 32**: Duplicate identifier 'Command' error
- **TypeScript Compilation**: Blocking build process
- **Function Status**: Core functionality working despite errors

### Child Component: BottomPanel.tsx
```
Location: /Users/rioallen/Documents/DropFly-OS-App-Builder/DropFly-PROJECTS/Curriculum-pilot-mvp/src/components/BottomPanel.tsx
Lines: 760 total
Status: FUNCTIONAL except resize
```

#### Props Interface (Lines 64-71)
```typescript
interface BottomPanelProps {
  isVisible: boolean          // Panel visibility
  onToggle: () => void        // Toggle panel function  
  height: number             // Current panel height
  onHeightChange: (height: number) => void  // Height change callback
  pyodide?: any              // Python runtime
  codeContent?: string       // Current code content
}
```

#### Resize Logic (Lines 150-179)
```typescript
const handleMouseDown = (e: React.MouseEvent) => {
  setIsResizing(true)
  const startY = e.clientY
  const startHeight = height
  
  // CRITICAL: Cursor and selection styling
  document.body.style.cursor = 'row-resize'
  document.body.style.userSelect = 'none'

  const handleMouseMove = (e: MouseEvent) => {
    // FIXED: Proper delta calculation for bottom panel
    const deltaY = e.clientY - startY
    const newHeight = startHeight - deltaY
    const clampedHeight = Math.max(100, Math.min(600, newHeight))
    onHeightChange(clampedHeight)  // ← CALLBACK TO PARENT
  }

  const handleMouseUp = () => {
    setIsResizing(false)
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
    // CRITICAL: Reset cursor styling
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}
```

#### Resize Handle UI (Lines 468-476)
```typescript
<div
  ref={resizeRef}
  className="h-2 bg-gray-200 dark:bg-gray-700 cursor-row-resize hover:bg-blue-500 transition-colors relative group"
  onMouseDown={handleMouseDown}
>
  <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 h-0.5 bg-gray-400 dark:bg-gray-500 group-hover:bg-blue-400" />
  <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 mt-1 h-0.5 bg-gray-400 dark:bg-gray-500 group-hover:bg-blue-400" />
</div>
```

## INTERACTION FLOW ANALYSIS

### Normal Resize Flow (Expected)
1. **User Action**: Mouse down on resize handle
2. **Event Trigger**: `handleMouseDown` called with MouseEvent
3. **State Setup**: `setIsResizing(true)`, capture startY and startHeight
4. **Event Listeners**: Add mousemove and mouseup listeners to document
5. **Mouse Movement**: Calculate deltaY, compute newHeight, apply clamping
6. **Parent Update**: Call `onHeightChange(clampedHeight)`
7. **Parent State**: `setTerminalHeight` updates state
8. **Re-render**: Component re-renders with new height
9. **Cleanup**: Remove event listeners, reset cursor on mouseup

### Current Problematic Flow
1. **User Action**: Mouse down on resize handle ✅
2. **Event Trigger**: `handleMouseDown` called ✅
3. **State Setup**: Variables captured ✅
4. **Event Listeners**: Added to document ✅
5. **Mouse Movement**: **UNKNOWN STATUS** - Needs debugging
6. **Parent Update**: **UNKNOWN STATUS** - Callback execution unclear
7. **Parent State**: **UNKNOWN STATUS** - State update unclear
8. **Re-render**: **NOT HAPPENING** - Height remains unchanged

## DEBUGGING PRIORITIES

### High Priority Tests
1. **Verify onHeightChange Callback**
   - Add console.log in handleMouseMove before callback
   - Confirm callback is being called with correct values

2. **Verify Parent State Update**
   - Add console.log in setTerminalHeight function
   - Confirm parent state is actually updating

3. **Verify Re-render Trigger**
   - Check if height prop is changing in BottomPanel
   - Verify style application with new height

### Medium Priority Tests
1. **Event Listener Attachment**
   - Confirm mousemove listener is properly attached
   - Test event propagation and bubbling

2. **Height Calculation Logic**
   - Verify deltaY calculation accuracy
   - Test clamping logic (100-600px range)

## COMPONENT STATE SNAPSHOT

### BottomPanel.tsx State
- **isResizing**: false (when not actively resizing)
- **activeTab**: 'terminal' (default)
- **terminalSessions**: Array with default session
- **height prop**: Received from parent (current: 300)

### AgentAcademyIDE-Enhanced.tsx State  
- **terminalHeight**: 300 (initial value)
- **showTerminal**: true
- **isFullscreen**: false
- **showRightPanel**: true

## POTENTIAL ROOT CAUSES

### Theory 1: Event Listener Issue
- Mouse events not properly captured
- Event propagation blocked by other elements
- Touch device compatibility problems

### Theory 2: Callback Execution Issue
- onHeightChange prop not properly bound
- Parent component not receiving callback
- State update batching problems

### Theory 3: Re-render Issue
- Height state updating but not triggering re-render
- CSS styling not applying new height
- Component memoization preventing updates

### Theory 4: Browser/CSS Issue
- CSS height property not responding to style changes
- Browser-specific mouse event handling
- CSS transform or positioning conflicts

---
**NEXT ACTION**: Add debugging console.log statements to handleMouseMove and verify callback execution.
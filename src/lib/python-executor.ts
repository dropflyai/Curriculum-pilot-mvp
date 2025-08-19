// Client-side Python execution using Pyodide
// This file only runs in the browser to avoid SSR issues

export interface CodeExecutionResult {
  success: boolean
  output: string
  error?: string
  executionTime: number
}

let pyodideInstance: unknown = null
let isLoading = false

// Browser-only Pyodide loader
export async function initializePyodide(): Promise<unknown> {
  // Only run in browser
  if (typeof window === 'undefined') {
    throw new Error('Pyodide can only be loaded in the browser')
  }

  if (pyodideInstance) {
    return pyodideInstance
  }

  if (isLoading) {
    // Wait for existing load
    while (isLoading && !pyodideInstance) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    return pyodideInstance
  }

  isLoading = true
  
  try {
    console.log('🐍 Loading Pyodide...')
    
    // Load Pyodide from CDN (no npm package needed)
    const pyodideScript = document.createElement('script')
    pyodideScript.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js'
    
    await new Promise((resolve, reject) => {
      pyodideScript.onload = resolve
      pyodideScript.onerror = reject
      document.head.appendChild(pyodideScript)
    })

    // @ts-expect-error - Pyodide global will be available after CDN load
    pyodideInstance = await loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/',
    })
    
    console.log('✅ Pyodide loaded successfully')
    return pyodideInstance
  } catch {
    console.error('❌ Failed to load Pyodide:', error)
    throw error
  } finally {
    isLoading = false
  }
}

export async function executeCode(code: string): Promise<CodeExecutionResult> {
  const startTime = Date.now()

  try {
    const pyodideRaw = await initializePyodide()
    const pyodide = pyodideRaw as { runPython: (code: string) => unknown; globals: { get: (key: string) => unknown } }
    
    // Prepare execution environment
    pyodide.runPython(`
import sys
from io import StringIO
import contextlib

# Capture stdout and stderr
_stdout = StringIO()
_stderr = StringIO()
_execution_result = {"success": True, "output": "", "error": ""}
`)

    // Execute user code with output capture
    const executionCode = `
import traceback

try:
    with contextlib.redirect_stdout(_stdout), contextlib.redirect_stderr(_stderr):
        exec("""${code.replace(/"/g, '\\"').replace(/\n/g, '\\n')}""")
    
    _execution_result["output"] = _stdout.getvalue()
    error_output = _stderr.getvalue()
    
    if error_output:
        _execution_result["success"] = False
        _execution_result["error"] = error_output
    else:
        _execution_result["success"] = True
        if not _execution_result["output"]:
            _execution_result["output"] = "Code executed successfully (no output)"
            
except Exception as e:
    _execution_result["success"] = False
    _execution_result["output"] = _stdout.getvalue()
    _execution_result["error"] = f"{type(e).__name__}: {str(e)}\\n\\nFull traceback:\\n{traceback.format_exc()}"
`

    pyodide.runPython(executionCode)
    
    // Get results
    const result = pyodide.globals.get('_execution_result').toJs()
    const executionTime = Date.now() - startTime

    return {
      success: result.success,
      output: result.output || '',
      error: result.error || undefined,
      executionTime
    }

  } catch {
    const executionTime = Date.now() - startTime
    return {
      success: false,
      output: '',
      error: `Python environment error: ${error instanceof Error ? error.message : String(error)}`,
      executionTime
    }
  }
}

export async function runTests(userCode: string, testCode: string): Promise<CodeExecutionResult> {
  const startTime = Date.now()
  
  try {
    // Combine user code with test code
    const fullCode = `
# User code
${userCode}

# Test code
user_code = """${userCode.replace(/"/g, '\\"')}"""
${testCode}
`

    const result = await executeCode(fullCode)
    return {
      ...result,
      executionTime: Date.now() - startTime
    }

  } catch {
    return {
      success: false,
      output: '',
      error: `Test execution error: ${error instanceof Error ? error.message : String(error)}`,
      executionTime: Date.now() - startTime
    }
  }
}

// Basic code validation (runs without Pyodide)
export function validateCode(code: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!code.trim()) {
    errors.push('Code cannot be empty')
    return { isValid: false, errors }
  }

  // Check for potentially dangerous operations
  const dangerousPatterns = [
    { pattern: /import\s+os/, message: 'os module is restricted' },
    { pattern: /import\s+subprocess/, message: 'subprocess module is restricted' },
    { pattern: /eval\s*\(/, message: 'eval() function is restricted' },
    { pattern: /exec\s*\(/, message: 'exec() function is restricted' },
    { pattern: /__import__/, message: '__import__ is restricted' },
    { pattern: /open\s*\(/, message: 'file operations are restricted' }
  ]

  for (const { pattern, message } of dangerousPatterns) {
    if (pattern.test(code)) {
      errors.push(message)
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}
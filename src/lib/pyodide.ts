// Pyodide integration for running Python code in the browser
// Dynamic import to prevent server-side loading issues

let pyodideInstance: any = null
let isLoading = false

export async function getPyodide(): Promise<any> {
  if (typeof window === 'undefined') {
    throw new Error('Pyodide can only be loaded in the browser')
  }

  if (pyodideInstance) {
    return pyodideInstance
  }

  if (isLoading) {
    // Wait for the existing load to complete
    while (isLoading) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    return pyodideInstance!
  }

  isLoading = true
  try {
    console.log('Loading Pyodide...')
    // Dynamic import to avoid server-side issues
    const { loadPyodide } = await import('pyodide')
    pyodideInstance = await loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/',
    })
    console.log('Pyodide loaded successfully')
    return pyodideInstance
  } finally {
    isLoading = false
  }
}

export interface CodeExecutionResult {
  success: boolean
  output: string
  error?: string
  executionTime: number
}

export async function executeCode(code: string): Promise<CodeExecutionResult> {
  const startTime = Date.now()
  
  try {
    const pyodide = await getPyodide()
    
    // Clear any previous output
    pyodide.runPython(`
import sys
from io import StringIO
import contextlib

# Capture stdout
_stdout = StringIO()
_stderr = StringIO()
`)

    // Execute user code with output capture
    const result = pyodide.runPython(`
import sys
from io import StringIO
import contextlib
import traceback

# Capture stdout and stderr
_stdout = StringIO()
_stderr = StringIO()

try:
    with contextlib.redirect_stdout(_stdout), contextlib.redirect_stderr(_stderr):
        exec("""${code.replace(/"/g, '\\"')}""")
    
    output = _stdout.getvalue()
    error = _stderr.getvalue()
    
    if error:
        {"success": False, "output": output, "error": error}
    else:
        {"success": True, "output": output if output else "Code executed successfully (no output)"}
        
except Exception as e:
    error_msg = f"{type(e).__name__}: {str(e)}"
    tb = traceback.format_exc()
    {"success": False, "output": _stdout.getvalue(), "error": f"{error_msg}\\n\\nFull traceback:\\n{tb}"}
`)

    const executionTime = Date.now() - startTime

    // Parse the result from Python
    const resultStr = result.toString()
    if (resultStr.includes('"success": True')) {
      const outputMatch = resultStr.match(/"output": "([^"]*)"/)
      return {
        success: true,
        output: outputMatch ? outputMatch[1].replace(/\\n/g, '\n') : 'Code executed successfully',
        executionTime
      }
    } else {
      const outputMatch = resultStr.match(/"output": "([^"]*)"/)
      const errorMatch = resultStr.match(/"error": "([^"]*)"/)
      return {
        success: false,
        output: outputMatch ? outputMatch[1].replace(/\\n/g, '\n') : '',
        error: errorMatch ? errorMatch[1].replace(/\\n/g, '\n') : 'Unknown execution error',
        executionTime
      }
    }

  } catch (error) {
    const executionTime = Date.now() - startTime
    return {
      success: false,
      output: '',
      error: `Pyodide execution error: ${error instanceof Error ? error.message : String(error)}`,
      executionTime
    }
  }
}

export async function runTests(userCode: string, testCode: string): Promise<CodeExecutionResult> {
  const startTime = Date.now()
  
  try {
    const pyodide = await getPyodide()
    
    // Combine user code with test code
    const fullCode = `
# User code
${userCode}

# Test code
${testCode}
`

    const result = await executeCode(fullCode)
    return {
      ...result,
      executionTime: Date.now() - startTime
    }

  } catch (error) {
    return {
      success: false,
      output: '',
      error: `Test execution error: ${error instanceof Error ? error.message : String(error)}`,
      executionTime: Date.now() - startTime
    }
  }
}

// Simple code validation
export function validateCode(code: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  // Basic syntax checks
  if (!code.trim()) {
    errors.push('Code cannot be empty')
    return { isValid: false, errors }
  }

  // Check for potentially dangerous operations (basic security)
  const dangerousPatterns = [
    /import\s+os/,
    /import\s+subprocess/,
    /import\s+sys/,
    /eval\s*\(/,
    /exec\s*\(/,
    /__import__/,
    /open\s*\(/
  ]

  for (const pattern of dangerousPatterns) {
    if (pattern.test(code)) {
      errors.push(`Potentially unsafe operation detected. Please avoid using: ${pattern.source}`)
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}
import asyncio
import subprocess
import tempfile
import os
import json
import time
import psutil
import signal
from typing import Dict, Any, Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uuid

app = FastAPI(title="Code Runner Service", version="1.0.0")

class ExecutionRequest(BaseModel):
    job_id: str
    code: str
    language: str = "python"
    timeout: int = 30
    memory_limit: int = 256  # MB
    cpu_limit: float = 1.0  # CPU cores

class ExecutionResult(BaseModel):
    passed: bool
    metrics: Optional[Dict[str, Any]] = None
    hints: Optional[list] = None
    logs: Optional[str] = None

class JobStatus(BaseModel):
    job_id: str
    status: str
    result: Optional[ExecutionResult] = None
    error_message: Optional[str] = None

# In-memory job storage (in production, use Redis or database)
jobs: Dict[str, JobStatus] = {}

def get_language_config(language: str) -> Dict[str, str]:
    """Get language-specific execution configuration"""
    configs = {
        "python": {
            "extension": ".py",
            "command": ["python3", "-u"],
            "timeout": 30
        }
    }
    return configs.get(language, configs["python"])

async def execute_code(
    code: str,
    language: str,
    timeout: int,
    memory_limit: int,
    cpu_limit: float
) -> ExecutionResult:
    """Execute user code with security constraints"""
    config = get_language_config(language)
    
    # Create temporary file
    with tempfile.NamedTemporaryFile(
        mode='w',
        suffix=config["extension"],
        delete=False
    ) as f:
        f.write(code)
        temp_file = f.name
    
    try:
        # Prepare execution command
        cmd = config["command"] + [temp_file]
        
        # Start process with resource limits
        process = await asyncio.create_subprocess_exec(
            *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            preexec_fn=os.setsid if os.name != 'nt' else None
        )
        
        # Monitor process with timeout and resource limits
        start_time = time.time()
        stdout_data = b""
        stderr_data = b""
        
        try:
            # Wait for process with timeout
            stdout_data, stderr_data = await asyncio.wait_for(
                process.communicate(),
                timeout=timeout
            )
            
            # Check if process completed successfully
            return_code = process.returncode
            
        except asyncio.TimeoutError:
            # Kill process group on timeout
            if os.name != 'nt':
                os.killpg(os.getpgid(process.pid), signal.SIGKILL)
            else:
                process.kill()
            
            return ExecutionResult(
                passed=False,
                logs=f"Execution timed out after {timeout} seconds",
                hints=["Try optimizing your code for better performance"]
            )
        
        # Calculate execution metrics
        execution_time = time.time() - start_time
        
        # Parse output
        stdout_str = stdout_data.decode('utf-8', errors='replace')
        stderr_str = stderr_data.decode('utf-8', errors='replace')
        
        # Combine logs
        logs = f"STDOUT:\n{stdout_str}\n\nSTDERR:\n{stderr_str}" if stderr_str else stdout_str
        
        # Determine if execution passed
        passed = return_code == 0
        
        # Generate hints based on common issues
        hints = []
        if not passed:
            if "SyntaxError" in stderr_str:
                hints.append("Check your syntax - there might be a syntax error in your code")
            elif "NameError" in stderr_str:
                hints.append("Make sure all variables are defined before use")
            elif "IndentationError" in stderr_str:
                hints.append("Check your indentation - Python is sensitive to whitespace")
            elif "ModuleNotFoundError" in stderr_str:
                hints.append("Make sure you're using only standard library modules")
            else:
                hints.append("Check your code logic and error messages for clues")
        
        # Create metrics
        metrics = {
            "execution_time": execution_time,
            "return_code": return_code,
            "memory_used": 0,  # Would need more complex monitoring
            "cpu_used": 0      # Would need more complex monitoring
        }
        
        return ExecutionResult(
            passed=passed,
            metrics=metrics,
            hints=hints if hints else None,
            logs=logs
        )
        
    except Exception as e:
        return ExecutionResult(
            passed=False,
            logs=f"Execution failed: {str(e)}",
            hints=["There was an error executing your code. Please check the syntax and try again."]
        )
    
    finally:
        # Clean up temporary file
        try:
            os.unlink(temp_file)
        except OSError:
            pass

@app.post("/execute")
async def execute_code_endpoint(request: ExecutionRequest):
    """Execute user code with security constraints"""
    job_id = request.job_id
    
    # Initialize job status
    jobs[job_id] = JobStatus(
        job_id=job_id,
        status="running"
    )
    
    try:
        # Execute code
        result = await execute_code(
            code=request.code,
            language=request.language,
            timeout=request.timeout,
            memory_limit=request.memory_limit,
            cpu_limit=request.cpu_limit
        )
        
        # Update job status
        jobs[job_id].status = "completed"
        jobs[job_id].result = result
        
        return {
            "job_id": job_id,
            "status": "completed",
            "result": result.dict()
        }
        
    except Exception as e:
        # Update job status with error
        jobs[job_id].status = "failed"
        jobs[job_id].error_message = str(e)
        
        return {
            "job_id": job_id,
            "status": "failed",
            "error_message": str(e)
        }

@app.get("/jobs/{job_id}")
async def get_job_status(job_id: str):
    """Get job status and result"""
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job = jobs[job_id]
    return {
        "job_id": job.job_id,
        "status": job.status,
        "result": job.result.dict() if job.result else None,
        "error_message": job.error_message
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "code-runner"}

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Code Runner Service", "version": "1.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
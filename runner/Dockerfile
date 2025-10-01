FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY runner.py .

# Create non-root user
RUN useradd --create-home --shell /bin/bash runner && chown -R runner:runner /app
USER runner

# Expose port
EXPOSE 8000

# Run the application
CMD ["python", "runner.py"]
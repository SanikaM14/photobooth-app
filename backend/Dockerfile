FROM python:3.10-slim

WORKDIR /app

# Copy requirements first for better cache utilization
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code into a 'backend' directory to match Python imports (from backend.config import ...)
COPY . ./backend/

# Set Python path so it can find the backend module
ENV PYTHONPATH=/app

# Expose the API port
EXPOSE 8080

# Command to run the application using the module path
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8080"]

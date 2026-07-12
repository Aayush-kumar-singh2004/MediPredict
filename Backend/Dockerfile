# Use official Node.js image
FROM node:20

# Install Python and pip
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python-is-python3 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Node packages
RUN npm install

# Copy Python requirements
COPY requirements.txt ./

# Install Python packages
RUN python3 -m pip install --no-cache-dir --break-system-packages -r requirements.txt

# Copy backend source
COPY . .

# Render provides PORT
EXPOSE 8000

CMD ["npm", "start"]
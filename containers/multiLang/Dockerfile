# using a base image with a linux distro
FROM ubuntu:22.04

# setting safe defaults 
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1

# creating a dedicated execution space
WORKDIR /exec

# installing system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    python3-dev \
    gcc \
    g++ \
    make \
    openjdk-17-jdk \
    # nodejs \
    # npm \
    sqlite3 \
    curl \
    ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# installing nodejs via official source
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get update && apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# installing python data science packages
RUN pip install --no-cache-dir \
    numpy \
    pandas \
    matplotlib 

# adding a non-root user
RUN useradd -m executor && \
    chown -R executor:executor /exec
USER executor

# default command (idle container)
CMD ["tail", "-f", "/dev/null"]

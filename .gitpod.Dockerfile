FROM gitpod/workspace-base

# Environment variables
ENV PYENV_ROOT="/home/gitpod/.pyenv"
ENV PATH="$PYENV_ROOT/bin:$PATH:$PYENV_ROOT/shims"
ENV NODE_VERSION=22.13.0
ENV NVM_DIR="/home/gitpod/.nvm"
ENV PATH="$NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH"
ENV PGDATA="/workspace/.pgsql/data"
ENV PYTHON_VERSION=3.12.8

# Update and install common dependencies and essential development tools
RUN sudo apt-get update && sudo apt-get upgrade -y && \
    sudo apt-get install -y --no-install-recommends \
    curl wget gnupg software-properties-common \
    build-essential libssl-dev libffi-dev zlib1g-dev graphviz && \
    sudo apt-get clean && sudo rm -rf /var/lib/apt/lists/*

# Node.js setup
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash && \
    . "$NVM_DIR/nvm.sh" && \
    nvm install $NODE_VERSION && \
    nvm use $NODE_VERSION && \
    npm install -g npm@latest pnpm@latest typescript yarn node-gyp && \
    echo "source $NVM_DIR/nvm.sh" >> /home/gitpod/.bashrc

# Python setup
RUN curl -fsSL https://pyenv.run | bash && \
    echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.bashrc && \
    echo 'export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.bashrc && \
    echo 'eval "$(pyenv init --path)"' >> ~/.bashrc && \
    echo 'eval "$(pyenv virtualenv-init -)"' >> ~/.bashrc && \
    pyenv install $PYTHON_VERSION && \
    pyenv global $PYTHON_VERSION && \
    pip install --no-cache-dir pip && \
    pip install --no-cache-dir --upgrade pip setuptools wheel && \
    pip install --no-cache-dir bandit coverage djlint ipython isort idna mypy pylint pyparsing pydot pip-review pytest pytest-django requests ruff watchdog && \
    sudo rm -rf /tmp/*

ENV PYTHONUSERBASE=/workspace/.pip-modules \
    PIP_USER=yes
ENV PATH=$PYTHONUSERBASE/bin:$PATH

# Install AWS CLI
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
    unzip awscliv2.zip && \
    sudo ./aws/install && \
    rm -rf awscliv2.zip aws && \
    sudo apt-get clean && sudo rm -rf /var/lib/apt/lists/*

# MongoDB setup
RUN sudo curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg && \
    echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list && \
    sudo apt-get update && sudo apt-get install -y mongodb-mongosh && \
    sudo apt-get clean && sudo rm -rf /var/lib/apt/lists/*

# PostgreSQL setup
RUN sudo curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo gpg --dearmor -o /usr/share/keyrings/postgresql.gpg && \
    echo "deb [signed-by=/usr/share/keyrings/postgresql.gpg] http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" | sudo tee /etc/apt/sources.list.d/pgdg.list && \
    sudo apt-get update && sudo apt-get install -y postgresql-16 && \
    sudo apt-get clean && sudo rm -rf /var/lib/apt/lists/*

# PostgreSQL configuration
RUN mkdir -p ~/.pg_ctl/bin ~/.pg_ctl/sockets && \
    echo '#!/bin/bash\n[ ! -d $PGDATA ] && mkdir -p $PGDATA && initdb --auth=trust -D $PGDATA\npg_ctl -D $PGDATA -l ~/.pg_ctl/log -o "-k ~/.pg_ctl/sockets" start' > ~/.pg_ctl/bin/pg_start && \
    echo '#!/bin/bash\npg_ctl -D $PGDATA -l ~/.pg_ctl/log -o "-k ~/.pg_ctl/sockets" stop' > ~/.pg_ctl/bin/pg_stop && \
    chmod +x ~/.pg_ctl/bin/*

# Install Heroku CLI
RUN curl https://cli-assets.heroku.com/install.sh | sh

# Set up aliases for Python and pip
RUN echo 'alias pip3="$PYENV_ROOT/versions/$PYTHON_VERSION/bin/pip"' >> ~/.bashrc && \
    echo 'alias pip="$PYENV_ROOT/versions/$PYTHON_VERSION/bin/pip"' >> ~/.bashrc && \
    echo 'alias python3="$PYENV_ROOT/versions/$PYTHON_VERSION/bin/python"' >> ~/.bashrc && \
    echo 'alias python="$PYENV_ROOT/versions/$PYTHON_VERSION/bin/python"' >> ~/.bashrc

# Allow React and Django REST Framework to run together on Gitpod
ENV DANGEROUSLY_DISABLE_HOST_CHECK=true

# Final cleanup
RUN sudo apt-get autoremove -y && sudo apt-get clean -y

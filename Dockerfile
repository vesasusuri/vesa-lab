FROM php:8.4-cli

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    curl \
    libxml2-dev \
    libzip-dev \
    libonig-dev \
    libicu-dev \
    tesseract-ocr \
    poppler-utils \
    nginx \
    && docker-php-ext-install pdo_mysql mbstring xml zip bcmath intl fileinfo opcache \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY . .

RUN composer install --no-dev --optimize-autoloader \
    && npm ci \
    && npm run build \
    && npm prune --omit=dev \
    && chmod -R ug+rwx storage bootstrap/cache

CMD ["bash", "scripts/railway-start.sh"]

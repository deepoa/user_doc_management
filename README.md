README
Local Development Install dependencies: npm install

Start PostgreSQL database (using Docker): docker-compose up -d db

Run migrations: npm run typeorm migration:run

Start the application: npm run start:dev

Production Deployment Build the Docker image: docker-compose build

Start all services: docker-compose up -d

The API will be available at http://localhost:3000

API Documentation After starting the application, Swagger documentation will be available at: http://localhost:3000/api

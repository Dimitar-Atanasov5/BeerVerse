# BeerVerse
This is an Express-based web app built for testing and demonstrating basic user authentication and route handling. This is an up to date project. At this point we have unit tests. Coming up integration tests and API tests with Postman. System testing will be conducted using JMeter, followed by end-to-end (E2E) testing with Selenium. The application will include user registration and login forms, allowing users to authenticate and manage sessions securely. Additionally, new sections will be added for managing beer entries — including creating, viewing, and possibly editing or deleting beer-related data. In the future, a front-end interface will be developed to interact with the API. This frontend will be tested using Playwright to ensure consistent behavior across browsers and complete end-to-end test coverage. 

# Technologies
Node.js
Express.js
MongoDB & Mongoose
dotenv (for environment variables)
Jest (for unit testing)
Postman
JMeter (for system testing)
Selenium (for E2E testing)
Playwright *(planned for frontend testing)*

Installation

Clone the repository:

```bash
git clone https://github.com/Dimitar-Atanasov5/project-for-testing.git
cd project-for-testing

Create a `.env` file in the root folder with the following variables:

env
PORT=3000
DB_URI=mongodb://localhost:27017/your-db  
JWT_SECRET=Secretkey223 

env.test
NODE_ENV=test
JWT_SECRET=testSecret123


# Testing plan
- ✅ Unit tests: Jest
- 🧩 Integration tests: Coming up with Supertest
- 🔌 API tests: Planned with Postman
- 🖥️ System testing/performance/: Planned with JMeter
- 🎯 E2E testing:
- Selenium (planned)
- Playwright (planned)
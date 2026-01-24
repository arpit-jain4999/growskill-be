<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

NestJS backend application with JWT authentication, MongoDB database, and Fastify server.

## Features

- JWT-based authentication
- Mobile number and OTP-based authentication
- User sign up and login endpoints
- MongoDB database with Mongoose
- Fastify HTTP server
- OTP generation and verification
- Input validation with class-validator

## Installation

```bash
$ npm install
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
MONGODB_URI=mongodb://localhost:27017/skillgroww
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
PORT=3000
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## API Endpoints

### Authentication

#### Unified OTP Flow

1. `POST /auth/request-otp` - Request OTP (works for both new and existing users)
   - Body: 
     ```json
     {
       "countryCode": "+91",
       "phoneNumber": "1234567890"
     }
     ```
   - Success Response: 
     ```json
     {
       "success": true,
       "data": {
         "isNewUser": false
       }
     }
     ```
   - Error Response:
     ```json
     {
       "success": false,
       "error": {
         "message": "Error message",
         "statusCode": 400
       }
     }
     ```

2. `POST /auth/verify-otp` - Verify OTP and authenticate (works for both sign up and login)
   - Body: 
     ```json
     {
       "countryCode": "+91",
       "phoneNumber": "1234567890",
       "otp": "123456",
       "name": "User Name" // Optional, only for new users
     }
     ```
   - Success Response:
     ```json
     {
       "success": true,
       "data": {
         "token": {
           "accessToken": "jwt-access-token",
           "refreshToken": "jwt-refresh-token",
           "expiresAt": "2024-01-30T12:00:00.000Z"
         },
         "user": {
           "id": "user-id",
           "countryCode": "+91",
           "phoneNumber": "1234567890",
           "name": "User Name",
           "isVerified": true
         }
       }
     }
     ```
   - Error Response:
     ```json
     {
       "success": false,
       "error": {
         "message": "Invalid or expired OTP",
         "statusCode": 401
       }
     }
     ```

#### Protected Routes

- `GET /auth/profile` - Get user profile (protected route)
  - Headers: `Authorization: Bearer <accessToken>`
  - Response:
    ```json
    {
      "success": true,
      "data": {
        "user": {
          "userId": "user-id",
          "countryCode": "+91",
          "phoneNumber": "1234567890"
        }
      }
    }
    ```

**Note:** 
- OTP codes are valid for 10 minutes
- In development, OTPs are logged to the console
- In production, integrate with an SMS service provider
- The API automatically detects if a user is new or existing
- New users can optionally provide a name during OTP verification

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

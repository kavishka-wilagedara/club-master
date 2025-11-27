
# Club Master

## Overview
Club Master is a powerful club management application designed to streamline club administration, member management, and role-based access control. This system ensures efficient governance by enabling different user roles to interact seamlessly.

## Features
- **Role-based Access Control**: Three distinct user roles - Main Admins, Club Admins, and Normal Members.
- **Authentication & Security**: Secure login and authentication with JWT.
- **User & Club Management**: Create, update, and manage clubs and their members.
- **RESTful API**: Well-defined API endpoints for smooth integration.
- **Database Management**: Uses MongoDB for efficient data handling.
- **Modern UI**: Responsive frontend built with React.

## Tech Stack
- **Backend**: Spring Boot
- **Frontend**: React
- **Database**: MongoDB
- **Security**: JWT, Spring Security
- **Tools**: Docker (optional), Postman (for API testing)

## Installation Guide
### Prerequisites
Ensure you have the following installed:
- Java 17+
- MongoDB
- Maven

### Project Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/kavishka-wilagedara/club-master.git
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```sh
   cd club-master/club-master-frontend
   ```
2. Install npm
   ```sh
   npm install
   ```
3. Build and run the frontend:
   ```sh
   npm run dev
   ``` 

### Backend Setup
1. Navigate to the backend directory:
   ```sh
   cd club-master/club-master-backend
   ```
2. Configure `application.properties` or `application.yml` with your MongoDB credentials.
3. Build and run the backend:
   ```sh
   mvn spring-boot:run
   ```
   
## Contact
For any inquiries or issues, reach out:
- Email: kavishkamadumal890.com
- GitHub: [kavishka-wilagedara](https://github.com/kavishka-wilagedara)

---
Enjoy managing your clubs efficiently with Club Master! 🚀



-----

# Taar - Social Media Platform

**Taar** is a modern, full-stack social media application designed to connect people seamlessly. The project focuses on real-time interactions, media sharing, and a clean user experience.

> **⚠️ Project Status: Under Development** \> This project is currently in the active development phase. Features are being added, and the documentation will be updated as we progress toward a stable release.

-----

## Overview

Taar (meaning 'wire' or 'connection') aims to bridge the gap between users with a fast and intuitive interface. Built using the MERN stack, it handles everything from user authentication to complex social interactions like posting, liking, and following.

## Planned & Current Features

  * **User Authentication:** Secure registration and login using Resend.
  * **Media Sharing:** Support for image and video uploads via Cloudinary.
  * **Real-time Interactions:** Instant updates for social actions (in progress).
  * **Profile Management:** Customizable user profiles and bio (in progress).
  * **Responsive Design:** Optimized for both mobile and desktop screens (in progress).

## Technical Architecture

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB |
| **Storage** | Cloudinary (for media) |
| **Auth** | JWT / OTP Verification |

## Project Interface (WIP)

### Authentication Flow

### Main Feed

-----

## Installation (Local Setup)

*Note: Since the project is under development, ensure you have all environment variables configured.*

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/dhruvkhanna78/Taar.git
    cd Taar
    ```

2.  **Install Dependencies:**

    ```bash
    # Root / Backend
    npm install

    # Frontend
    cd client && npm install
    ```

3.  **Configure Environment:**
    Create a `.env` file in the root directory and add:

    ```env
    MONGO_URI=your_mongodb_uri
    JWT_SECRET=your_secret
    CLOUDINARY_CLOUD_NAME=your_name
    ```

4.  **Run Development Server:**

    ```bash
    npm run dev
    ```

## Roadmap

  - [x] Initial Backend Setup
  - [x] Basic UI Framework
  - [x] OTP Verification Integration
  - [ ] Real-time Chat Functionality
  - [ ] Deployment to Production

## License

Distributed under the MIT License.

## Contact

**Dhruv Khanna** - [GitHub Profile](https://www.google.com/search?q=https://github.com/dhruvkhanna78)  
Project Link: [https://github.com/dhruvkhanna78/Taar](https://github.com/dhruvkhanna78/Taar)

-----

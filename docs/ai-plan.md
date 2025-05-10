## Project Plan: Full-Stack Event Booking System

**Deadline:** May 17, 2025, 11:59 PM

### 1. Overview & Objectives

- **Goal:** Build a web-based event booking platform with user-facing pages, authentication, booking workflows, and an admin panel for CRUD operations.
- **AI Integration:** Leverage AI tools (ChatGPT, GitHub Copilot) for architecture design, coding assistance, debugging, and documentation.

### 2. Tech Stack Selection (by May 11)

- **Frontend:** React.js (Vite), Tailwind CSS
- **Backend:** Node.js + Express (or NestJS) with REST API
- **Database:** PostgreSQL (hosted on Heroku/Render)
- **Auth:** JWT with bcrypt
- **DevOps:** GitHub actions for CI, deployment on Vercel (frontend) & Heroku/Render (backend)

### 3. Phase Breakdown & Timeline

| **Phase**                         | **Date**       | **Deliverables**                                                                                                                             | **AI Usage**                                                                                      |
| --------------------------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **1. Project Setup**              | May 11 (Day 1) | - Repo initialization (frontend & backend) <br> - Basic README templates                                                                     | - Use Copilot for repo README generation <br> - ChatGPT to draft folder structure                 |
| **2. Authentication**             | May 12 (Day 2) | - User registration & login endpoints <br> - JWT integration <br> - Frontend auth forms                                                      | - ChatGPT to scaffold auth API <br> - Copilot for form validation code                            |
| **3. Home & Listings**            | May 13 (Day 3) | - Event listing page UI <br> - “Book Now” / “Booked” states                                                                                  | - AI-assisted UI component generation <br> - Copilot for conditional rendering                    |
| **4. Event Details & Booking**    | May 14 (Day 4) | - Event details page <br> - Booking API & frontend action <br> - Redirect to Congrats screen                                                 | - ChatGPT to generate booking flow logic <br> - Copilot for styling congrats page                 |
| **5. Admin Panel**                | May 15 (Day 5) | - Admin login & role-based routes <br> - CRUD screens for events                                                                             | - ChatGPT to outline RBAC implementation <br> - Copilot for CRUD forms                            |
| **6. Enhancements & Testing**     | May 16 (Day 6) | - Optional: pagination, image upload, tags & categories, role-based permissions, responsive design, dark mode <br> - Unit tests (Jest + RTL) | - AI-assisted enhancement suggestions <br> - Copilot for implementing optional features and tests |
| **7. Deployment & Documentation** | May 17 (Day 7) | - Deploy frontend & backend <br> - Final README <br> - Submit survey link                                                                    | - ChatGPT to draft final README sections <br> - Copilot for CI/CD config                          |

### 4. Milestones & Checkpoints Milestones & Checkpoints Milestones & Checkpoints

- **End of Day 1:** Repo & structure in place
- **End of Day 3:** Core user flows complete (auth + booking)
- **End of Day 5:** Admin panel functional
- **End of Day 7:** Fully deployed, tested, and documented

### 5. AI Tool Integration Strategy

- **Architecture & Design:** Use ChatGPT to outline ER diagrams and folder structures.
- **Code Generation:** Use GitHub Copilot for boilerplate and repetitive code.
- **Debugging:** Query ChatGPT for error fixes and optimization.
- **Documentation:** Draft comments, READMEs, and survey answers with ChatGPT.

### 6. Version Control & Collaboration

- **Branches:** feature/auth, feature/listings, feature/booking, feature/admin, feature/tests
- **Pull Requests:** Peer review aided by AI-generated PR templates.

### 7. Risk Management

- **Tight Timeline:** Prioritize MVP first; enhancements are optional if falling behind.
- **AI Reliability:** Validate all AI-generated code; run local tests after each merge.

### 8. Submission Rules & Guidelines

- **Tech Stack Flexibility:** Any tech stack; REST or GraphQL APIs allowed.
- **Version Control:** Use Git with a public GitHub repository containing the complete project.
- **Documentation:** Include README files for both frontend and backend with clear setup instructions.
- **Survey Submission:** Ensure SurveyMonkey link is completed; submissions outside the survey won’t be accepted.
- **Email Monitoring:** Check spam/promotions for the survey email.

> _All requirements and optional features from the brief have now been incorporated._

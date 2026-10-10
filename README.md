# PathForge AI

**Your Dream Career. Reverse-Engineered.**

## What it does
PathForge AI is an intelligent career-planning platform that transforms a student's specific career ambition into a personalized, interactive, adaptive roadmap. It addresses Problem Statement 1: Reverse-Engineered Career Roadmapper by generating structured milestones, required skills, practical projects, and learning resources using real AI models.

## Architecture and why
- **Frontend**: React with TypeScript, Vite, Tailwind CSS, and React Flow. We used React Flow because generating a zoomable, pannable graph is the most intuitive way to show complex prerequisite relationships.
- **Backend**: Java 17 and Spring Boot 3.4.1. Provides robust validation, dependency injection, and JPA-based persistence.
- **Database**: H2 (in-memory) for easy local setup and development, configurable to MySQL for production.
- **AI Integration**: Communicates dynamically with OpenAI-compatible chat completions APIs, ensuring roadmaps are generated on the fly rather than using hardcoded templates.

## Done / Left / Plan

**Done:**
- [x] Functional React frontend with Vite & Tailwind.
- [x] Spring Boot backend with H2/MySQL support.
- [x] Genuine AI-generated career roadmaps via backend integration.
- [x] Interactive zoomable, pannable graph (React Flow).
- [x] Detailed milestone inspector panel.
- [x] Persisted milestone statuses (Available, Known, Completed, etc.).
- [x] Graceful AI error handling (preserves data if AI fails).

**Left / Plan:**
- [ ] Weekly learning planner distribution.
- [ ] Milestone-specific interview question generation.
- [ ] PDF & JSON Roadmap Exports.
- [ ] Project Studio dashboard.

## What we added
- **Adaptive Progress**: When you mark a node as "Completed" or "Known", the frontend sends status updates that instantly unlock dependencies.
- **Interactive Visualizer**: Instead of a boring checklist, you get an expansive, node-based skill tree to explore your career journey.

## How to run it

### Prerequisites
- Node.js (v18+)
- Java 17+
- Maven or use the provided `mvnw` wrapper

### Environment Variables
Create a `.env` in the backend directory (or configure your shell) if you want to use a real AI model:
\`\`\`env
AI_API_KEY=your_openai_api_key
AI_API_URL=https://api.openai.com/v1/chat/completions
AI_MODEL=gpt-4o-mini
\`\`\`
*(If `AI_API_KEY` is omitted or set to `mock`, the backend will generate a mocked response for demoing without an API key).*

### Running the Backend
1. \`cd backend\`
2. \`./mvnw spring-boot:run\`
   *(The backend runs on http://localhost:8080)*

### Running the Frontend
1. \`cd frontend\`
2. \`npm install\`
3. \`npm run dev\`
   *(The frontend runs on http://localhost:5173)*

## Tools and AI used
- React, TailwindCSS, React Flow for the visual layer.
- Spring Boot, Spring Data JPA, H2/MySQL for the backend API.
- OpenAI-compatible API for generating adaptive learning milestones.

## Who it is for
PathForge AI is for college students, freshers, and professionals looking to transition into a new domain but who are unsure of the precise, actionable steps they need to take.

---
### 3-Minute Demo Script
1. **Goal Input**: Go to "Build My Career Roadmap", type "Backend Engineer at Fintech", select 10 hours/week, and hit Generate.
2. **Graph Interaction**: Pan around the node graph and explain how prerequisites link foundational skills to advanced ones.
3. **Milestone Inspection**: Click the "Java Basics" node to reveal estimated effort, learning goals, and actions in the side panel.
4. **Adaptive Updates**: Mark "Java Basics" as "I Already Know This" or "Completed", and watch as dependent milestones become "Available".

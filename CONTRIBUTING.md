# Contributing

Thanks for taking the time to contribute! Follow these steps to get a development environment running:

1. **Fork & Clone**
   - Fork the repository on GitHub and clone your fork locally.

2. **Set Up Environment**
   - Copy `.env.example` files to `.env` in both `backend/` and `frontend/` and adjust values as needed.
   - Install dependencies:
     ```bash
     python3 -m venv .venv && source .venv/bin/activate
     pip install -r backend/requirements.txt
     cd frontend && npm install
     ```
   - Start supporting services (Postgres/Redis) locally or with Docker.

3. **Run the App**
   - Backend: `cd backend && uvicorn app.main:app --reload --port 8002`
   - Frontend: `cd frontend && npm run dev`

4. **Testing**
   - Backend tests: `cd backend && pytest`
   - Frontend lint/type-check: `cd frontend && npm run lint && npm run type-check`

5. **Create a Branch**
   - Use descriptive names like `feature/add-auth` or `fix/typo`.

6. **Submit a Pull Request**
   - Push your branch to your fork and open a PR against `main`.
   - Include a summary, testing notes, and screenshots if UI changes are involved.

Before opening a PR, ensure `git status` is clean and all automated checks pass. Thanks again for contributing!

# FlexGCC Work Request Tracker

## Run
1. Start the ASP.NET Core API.
2. Run `npm install`.
3. Copy `.env.example` to `.env` if you need to change the API URL.
4. Run `npm run dev` and open the Vite URL.

## API endpoints expected
- `GET /api/work-requests`
- `POST /api/work-requests`
- `PATCH /api/work-requests/{id}/status` with `{ "status": "InProgress" }`
- `GET /api/work-requests/{id}/notes`
- `POST /api/work-requests/{id}/notes` with `{ "note": "..." }`

The edit button is currently an explanatory placeholder because the backend built so far does not expose a full request-update endpoint. Add a PUT/PATCH endpoint before enabling editing.

Configure CORS in ASP.NET Core to allow `http://localhost:5173`. Never commit database passwords or secrets.

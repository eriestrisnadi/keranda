## Holahalo Catalog

### Requirements
- PHP 7.1.2^
- Composer latest
- Node & npm latest

### How to install
1. Clone this repo.
2. Go to project directory & Install dependencies via terminal `cd keranda && composer install && npm install`.
3. Setup project config via terminal `cp .env.example .env && php artisan key:generate && npm run dev`.
4. Setup database on `.env` using an editor & run this command via terminal `php artisan migrate && php artisan db:seed`.
5. Run to serve the project via terminal `php artisan serve`.
6. Congrats, visit `http://localhost:8000/` on browser.

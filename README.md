# Cagey - Nicolas Cage Movie Explorer

A web application for exploring and ranking Nicolas Cage movies, with a Python scraper for collecting movie data and a Next.js web interface for browsing and filtering the movies.

## Project Structure

- `/python-app` - Python scraper for collecting Nicolas Cage movie data
- `/` - Next.js web application for browsing and filtering movies

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Python 3.8+ with pip

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/cagey.git
cd cagey
```

2. Install JavaScript dependencies:
```bash
pnpm install
```

3. Install Python dependencies:
```bash
cd python-app
pip install -r requirements.txt
cd ..
```

### Running the Application

#### Scraping Movie Data

To scrape the latest Nicolas Cage movie data:

```bash
pnpm run scrape
```

This will create or update the `python-app/cage_movies.json` file.

#### Converting Data for the Web UI

After scraping, convert the JSON data to TypeScript:

```bash
pnpm run convert
```

#### Running the Web UI

Start the development server:

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Features

- **Python Scraper**: Collects Nicolas Cage movie data including titles, years, descriptions, and rankings
- **Web UI**: 
  - Browse all Nicolas Cage movies
  - Filter movies by tier
  - Search movies by title or description
  - View detailed information about each movie
  - Add movies to your watchlist

## Technologies Used

- **Backend**: Python with BeautifulSoup for web scraping
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, shadcn/ui components
- **State Management**: React hooks and localStorage for watchlist functionality

## License

This project is licensed under the MIT License - see the LICENSE file for details.

# Nicolas Cage Movie Scraper

This script scrapes Nicolas Cage movie rankings from [Richard Ranks' blog post](https://www.richardranks.com/2024/07/unlocking-cage-nicolas-cage-films-ranked.html?m=1) and saves the data as a JSON file.

## Requirements

- Python 3.6+
- Required packages: requests, beautifulsoup4

## Installation

1. Clone this repository or download the script files.
2. Install the required packages:

```bash
pip install -r requirements.txt
```

## Usage

### Basic Usage

Run the main script with:

```bash
python scrape_cage_movies.py
```

The script will:
1. Scrape the website for Nicolas Cage movie rankings
2. Extract the following information for each movie:
   - Ranking
   - Tier (if available)
   - Movie title
   - Movie year
   - Movie description
3. Save the data to a file named `cage_movies.json` in the current directory

### Test Script

You can also run the test script to see a summary of the scraped data:

```bash
python test_scraper.py
```

This will:
1. Run the scraper
2. Save the results to `cage_movies.json`
3. Display statistics about the scraped data, including:
   - Total number of movies found
   - Number of movies in each tier
   - Details of the top 5 and bottom 5 movies

### View Results

To view the scraped data in a more readable format, run:

```bash
python view_results.py
```

This interactive script will:
1. Display all movies grouped by tier
2. Allow you to enter a ranking number to see detailed information about a specific movie
3. Continue until you choose to quit (by entering 'q')

You can also specify a different JSON file to view:

```bash
python view_results.py path/to/your/file.json
```

## Output Format

The output JSON file contains an array of movie objects, each with the following structure:

```json
{
    "ranking": 1,
    "tier": "S",
    "title": "Movie Title",
    "year": 2000,
    "description": "Description of the movie..."
}
```

## Troubleshooting

If the script fails to scrape the data, it could be due to:
- Website structure changes
- Network connectivity issues
- Website blocking the scraper

In such cases, check your internet connection and verify that the website structure hasn't changed.

## Notes

- The script is designed to handle the specific structure of the blog post as of July 2024.
- If the blog post is updated or the structure changes, the script may need to be modified.
- The script respects website resources by not making excessive requests. 
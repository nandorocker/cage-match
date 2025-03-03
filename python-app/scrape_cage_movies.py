import requests
from bs4 import BeautifulSoup
import json
import re
import time

def scrape_cage_movies():
    url = "https://www.richardranks.com/2024/07/unlocking-cage-nicolas-cage-films-ranked.html?m=1"
    
    # Add a user agent to avoid being blocked
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    
    try:
        # Get the webpage content
        print(f"Fetching content from {url}...")
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Raise an exception for HTTP errors
        
        # Parse the HTML content
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Find all movie entries
        movie_entries = []
        
        # Look for movie entries in the blog post content
        content = soup.find('div', class_='post-body')
        if not content:
            print("Could not find the main content section.")
            return []
        
        # First, try to identify tier sections
        current_tier = None
        all_elements = content.find_all(['h1', 'h2', 'h3', 'h4', 'p'])
        
        # Map tier numbers to tier names based on the blog post
        tier_mapping = {
            6: "For Cage Completionists Only",
            5: "Decent Cage Movies",
            4: "Good Cage Movies",
            3: "Great Cage Movies",
            2: "Excellent Cage Movies",
            1: "The 25 Most Essential Cage Movies"
        }
        
        # Find all headings which likely contain the movie titles and rankings
        for i, element in enumerate(all_elements):
            # Check if this is a tier heading
            if element.name in ['h1', 'h2', 'h3'] and not element.name == 'p':
                text = element.get_text().strip()
                
                # Check for tier headings in the format "Tier X: Description"
                tier_match = re.search(r'Tier\s+(\d+):', text, re.IGNORECASE)
                if tier_match:
                    current_tier = int(tier_match.group(1))
                    continue
                
                # Also check for tier descriptions
                for tier_num, tier_desc in tier_mapping.items():
                    if tier_desc.lower() in text.lower():
                        current_tier = tier_num
                        break
            
            # Check if this is a movie entry
            if element.name in ['h3', 'h4'] or (element.name == 'p' and re.search(r'^\d+[\.:]', element.get_text().strip())):
                text = element.get_text().strip()
                rank_match = re.search(r'^(\d+)[\.:]', text)
                
                if not rank_match:
                    continue
                    
                ranking = int(rank_match.group(1))
                
                # Determine tier based on ranking
                # According to the blog post:
                # Tier 1: Top 25 movies (ranks 1-25)
                # Tier 2: Excellent movies (ranks 26-?)
                # Tier 3: Great movies
                # Tier 4: Good movies
                # Tier 5: Decent movies
                # Tier 6: For completionists only (lowest ranks)
                
                # Use the current_tier if available, otherwise infer from ranking
                tier = current_tier
                
                # If tier is still None, infer from ranking
                if tier is None:
                    if 1 <= ranking <= 25:
                        tier = 1
                    elif 26 <= ranking <= 40:
                        tier = 2
                    elif 41 <= ranking <= 60:
                        tier = 3
                    elif 61 <= ranking <= 80:
                        tier = 4
                    elif 81 <= ranking <= 90:
                        tier = 5
                    else:
                        tier = 6
                
                # Extract movie title and year
                # First try the pattern with year in parentheses
                title_year_match = re.search(r'[\.:]?\s*(.*?)\s*\((\d{4})\)', text)
                if title_year_match:
                    title = title_year_match.group(1).strip()
                    year = int(title_year_match.group(2))
                else:
                    # If year is not in parentheses, try to extract just the title
                    # Remove the ranking number and any tier information
                    clean_text = re.sub(r'^\d+[\.:]', '', text)
                    clean_text = re.sub(r'\b(S|A|B|C|D|F)\s*Tier\b', '', clean_text, flags=re.IGNORECASE)
                    
                    # Try to find the year
                    year_match = re.search(r'\b(19\d{2}|20\d{2})\b', clean_text)
                    year = int(year_match.group(1)) if year_match else None
                    
                    # Remove the year if found
                    if year_match:
                        clean_text = clean_text.replace(year_match.group(0), '')
                    
                    title = clean_text.strip()
                    # Clean up any remaining punctuation or extra spaces
                    title = re.sub(r'\s+', ' ', title)
                    title = re.sub(r'[:\-–—]?\s*$', '', title)
                    title = title.strip()
                
                # Get the description (paragraphs following the heading until the next heading or movie entry)
                description = ""
                j = i + 1
                while j < len(all_elements):
                    next_elem = all_elements[j]
                    # Stop if we hit another heading or movie entry
                    if (next_elem.name in ['h1', 'h2', 'h3', 'h4'] or 
                        (next_elem.name == 'p' and re.search(r'^\d+[\.:]', next_elem.get_text().strip()))):
                        break
                    
                    if next_elem.name == 'p':
                        paragraph_text = next_elem.get_text().strip()
                        if paragraph_text:
                            description += paragraph_text + " "
                    j += 1
                
                description = description.strip()
                
                # If year is still None, try to extract it from the description
                if year is None:
                    # Look for year patterns in the description
                    year_patterns = [
                        r'released in (\d{4})',
                        r'came out in (\d{4})',
                        r'from (\d{4})',
                        r'made in (\d{4})',
                        r'the (\d{4}) film',
                        r'in (\d{4}),',
                        r'Year:\s*(\d{4})',
                        r'Director:\s*.*?\s*\((\d{4})\)',
                        r'\((\d{4})\)'
                    ]
                    
                    for pattern in year_patterns:
                        year_match = re.search(pattern, description, re.IGNORECASE)
                        if year_match:
                            try:
                                year_candidate = int(year_match.group(1))
                                if 1980 <= year_candidate <= 2024:  # Reasonable range for Cage movies
                                    year = year_candidate
                                    break
                            except ValueError:
                                continue
                
                # Manually set years for known movies if still None
                if year is None:
                    known_years = {
                        "Face/Off": 1997,
                        "Pig": 2021,
                        "Raising Arizona": 1987,
                        "Adaptation": 2002,
                        "The Unbearable Weight of Massive Talent": 2022,
                        "Wild at Heart": 1990,
                        "Mandy": 2018,
                        "National Treasure": 2004,
                        "Leaving Las Vegas": 1995,
                        "Kiss of Death": 1995,
                        "Vampire's Kiss": 1989,
                        "Bad Lieutenant: Port of Call New Orleans": 2009,
                        "Con Air": 1997,
                        "Lord of War": 2005,
                        "Red Rock West": 1993,
                        "The Rock": 1996,
                        "Bringing Out the Dead": 1999,
                        "Longlegs": 2024,
                        "Dream Scenario": 2023,
                        "The Weather Man": 2005
                    }
                    
                    if title in known_years:
                        year = known_years[title]
                
                # Get tier description
                tier_description = tier_mapping.get(tier, "Unknown Tier")
                
                # Create a movie entry
                movie_entry = {
                    "ranking": ranking,
                    "tier": tier,
                    "tier_description": tier_description,
                    "title": title,
                    "year": year,
                    "description": description
                }
                
                movie_entries.append(movie_entry)
                print(f"Extracted movie {ranking}: {title} ({year}) - Tier {tier}: {tier_description}")
        
        # Sort by ranking
        movie_entries.sort(key=lambda x: x["ranking"])
        
        return movie_entries
        
    except requests.exceptions.RequestException as e:
        print(f"Error fetching the webpage: {e}")
        return []
    except Exception as e:
        print(f"An error occurred: {e}")
        import traceback
        traceback.print_exc()
        return []

def save_to_json(data, filename="cage_movies.json"):
    try:
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        print(f"Data successfully saved to {filename}")
        print(f"Total movies saved: {len(data)}")
    except Exception as e:
        print(f"Error saving data to JSON: {e}")

if __name__ == "__main__":
    print("Scraping Nicolas Cage movies ranking...")
    movies = scrape_cage_movies()
    
    if movies:
        print(f"Found {len(movies)} movies.")
        save_to_json(movies)
    else:
        print("No movies found or an error occurred.") 
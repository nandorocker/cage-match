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
        
        # Find all headings which likely contain the movie titles and rankings
        for i, element in enumerate(all_elements):
            # Check if this is a tier heading
            if element.name in ['h1', 'h2', 'h3'] and not element.name == 'p':
                text = element.get_text().strip()
                tier_match = re.search(r'\b(S|A|B|C|D|F)\s*Tier\b', text, re.IGNORECASE)
                if tier_match and not re.search(r'^\d+[\.:]', text):  # Make sure it's not a movie entry
                    current_tier = tier_match.group(1).upper()
                    continue
            
            # Check if this is a movie entry
            if element.name in ['h3', 'h4'] or (element.name == 'p' and re.search(r'^\d+[\.:]', element.get_text().strip())):
                text = element.get_text().strip()
                rank_match = re.search(r'^(\d+)[\.:]', text)
                
                if not rank_match:
                    continue
                    
                ranking = int(rank_match.group(1))
                
                # Extract tier information from the heading if present
                tier = current_tier
                tier_in_heading = re.search(r'\b(S|A|B|C|D|F)\s*Tier\b', text, re.IGNORECASE)
                if tier_in_heading:
                    tier = tier_in_heading.group(1).upper()
                
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
                
                # Create a movie entry
                movie_entry = {
                    "ranking": ranking,
                    "tier": tier,
                    "title": title,
                    "year": year,
                    "description": description
                }
                
                movie_entries.append(movie_entry)
                print(f"Extracted movie {ranking}: {title} ({year}) - {tier} Tier")
        
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
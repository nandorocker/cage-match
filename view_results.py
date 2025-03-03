import json
import os
import sys

def view_json_results(json_file="cage_movies.json"):
    """
    View the JSON results in a more readable format.
    """
    if not os.path.exists(json_file):
        print(f"Error: {json_file} not found.")
        print("Please run 'python scrape_cage_movies.py' first to generate the JSON file.")
        return
    
    try:
        with open(json_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        if not data:
            print(f"No data found in {json_file}.")
            return
        
        print(f"\n===== Nicolas Cage Movies Ranking =====")
        print(f"Total movies: {len(data)}")
        
        # Group by tier
        movies_by_tier = {}
        for movie in data:
            tier = movie.get("tier")
            if tier:
                if tier not in movies_by_tier:
                    movies_by_tier[tier] = []
                movies_by_tier[tier].append(movie)
        
        # Display movies by tier
        for tier in sorted(movies_by_tier.keys()):
            print(f"\n----- {tier} Tier Movies -----")
            tier_movies = movies_by_tier[tier]
            for movie in sorted(tier_movies, key=lambda x: x["ranking"]):
                print(f"{movie['ranking']}. {movie['title']} ({movie['year']})")
        
        # Ask if user wants to see details for a specific movie
        while True:
            try:
                choice = input("\nEnter a movie ranking number to see details (or 'q' to quit): ")
                if choice.lower() == 'q':
                    break
                
                rank = int(choice)
                movie = next((m for m in data if m["ranking"] == rank), None)
                
                if movie:
                    print(f"\n===== Movie #{rank} =====")
                    print(f"Title: {movie['title']}")
                    print(f"Year: {movie['year']}")
                    print(f"Tier: {movie.get('tier', 'Not specified')}")
                    print(f"Description: {movie['description']}")
                else:
                    print(f"No movie found with ranking {rank}.")
            except ValueError:
                print("Please enter a valid number or 'q' to quit.")
            except KeyboardInterrupt:
                print("\nExiting...")
                break
    
    except json.JSONDecodeError:
        print(f"Error: {json_file} is not a valid JSON file.")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    json_file = "cage_movies.json"
    if len(sys.argv) > 1:
        json_file = sys.argv[1]
    
    view_json_results(json_file) 
import json
from scrape_cage_movies import scrape_cage_movies, save_to_json

def test_scraper():
    print("Testing Nicolas Cage movie scraper...")
    
    # Run the scraper
    movies = scrape_cage_movies()
    
    if not movies:
        print("No movies found or an error occurred.")
        return
    
    # Save the results
    save_to_json(movies, "cage_movies.json")
    
    # Display some statistics
    print("\nScraping Results Summary:")
    print(f"Total movies found: {len(movies)}")
    
    # Count movies by tier
    tiers = {}
    for movie in movies:
        tier = movie.get("tier")
        if tier:
            tiers[tier] = tiers.get(tier, 0) + 1
    
    print("\nMovies by Tier:")
    for tier, count in sorted(tiers.items()):
        print(f"{tier} Tier: {count} movies")
    
    # Display the top 5 movies
    print("\nTop 5 Nicolas Cage Movies:")
    for i, movie in enumerate(movies[:5]):
        print(f"{i+1}. {movie['title']} ({movie['year']}) - {movie.get('tier', 'No')} Tier")
        print(f"   Description: {movie['description'][:100]}..." if len(movie['description']) > 100 else f"   Description: {movie['description']}")
        print()
    
    # Display the bottom 5 movies
    print("\nBottom 5 Nicolas Cage Movies:")
    for i, movie in enumerate(movies[-5:]):
        print(f"{len(movies)-4+i}. {movie['title']} ({movie['year']}) - {movie.get('tier', 'No')} Tier")
        print(f"   Description: {movie['description'][:100]}..." if len(movie['description']) > 100 else f"   Description: {movie['description']}")
        print()

if __name__ == "__main__":
    test_scraper() 
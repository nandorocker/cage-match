import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the movie type
interface Movie {
  ranking: number;
  tier: number;
  tier_description: string;
  title: string;
  year: number | null;
  description: string;
}

// Read the JSON file
const jsonPath = path.join(__dirname, '../../cage_movies.json');
const srcOutputPath = path.join(__dirname, '../src/lib/movies.ts');
const rootOutputPath = path.join(__dirname, '../lib/movies.ts');

try {
  // Create the data directories if they don't exist
  const srcDataDir = path.join(__dirname, '../src/lib');
  const rootDataDir = path.join(__dirname, '../lib');
  
  if (!fs.existsSync(srcDataDir)) {
    fs.mkdirSync(srcDataDir, { recursive: true });
  }
  
  if (!fs.existsSync(rootDataDir)) {
    fs.mkdirSync(rootDataDir, { recursive: true });
  }

  // Read and parse the JSON file
  const jsonData = fs.readFileSync(jsonPath, 'utf8');
  const movies: Movie[] = JSON.parse(jsonData);

  // Create the TypeScript file
  const tsContent = `// This file is auto-generated from the cage_movies.json file
export interface Movie {
  ranking: number;
  tier: number;
  tier_description: string;
  title: string;
  year: number | null;
  description: string;
}

export const movies: Movie[] = ${JSON.stringify(movies, null, 2)};

export const tierColors: Record<number, string> = {
  1: "bg-green-100 text-green-800 border-green-300",
  2: "bg-blue-100 text-blue-800 border-blue-300",
  3: "bg-purple-100 text-purple-800 border-purple-300",
  4: "bg-yellow-100 text-yellow-800 border-yellow-300",
  5: "bg-orange-100 text-orange-800 border-orange-300",
  6: "bg-red-100 text-red-800 border-red-300",
};

export const tierDescriptions: Record<number, string> = {
  1: "The 25 Most Essential Cage Movies",
  2: "Excellent Cage Movies",
  3: "Great Cage Movies",
  4: "Good Cage Movies",
  5: "Decent Cage Movies",
  6: "For Cage Completionists Only",
};
`;

  // Write the TypeScript files to both locations
  fs.writeFileSync(srcOutputPath, tsContent);
  fs.writeFileSync(rootOutputPath, tsContent);
  console.log(`Successfully converted JSON to TypeScript at ${srcOutputPath}`);
  console.log(`Successfully converted JSON to TypeScript at ${rootOutputPath}`);
} catch (error) {
  console.error('Error converting JSON to TypeScript:', error);
} 
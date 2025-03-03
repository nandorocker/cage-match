#!/bin/bash

# Create Next.js app with all options pre-selected
echo "Creating Next.js app..."
npx create-next-app@latest web-ui \
  --typescript \
  --tailwind \
  --eslint \
  --src-dir \
  --app \
  --import-alias "@/*" \
  --no-experimental-app \
  --use-npm

# Navigate to the web-ui directory
cd web-ui

# Install shadcn/ui
echo "Installing shadcn/ui..."
npx shadcn-ui@latest init --yes

# Install Lucide icons
echo "Installing Lucide icons..."
npm install lucide-react

# Create a script to convert the JSON data to TypeScript
echo "Creating data conversion script..."
mkdir -p scripts
cat > scripts/convert-data.ts << 'EOL'
import fs from 'fs';
import path from 'path';

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
const outputPath = path.join(__dirname, '../src/data/movies.ts');

try {
  // Create the data directory if it doesn't exist
  const dataDir = path.join(__dirname, '../src/data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
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

export const tierColors = {
  1: "bg-green-100 text-green-800 border-green-300",
  2: "bg-blue-100 text-blue-800 border-blue-300",
  3: "bg-purple-100 text-purple-800 border-purple-300",
  4: "bg-yellow-100 text-yellow-800 border-yellow-300",
  5: "bg-orange-100 text-orange-800 border-orange-300",
  6: "bg-red-100 text-red-800 border-red-300",
};

export const tierDescriptions = {
  1: "The 25 Most Essential Cage Movies",
  2: "Excellent Cage Movies",
  3: "Great Cage Movies",
  4: "Good Cage Movies",
  5: "Decent Cage Movies",
  6: "For Cage Completionists Only",
};
`;

  // Write the TypeScript file
  fs.writeFileSync(outputPath, tsContent);
  console.log(`Successfully converted JSON to TypeScript at ${outputPath}`);
} catch (error) {
  console.error('Error converting JSON to TypeScript:', error);
}
EOL

# Create a package.json script to run the conversion
npx json -I -f package.json -e 'this.scripts.convert = "ts-node scripts/convert-data.ts"'

# Install ts-node for running the conversion script
npm install --save-dev ts-node

echo "Setup complete! Next steps:"
echo "1. Run 'python scrape_cage_movies.py' to generate the latest data"
echo "2. Run 'cd web-ui && npm run convert' to convert the data to TypeScript"
echo "3. Run 'cd web-ui && npm run dev' to start the development server" 
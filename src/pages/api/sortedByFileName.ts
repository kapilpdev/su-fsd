// api/data.ts
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

type Data = {
  data: {
    createdAt: string;
    fileName: string;
  }[];
};

// Function to extract numerical values from a string
const extractNumericValue = (str: string): number | string => {
  const num = parseInt(str, 10);
  return isNaN(num) ? str : num;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const filePath = path.join(process.cwd(), 'public/assests/data.csv');
  
  try {
    const csvData = fs.readFileSync(filePath, 'utf-8');
    const jsonData = csvData.split('\n').map((line) => {
      const [createdAt, fileName] = line.split(';');
      return { createdAt, fileName };
    });

    // Sorting by fileName, considering numeric values numerically
    jsonData.sort((a, b) => {
      const fileNameA = a.fileName.replace(/^0+/, ''); // Remove leading zeros
      const fileNameB = b.fileName.replace(/^0+/, ''); // Remove leading zeros

      const valueA = extractNumericValue(fileNameA);
      const valueB = extractNumericValue(fileNameB);

      return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
    });

    res.status(200).json({ data: jsonData });
  } catch (error) {
    console.error('Error reading CSV file:', error);
    res.status(500).json({ data: [] });
  }
}

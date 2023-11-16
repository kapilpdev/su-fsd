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

    res.status(200).json({ data: jsonData });
  } catch (error) {
    console.error('Error reading CSV file:', error);
    res.status(500).json({ data: [] });
  }
}

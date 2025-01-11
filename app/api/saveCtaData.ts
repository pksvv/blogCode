import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';
import pino from 'pino';

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});

type FormData = {
  name: string;
  email: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  logger.info(`API request method: ${req.method}`);

  if (req.method === 'POST') {
    try {
      const filePath = path.join(process.cwd(), 'public', 'cta_captured_data.json');
      logger.info(`File path: ${filePath}`);

      // Read existing data or initialize an empty array
      let existingData: FormData[] = [];
      if (fs.existsSync(filePath)) {
        const fileData = fs.readFileSync(filePath, 'utf-8');
        logger.info(`Existing file data: ${fileData}`);
        existingData = JSON.parse(fileData || '[]');
      }

      // Add new data
      const newData = [...existingData, req.body];
      logger.info('New data to be written:', newData);

      // Write updated data back to the file
      fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));
      logger.info('Data successfully saved');

      return res.status(200).json({ message: 'Data saved successfully' });
    } catch (error) {
      logger.error('Error saving data:', error);
      return res.status(500).json({ message: 'Failed to save data', error: error.message });
    }
  }

  logger.warn(`Invalid request method: ${req.method}`);
  res.setHeader('Allow', ['POST']);
  return res.status(405).json({ message: 'Method Not Allowed' });
}

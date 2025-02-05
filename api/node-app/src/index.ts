// src/index.ts
import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import { getLlama, LlamaCompletion, resolveModelFile } from 'node-llama-cpp';
import path from 'path';
import { performance } from 'perf_hooks';

/*
 * Load up and parse configuration details from
 * the `.env` file to the `process.env`
 * object of Node.js
 */
dotenv.config();

/*
 * Create an Express application and get the
 * value of the PORT environment variable
 * from the `process.env`
 */
const app: Express = express();
app.use(express.json());

const port = process.env.PORT || 3000;

const modelsDirectory = path.join(__dirname, '..', 'models');

app.post('/v1/generate', async (req: Request, res: Response) => {
  const { input, maxTokens } = req.body;

  if (!input) {
    return res.status(400).json({ error: 'Input is required' });
  }

  try {
    const start = performance.now();
    const llama = await getLlama();
    const modelPath = await resolveModelFile(
      'DeepSeek-R1-Distill-Qwen-14B-Q4_0.gguf',
      modelsDirectory,
    );

    const model = await llama.loadModel({
      modelPath,
    });
    const context = await model.createContext();
    const completion = new LlamaCompletion({
      contextSequence: context.getSequence(),
    });

    const response = await completion.generateCompletion(input, {
      maxTokens: maxTokens || 100,
    });

    const end = performance.now();
    res.json({
      input,
      completion: response,
      timeSpent: `${((end - start) / 1000).toFixed(2)}s`,
    });
  } catch (error) {
    console.error('Error generating completion:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

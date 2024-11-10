import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import { config } from './config';
import { render } from './render';
import axios from 'axios';
import { webpackMiddleware } from './middlewares/webpackMiddleware';

// Cargar variables de entorno desde .env
dotenv.config();

const app: Express = express();
const isDev = process.env.NODE_ENV !== 'production';

if (isDev) {
  app.use(webpackMiddleware());
} else {
  app.use(express.static('dist'));
}

app.use(express.static('dist'));

app.get('/galaxias', async (req: Request, res: Response) => {
  try {
    const { data } = await axios.get("https://images-api.nasa.gov/search?q=galaxies");

    const initialProps = {
      galaxies: data?.collection?.items,
    };

    res.send(render(req.url, initialProps));
  } catch (error) {
    console.error("An error occurred in /galaxias:", error);
    res.status(500).send("An error occurred while fetching galaxies data.");
  }
});

app.get('*', (req: Request, res: Response) => {
  res.send(render(req.url));
});

const port = config.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});

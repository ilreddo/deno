import { Router } from 'https://deno.land/x/oak/mod.ts';
import { getStarships, getStarship, addStarship, updateStarship, deleteStarship } from './controllers/starships.ts';

const router = new Router();

router.get('/api/starships', getStarships)
      .get('/api/starships/:id', getStarship)
      .post('/api/starships', addStarship)
      .put('/api/starships/:id', updateStarship)
      .delete('/api/starships/:id', deleteStarship)

export default router; 
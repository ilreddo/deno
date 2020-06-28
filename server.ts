import { Application, Router } from 'https://deno.land/x/oak/mod.ts';
const port = 8070;

const app = new Application();

const router = new Router();

app.use(router.routes());
app.use(router.allowedMethods())

router.get('/api/starships', ({ response }: { response: any } ) => {
  response.body = 'Battlestar Galactica'
})

console.log(`Server run on port ${port}`);

await app.listen({ port });
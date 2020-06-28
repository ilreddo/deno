let file = await Deno.open('text.txt');
await Deno.copy(file, Deno.stdout);
file.close();
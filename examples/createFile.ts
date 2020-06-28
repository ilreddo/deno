const encoder = new TextEncoder();
const newText = encoder.encode('Hello World\nMy name is Antonio');

await Deno.writeFile('text.txt', newText);
import { dayOfYear, currentDayOfYear } from 'https://deno.land/std/datetime/mod.ts';

console.log(dayOfYear(new Date('2020-03-20')));
console.log(currentDayOfYear());
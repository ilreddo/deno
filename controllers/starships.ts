import { v4 } from 'https://deno.land/std/uuid/mod.ts'
import { Starship } from '../types.ts'

let starships : Starship[] = [
  {
    id: '1',
    name: 'galactica',
    class: 'battlestar',
    description: 'best starship ever',
    length: 1142
  },
  {
    id: '2',
    name: 'pegasus',
    class: 'battlestar',
    description: 'not long lasting startship',
    length: 1789
  },
  {
    id: '3',
    name: 'valkyrie',
    class: 'patrol',
    description: 'cylon war relic',
    length: 155
  }
];

// @desc    Get all starships
// @routes    GET /api/starship
const getStarships = ({ response }: { response: any }) => {
  response.body = {
    success: true,
    data: starships
  }
}

// @desc    Get single starship
// @routes    GET /api/starships/:id
const getStarship = ({ params, response }: { params: {  id: string }, response: any }) => {
  const starship: Starship | undefined = starships.find(s => s.id === params.id)

  if (starship) {
    response.status = 200
    response.body = {
      success: true,
      data: starship
    }
  } else {
    response.status = 404
    response.body = {
      success: false,
      message: 'Unable to find the starship'
    }
  }
}

// @desc    Add a starship
// @routes    POST /api/starships
const addStarship = async ({ request, response }: { request: any, response: any }) => {
  const body = await request.body();

  if (!request.hasBody) {
    response.status = 400
    response.body = {
      success: false,
      message: 'No data'
    }
  } else {
    const starship: Starship = body.value
    starship.id = v4.generate()
    starships.push(starship)
    response.status = 201;
    response.body = {
      success: true,
      data: starships
    }
  }
}

// @desc    Update a starship
// @routes    PUT /api/starships/:id
const updateStarship = async ({ params, request, response }: { params: { id: string }, request: any, response: any }) => {
  const starship: Starship | undefined = starships.find(s => s.id === params.id)

  if (starship) {
    const body = await request.body()
    const updateData: { name?: string, description?: string, class?: string, length?: number } = body.value

    starships = starships.map(s => s.id === params.id ? { ...s, ...updateData } : s)

    response.status = 200
    response.body = {
      success: true,
      data: starships
    }
  } else {
    response.status = 404
    response.body = {
      success: false,
      message: 'Unable to edit the starship'
    }
  }
}

// @desc    Delete a starship
// @routes    DELETE /api/starships/:id
const deleteStarship = ({ params, response }: { params: { id: string }, response: any }) => {
  starships = starships.filter(s => s.id !== params.id);

  response.body = {
    success: true,
    data: starships
  }
}

export { getStarships, getStarship, addStarship, updateStarship, deleteStarship }
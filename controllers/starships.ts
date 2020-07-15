import { v4 } from 'https://deno.land/std/uuid/mod.ts'
import { Client } from 'https://deno.land/x/postgres/mod.ts'
import { dbCreds } from '../config.ts'
import { Starship } from '../types.ts'

// Init client
const client = new Client(dbCreds);

// @desc    Get all starships
// @routes    GET /api/starship
const getStarships = async ({ response }: { response: any }) => {
  try {
    await client.connect()

    const result = await client.query('SELECT * FROM starships')

    const starships: Starship[] = new Array();

    result.rows.map(s => {
      let obj: any = new Object()

      result.rowDescription.columns.map((el, i) => {
        obj[el.name] = s[i]
      })

      starships.push(obj)
    })

    response.status = 200
    response.body = {
      success: true,
      data: starships
    }
  } catch(err) {
    response.status = 500
    response.body = {
      success: false,
      message: err.toString()
    }
  } finally {
    await client.end()
  }
}

// @desc    Get single starship
// @routes    GET /api/starships/:id
const getStarship = async ({ params, response }: { params: {  id: string }, response: any }) => {
  try {
    await client.connect()

    const result = await client.query('SELECT * FROM starships WHERE id = $1', params.id)

    if (result.rows.toString() === '') {
      response.status = 404
      response.body = {
        success: false,
        message: `No starship with id ${params.id}`
      }
      return
    } 

    const starship: any = new Object()

    result.rows.map(s => {
      result.rowDescription.columns.map((el, i) => {
        starship[el.name] = s[i]
      })
    })

    response.body = {
      success: true,
      data: starship
    }
  } catch (err) {
    response.status = 500
    response.body = {
      success: false,
      message: err.toString()
    }
  } finally {
    await client.end()
  }
}

// @desc    Add a starship
// @routes    POST /api/starships
const addStarship = async ({ request, response }: { request: any, response: any }) => {
  const body = await request.body()
  const starship = body.value

  if (!request.hasBody) {
    response.status = 400
    response.body = {
      success: false,
      message: 'No data'
    }
  } else {
    try {
      await client.connect()

      await client.query(`INSERT INTO starships(name, class, description, length')
        VALUES($1,$2,$3,$4)`, 
        starship.name, 
        starship.class, 
        starship.description, 
        starship.length
      )

      response.status = 201
      response.body = {
        success: true,
        data: starship
      }
    } catch (err) {
      response.status = 500
      response.body = {
        success: false,
        message: err.toString()
      }
    } finally {
      await client.end()
    }
  } 
}

// @desc    Update a starship
// @routes    PUT /api/starships/:id
const updateStarship = async ({ params, request, response }: { params: { id: string }, request: any, response: any }) => {
  await getStarship({ params: { 'id': params.id }, response})

  if (response.status === 404) {
    response.status = 400
    response.body = {
      success: false,
      message: response.body.message
    }
    return;
  }

  const body = await request.body()
  const starship = body.value

  if (!request.hasBody) {
    response.status = 400
    response.body = {
      success: false,
      message: 'No data'
    }
  } else {
    try {
      await client.connect()

      await client.query(`UPDATE starships SET name=$1, class=$2, description=$3, length=$4 WHERE id=$5')`, 
        starship.name, 
        starship.class, 
        starship.description, 
        starship.length,
        params.id
      )

      response.status = 200
      response.body = {
        success: true,
        data: starship
      }
    } catch (err) {
      response.status = 500
      response.body = {
        success: false,
        message: err.toString()
      }
    } finally {
      await client.end()
    }
  } 
}

// @desc    Delete a starship
// @routes    DELETE /api/starships/:id
const deleteStarship = async ({ params, response }: { params: { id: string }, response: any }) => {
  if (response.status === 404) {
    response.status = 400
    response.body = {
      success: false,
      message: response.body.message
    }
    return;
  }

  try {
    await client.connect()

    const result  = await client.query('DELETE FROM starships WHERE id=$1', params.id)

    response.status = 204
    response.body = {
      success: true,
      message: `Starship with id ${params.id} has been deleted`
    }
  } catch (err) {
    response.status = 500
    response.body = {
      success: false,
      message: err.toString()
    }
  } finally {
    await client.end()
  }
}

export { getStarships, getStarship, addStarship, updateStarship, deleteStarship }
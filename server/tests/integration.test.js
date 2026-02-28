import request from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'

let mongod
let app

beforeAll(async () => {
  mongod = await MongoMemoryServer.create()
  process.env.MONGODB_URL = mongod.getUri()
  process.env.NODE_ENV = 'test'
  // Import app after env vars are set
  const mod = await import('../server.js')
  app = mod.default
})

import mongoose from 'mongoose'

afterAll(async () => {
  try {
    await mongoose.connection.close()
  } catch (e) {
    // ignore
  }
  if (mongod) await mongod.stop()
})

test('GET / returns server running', async () => {
  const res = await request(app).get('/')
  expect(res.status).toBe(200)
  expect(res.text).toContain('Server is running')
})

test('POST /api/dev/create creates dev user', async () => {
  const res = await request(app)
    .post('/api/dev/create')
    .send({ id: 'test_dev_user' })
    .set('Content-Type', 'application/json')

  expect(res.status).toBe(200)
  expect(res.body).toMatchObject({ success: true, userId: expect.any(String) })
})

test('POST /api/post/add and GET /api/post/feed', async () => {
  // Create and use dev user header
  await request(app).post('/api/dev/create').send({ id: 'poster_user' }).set('Content-Type', 'application/json')

  const postRes = await request(app)
    .post('/api/post/add')
    .set('x-dev-user', 'poster_user')
    .field('content', 'Integration test post')
    .field('post_type', 'text')

  expect(postRes.status).toBe(200)
  expect(postRes.body).toMatchObject({ success: true })

  const feedRes = await request(app).get('/api/post/feed').set('x-dev-user', 'poster_user')
  expect(feedRes.status).toBe(200)
  expect(feedRes.body.success).toBe(true)
  expect(Array.isArray(feedRes.body.data)).toBe(true)
  expect(feedRes.body.data.some(p => p.content === 'Integration test post')).toBe(true)
})
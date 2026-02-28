import request from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'

let mongod
let app

beforeAll(async () => {
  mongod = await MongoMemoryServer.create()
  process.env.MONGODB_URL = mongod.getUri()
  process.env.NODE_ENV = 'test'
  const mod = await import('../server.js')
  app = mod.default
})

afterAll(async () => {
  try {
    await mongoose.connection.close()
  } catch (e) {
    // ignore
  }
  if (mongod) await mongod.stop()
})

describe('User API', () => {
  let userId = 'test_user_1'

  beforeEach(async () => {
    // Create user before each test
    await request(app).post('/api/dev/create').send({ id: userId }).set('Content-Type', 'application/json')
  })

  test('GET /api/user/data returns user profile', async () => {
    const res = await request(app)
      .get('/api/user/data')
      .set('x-dev-user', userId)

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data).toMatchObject({
      _id: userId,
      email: expect.any(String),
      full_name: expect.any(String),
      username: expect.any(String),
      followers: expect.any(Array),
      following: expect.any(Array),
      connections: expect.any(Array)
    })
  })

  test('POST /api/user/discover returns available users', async () => {
    const res = await request(app)
      .post('/api/user/discover')
      .set('x-dev-user', userId)
      .send({})

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(Array.isArray(res.body.data)).toBe(true)
  })

  test('POST /api/user/follow follows a user', async () => {
    const targetUserId = 'target_user'
    await request(app).post('/api/dev/create').send({ id: targetUserId }).set('Content-Type', 'application/json')

    const res = await request(app)
      .post('/api/user/follow')
      .set('x-dev-user', userId)
      .send({ targetUserId })

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
  })

  test('POST /api/user/connect sends connection request', async () => {
    const targetUserId = 'target_user2'
    await request(app).post('/api/dev/create').send({ id: targetUserId }).set('Content-Type', 'application/json')

    const res = await request(app)
      .post('/api/user/connect')
      .set('x-dev-user', userId)
      .send({ targetUserId })

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
  })
})

describe('Post API', () => {
  let userId = 'post_user_1'

  beforeEach(async () => {
    await request(app).post('/api/dev/create').send({ id: userId }).set('Content-Type', 'application/json')
  })

  test('POST /api/post/add creates post and GET /api/post/feed retrieves it', async () => {
    const postRes = await request(app)
      .post('/api/post/add')
      .set('x-dev-user', userId)
      .field('content', 'Hello World!')
      .field('post_type', 'text')

    expect(postRes.status).toBe(200)
    expect(postRes.body.success).toBe(true)

    const feedRes = await request(app)
      .get('/api/post/feed')
      .set('x-dev-user', userId)

    expect(feedRes.status).toBe(200)
    expect(feedRes.body.success).toBe(true)
    expect(feedRes.body.data.some(p => p.content === 'Hello World!')).toBe(true)
  })

  test('POST /api/post/like likes a post', async () => {
    const postRes = await request(app)
      .post('/api/post/add')
      .set('x-dev-user', userId)
      .field('content', 'Likeable post')
      .field('post_type', 'text')

    const feedRes = await request(app)
      .get('/api/post/feed')
      .set('x-dev-user', userId)

    const postId = feedRes.body.data.find(p => p.content === 'Likeable post')._id

    const likeRes = await request(app)
      .post('/api/post/like')
      .set('x-dev-user', userId)
      .send({ postId })

    expect(likeRes.status).toBe(200)
    expect(likeRes.body.success).toBe(true)
    expect(likeRes.body.message).toContain('liked')
  })

  test('POST /api/post/share increments share count', async () => {
    const postRes = await request(app)
      .post('/api/post/add')
      .set('x-dev-user', userId)
      .field('content', 'Shareable post')
      .field('post_type', 'text')

    const feedRes = await request(app)
      .get('/api/post/feed')
      .set('x-dev-user', userId)

    const postId = feedRes.body.data.find(p => p.content === 'Shareable post')._id

    const shareRes = await request(app)
      .post('/api/post/share')
      .set('x-dev-user', userId)
      .send({ postId })

    expect(shareRes.status).toBe(200)
    expect(shareRes.body.success).toBe(true)
    expect(shareRes.body.data.shares_count).toBeGreaterThan(0)
  })
})

describe('Story API', () => {
  let userId = 'story_user_1'

  beforeEach(async () => {
    await request(app).post('/api/dev/create').send({ id: userId }).set('Content-Type', 'application/json')
  })

  test('POST /api/story/add creates story', async () => {
    const res = await request(app)
      .post('/api/story/add')
      .set('x-dev-user', userId)
      .field('caption', 'Story time!')

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
  })

  test('GET /api/story/all returns stories', async () => {
    await request(app)
      .post('/api/story/add')
      .set('x-dev-user', userId)
      .field('caption', 'Test story')

    const res = await request(app)
      .get('/api/story/all')
      .set('x-dev-user', userId)

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(Array.isArray(res.body.data)).toBe(true)
  })
})

describe('Comment API', () => {
  let userId = 'comment_user_1'
  let postId

  beforeEach(async () => {
    await request(app).post('/api/dev/create').send({ id: userId }).set('Content-Type', 'application/json')

    const postRes = await request(app)
      .post('/api/post/add')
      .set('x-dev-user', userId)
      .field('content', 'Post for comments')
      .field('post_type', 'text')

    const feedRes = await request(app)
      .get('/api/post/feed')
      .set('x-dev-user', userId)

    postId = feedRes.body.data.find(p => p.content === 'Post for comments')._id
  })

  test('POST /api/comment/add creates comment', async () => {
    const res = await request(app)
      .post('/api/comment/add')
      .set('x-dev-user', userId)
      .send({ postId, content: 'Great post!' })

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
  })

  test('GET /api/comment/list returns comments for post', async () => {
    await request(app)
      .post('/api/comment/add')
      .set('x-dev-user', userId)
      .send({ postId, content: 'Nice!' })

    const res = await request(app)
      .get('/api/comment/list')
      .set('x-dev-user', userId)
      .query({ postId })

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(Array.isArray(res.body.data)).toBe(true)
    expect(res.body.data.some(c => c.content === 'Nice!')).toBe(true)
  })
})

describe('Message API', () => {
  let userId1 = 'msg_user_1'
  let userId2 = 'msg_user_2'

  beforeEach(async () => {
    await request(app).post('/api/dev/create').send({ id: userId1 }).set('Content-Type', 'application/json')
    await request(app).post('/api/dev/create').send({ id: userId2 }).set('Content-Type', 'application/json')
  })

  test('POST /api/message/send sends message between users', async () => {
    const res = await request(app)
      .post('/api/message/send')
      .set('x-dev-user', userId1)
      .send({ receiverId: userId2, content: 'Hello!' })

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
  })

  test('GET /api/message/conversations returns user conversations', async () => {
    await request(app)
      .post('/api/message/send')
      .set('x-dev-user', userId1)
      .send({ receiverId: userId2, content: 'Hi there' })

    const res = await request(app)
      .get('/api/message/conversations')
      .set('x-dev-user', userId1)

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(Array.isArray(res.body.data)).toBe(true)
  })
})

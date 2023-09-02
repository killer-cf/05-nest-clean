import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { AuthenticateStudentUseCase } from './authenticate-student'
import { makeStudent } from 'test/factories/make-student'

let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let inMemoryStudentsRepository: InMemoryStudentsRepository
let sut: AuthenticateStudentUseCase

describe('Authenticate student', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    sut = new AuthenticateStudentUseCase(
      inMemoryStudentsRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate a student', async () => {
    const student = makeStudent({
      email: 'kilder@hmama.com',
      password: await fakeHasher.hash('password'),
    })

    inMemoryStudentsRepository.create(student)

    const result = await sut.execute({
      email: 'kilder@hmama.com',
      password: 'password',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })
})

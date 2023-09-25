import { ListAnswerCommentsUseCase } from './list-answer-comments'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { makeStudent } from 'test/factories/make-student'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: ListAnswerCommentsUseCase

describe('List recente answers', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentsRepository,
    )
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    sut = new ListAnswerCommentsUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerCommentsRepository,
    )
  })

  test('should be able to list recent answers', async () => {
    const answer = makeAnswer()
    const student = makeStudent({ name: 'John Doe' })

    inMemoryStudentsRepository.create(student)
    inMemoryAnswersRepository.create(answer)

    const comment1 = makeAnswerComment({
      answerId: answer.id,
      authorId: student.id,
    })
    const comment2 = makeAnswerComment({
      answerId: answer.id,
      authorId: student.id,
    })
    const comment3 = makeAnswerComment({
      answerId: answer.id,
      authorId: student.id,
    })

    inMemoryAnswerCommentsRepository.create(comment1)
    inMemoryAnswerCommentsRepository.create(comment2)
    inMemoryAnswerCommentsRepository.create(comment3)

    const result = await sut.execute({
      page: 1,
      answerId: answer.id.toString(),
    })

    if (result.isRight()) {
      expect(result.value?.comments).toHaveLength(3)
      expect(result.value?.comments).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            author: expect.objectContaining({
              name: 'John Doe',
            }),
            commentId: comment1.id,
          }),
          expect.objectContaining({
            author: expect.objectContaining({
              name: 'John Doe',
            }),
            commentId: comment2.id,
          }),
          expect.objectContaining({
            author: expect.objectContaining({
              name: 'John Doe',
            }),
            commentId: comment3.id,
          }),
        ]),
      )
    }
  })

  test('should be able to list paginated answer comments', async () => {
    const answer = makeAnswer()
    const student = makeStudent({ name: 'John Doe' })

    inMemoryStudentsRepository.create(student)
    inMemoryAnswersRepository.create(answer)

    for (let i = 1; i <= 22; i++) {
      inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId: answer.id,
          authorId: student.id,
        }),
      )
    }

    const result = await sut.execute({
      page: 2,
      answerId: answer.id.toString(),
    })

    if (result.isRight()) expect(result.value?.comments).toHaveLength(2)
  })
})

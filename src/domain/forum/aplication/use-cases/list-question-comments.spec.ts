import { ListQuestionCommentsUseCase } from './list-question-comments'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { makeStudent } from 'test/factories/make-student'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: ListQuestionCommentsUseCase

describe('List recente questions', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentsRepository,
    )
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    sut = new ListQuestionCommentsUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionCommentsRepository,
    )
  })

  test('should be able to list recent questions', async () => {
    const question = makeQuestion()
    const student = makeStudent({ name: 'John Doe' })

    inMemoryStudentsRepository.create(student)

    inMemoryQuestionsRepository.create(question)

    const comment1 = makeQuestionComment({
      questionId: question.id,
      authorId: student.id,
    })
    const comment2 = makeQuestionComment({
      questionId: question.id,
      authorId: student.id,
    })
    const comment3 = makeQuestionComment({
      questionId: question.id,
      authorId: student.id,
    })

    inMemoryQuestionCommentsRepository.create(comment1)
    inMemoryQuestionCommentsRepository.create(comment2)
    inMemoryQuestionCommentsRepository.create(comment3)

    const result = await sut.execute({
      page: 1,
      questionId: question.id.toString(),
    })

    if (result.isRight()) {
      console.log(result.value?.comments)
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

  test('should be able to list paginated question comments', async () => {
    const question = makeQuestion()
    const student = makeStudent({ name: 'John Doe' })

    inMemoryStudentsRepository.items.push(student)

    inMemoryQuestionsRepository.create(question)

    for (let i = 1; i <= 22; i++) {
      inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          questionId: question.id,
          authorId: student.id,
        }),
      )
    }

    const result = await sut.execute({
      page: 2,
      questionId: question.id.toString(),
    })
    if (result.isRight()) expect(result.value?.comments).toHaveLength(2)
  })
})

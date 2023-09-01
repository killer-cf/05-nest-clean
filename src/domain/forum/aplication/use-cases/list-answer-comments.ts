import { Either, left, right } from '@/core/either'
import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import { AnswersRepository } from '../repositories/answers-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

interface ListAnswerCommentsUseCaseRequest {
  answerId: string
  page: number
}

type ListAnswerCommentsUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    answerComments: AnswerComment[]
  }
>

export class ListAnswerCommentsUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private answerCommentsRepository: AnswerCommentsRepository,
  ) {}

  async execute({
    answerId,
    page,
  }: ListAnswerCommentsUseCaseRequest): Promise<ListAnswerCommentsUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    const answerComments =
      await this.answerCommentsRepository.findManyByAnswerId(answerId, {
        page,
      })

    return right({ answerComments })
  }
}

import { Controller, Delete, HttpCode, Param } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { DeleteQuestionUseCase } from '@/domain/forum/aplication/use-cases/delete-question'

@Controller('/questions/:id')
export class DeleteQuestionController {
  constructor(private deleteQuestion: DeleteQuestionUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param('id') questionId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.sub

    await this.deleteQuestion.execute({
      questionId,
      authorId: userId,
    })
  }
}

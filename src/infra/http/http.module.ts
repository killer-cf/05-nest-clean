import { Module } from '@nestjs/common'
import { CreateAccountController } from './controllers/create-account.controller'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateQuestionController } from './controllers/create-question.controller'
import { ListRecentQuestionsController } from './controllers/list-recent-questions.controller'
import { DatabaseModule } from '../database/database.module'
import { CreateQuestionUseCase } from '@/domain/forum/aplication/use-cases/create-question'
import { ListRecentQuestionsUseCase } from '@/domain/forum/aplication/use-cases/list-recent-questions'
import { AuthenticateStudentUseCase } from '@/domain/forum/aplication/use-cases/authenticate-student'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { RegisterStudentUseCase } from '@/domain/forum/aplication/use-cases/register-student'
import { GetQuestionBySlugController } from './controllers/get-question-by-slug.controller'
import { GetQuestionBySlugUseCase } from '@/domain/forum/aplication/use-cases/get-question-by-slug'
import { EditQuestionController } from './controllers/edit-question.controller'
import { EditQuestionUseCase } from '@/domain/forum/aplication/use-cases/edit-question'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    ListRecentQuestionsController,
    GetQuestionBySlugController,
    EditQuestionController,
  ],
  providers: [
    CreateQuestionUseCase,
    ListRecentQuestionsUseCase,
    AuthenticateStudentUseCase,
    RegisterStudentUseCase,
    GetQuestionBySlugUseCase,
    EditQuestionUseCase,
  ],
})
export class HttpModule {}

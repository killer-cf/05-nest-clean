import { Controller, Post } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
// import { hash } from 'bcryptjs'
// import { z } from 'zod'
// import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'

// const createAccountBodySchema = z.object({
//   name: z.string(),
//   email: z.string().email(),
//   password: z.string(),
// })

// type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/sessions')
export class AuthenticateController {
  constructor(private jwt: JwtService) {}

  @Post()
  // @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle() {
    const token = this.jwt.sign({
      sub: 'user-id',
    })

    return token
  }
}

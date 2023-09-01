import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { SendNotificationUseCase } from './send-notification'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase

describe('Send Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new SendNotificationUseCase(inMemoryNotificationsRepository)
  })

  test('should be able to send a notification', async () => {
    const result = await sut.execute({
      recipientId: '3',
      title: 'Titulo da notificação',
      content: 'Nova notificação',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.notification.content).toEqual('Nova notificação')
    expect(result.value?.notification.title).toEqual('Titulo da notificação')
    expect(inMemoryNotificationsRepository.items[0]).toEqual(
      result.value?.notification,
    )
  })
})

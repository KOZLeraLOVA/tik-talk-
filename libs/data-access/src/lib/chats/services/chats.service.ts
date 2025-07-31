import { HttpClient } from '@angular/common/http'
import { computed, inject, Injectable, signal } from '@angular/core'
import { Chat, LastMessageRes, Message } from '../interfaces/chats.interface'
import { map, Observable } from 'rxjs'
import { DateTime } from 'luxon'
import { ChatWSService } from '../interfaces/chat-ws-service.interface'
import { AuthService, ProfileService, selectedMeProfile } from '@tt/data-access'
import { ChatWSMessage } from '../interfaces/chat-ws-message.interface'
import {
	isUnreadMessage,
	isNewMessage,
	isErrorMessage
} from '../interfaces/type-guards'
import { ChatWSRxjsService } from '../interfaces/chat-ws-rxjs.service'
import { TokenResponce } from '../../auth/interfaces/auth.interface'

import { Store } from '@ngrx/store'
import { Profile } from '../../profile/interfaces/profile.interface'
import { ChatWSNativeService } from './chat-ws-native.service'

@Injectable({
	providedIn: 'root'
})
export class ChatsService {
	http = inject(HttpClient)
	store = inject(Store)
	#authService = inject(AuthService)
	me = inject(ProfileService).me

	// wsAdapter: ChatWSService = new ChatWSNativeService()
	wsAdapter: ChatWSService = new ChatWSRxjsService()

	groupedChatMessages = signal<{ label: string; messages: Message[] }[]>([])
	////groupedUnreadChatMessages = signal<{ label: string; messages: Message[] }[]>([])
	//unreadMessageCount = signal(0)

	//me = this.store.selectSignal(selectedMeProfile)
	activeChatMessages = signal<Message[]>([])

	unreadMessageCount = signal<number>(0)
	userConsumer = signal<Profile | null>(null)

	countUnreadMessagesOneUser = signal<Map<number, number>>(new Map())

	chatsUrl = 'https://icherniakov.ru/yt-course/chat/'

	// baseApiUrl = '/yt-course/'
	// chatsUrl = `${this.baseApiUrl}chat/`
	// messageUrl = `${this.baseApiUrl}message/`

	readonly unreadUsersCount = computed(() => {
		const map = this.countUnreadMessagesOneUser()
		let count = 0

		map.forEach((value) => {
			if (value > 0) count++
		})
		return count
	})

	connectWS() {
		return this.wsAdapter.connect({
			url: `${this.chatsUrl}ws`,
			token: this.#authService.token ?? '',
			handleMessage: this.handleWSMessage
		}) as Observable<ChatWSMessage>
	}

	handleWSMessage = (message: ChatWSMessage) => {
		if (!('action' in message)) return

		// if (isErrorMessage(message)) {
		// 	this.wsAdapter.disconnect()
		// 	return
		// }

		if (isUnreadMessage(message)) {
			this.unreadMessageCount.set(message.data.count)
		}

		if (isErrorMessage(message)) {
			this.#authService.refreshAuthToken().subscribe((token: TokenResponce) => {
				console.log('Токен обновлен', token.access_token)
			})
			this.wsAdapter.disconnect()
			this.connectWS().subscribe()
		}

		if (isNewMessage(message)) {
			if (!(message.data.author === this.me()?.id)) {
				const map = this.countUnreadMessagesOneUser()
				let chatsId = message.data.chat_id

				if (!map.has(chatsId)) {
					map.set(chatsId, 1)
				} else {
					map.set(chatsId, map.get(chatsId)! + 1)
				}
				this.countUnreadMessagesOneUser.set(map)
			}

			this.activeChatMessages.set([
				...this.activeChatMessages(),
				{
					id: message.data.id,
					userFromId: message.data.author,
					user:
						message.data.author === this.me()?.id
							? this.me()
							: this.userConsumer(),
					//  либо this.activeChat()?.userFirst.id === message.data.author
					// ? this.activeChat()?.userFirst
					// : this.activeChat()?.userSecond
					personalChatId: message.data.chat_id,
					text: message.data.message,
					createdAt: message.data.created_at,
					isRead: false,
					isMine: message.data.author === this.me()?.id
				}
			])
		}
	}

	#refreshToken() {
		this.#authService
			.refreshAuthToken()
			.subscribe((tokenResponce: TokenResponce) => {
				console.log('Токен обновлен', tokenResponce.access_token)
			})
	}

	createChat(userId: number) {
		return this.http.post<Chat>(`${this.chatsUrl}${userId}`, {})
	}

	getMyChats() {
		return this.http.get<LastMessageRes[]>(`${this.chatsUrl}get_my_chats/`)
	}

	getChatById(chatId: number) {
		return this.http.get<Chat>(`${this.chatsUrl}${chatId}`).pipe(
			map((chat) => {
				const patchedMessages = chat.messages.map((message) => {
					this.userConsumer.set(
						chat.userFirst.id === this.me()!.id
							? chat.userSecond
							: chat.userFirst
					)

					return {
						...message,
						user:
							chat.userFirst.id === message.userFromId
								? chat.userFirst
								: chat.userSecond,
						isMine: message.userFromId === this.me()!.id
					}
				})

				const groupedMessage = this.messagesForGroup(patchedMessages)
				this.groupedChatMessages.set(groupedMessage)
				//
				// this.activeChatMessages.set(patchedMessages)
				//
				// // this.groupedChatMessages.set(patchedMessages)
				// console.log()

				return {
					...chat,
					companion:
						chat.userFirst.id === this.me()!.id
							? chat.userSecond
							: chat.userFirst,
					messages: patchedMessages
				}
			})
		)
	}

	deleteUnreadMessage(chatId: number) {
		const map = this.countUnreadMessagesOneUser()

		if (map.has(chatId)) {
			map.set(chatId, 0)
		}

		this.countUnreadMessagesOneUser.set(map)
	}

	messagesForGroup(messages: Message[]) {
		const messagesArray = messages
		const groupedMessages = new Map<string, Message[]>()

		const today = DateTime.now().startOf('day')
		const yesterday = today.minus({ days: 1 })

		messagesArray.forEach((message: Message) => {
			const messageDate = DateTime.fromISO(message.createdAt, { zone: 'utc' })
				.setZone(DateTime.local().zone)
				.startOf('day')

			let dateLabel: string
			if (messageDate.equals(today)) {
				dateLabel = 'Сегодня'
			} else if (messageDate.equals(yesterday)) {
				dateLabel = 'Вчера'
			} else {
				dateLabel = messageDate.toFormat('dd.MM.yyyy')
			}

			if (!groupedMessages.has(dateLabel)) {
				groupedMessages.set(dateLabel, [])
			}
			groupedMessages.get(dateLabel)?.push(message)
		})

		return Array.from(groupedMessages.entries()).map(([label, messages]) => ({
			label,
			messages
		}))
	}
}
//
// sendMessage(chatId: number, message: string) {
// 	return this.http
// 		.post(
// 			`${this.messageUrl}send/${chatId}`,
// 			{},
// 			{
// 				params: { message }
// 			}
// 		)
// 		.pipe(
// 			map((response: any) => {
// 				return {
// 					text: response.text,
// 					timestamp: new Date(response.timestamp)
// 				}
// 			})
// 		)
// 	}
// }

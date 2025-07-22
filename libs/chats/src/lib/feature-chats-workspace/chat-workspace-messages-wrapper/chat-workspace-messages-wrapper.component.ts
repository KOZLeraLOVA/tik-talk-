import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	EventEmitter,
	HostListener,
	inject,
	Input,
	input,
	Output,
	Renderer2,
	ViewChild
} from '@angular/core'
import { ChatWorkspaceMessageComponent } from '../chat-workspace-message/chat-workspace-message.component'
import { firstValueFrom, fromEvent, Subscription, switchMap, timer } from 'rxjs'
import { Chat, Message } from '@tt/data-access'
import { ChatsService } from '@tt/data-access'
import { MessageInputComponent } from '../../ui/message-input/message-input.component'

@Component({
	selector: 'app-chat-workspace-messages-wrapper',
	imports: [ChatWorkspaceMessageComponent, MessageInputComponent],
	templateUrl: './chat-workspace-messages-wrapper.component.html',
	styleUrl: './chat-workspace-messages-wrapper.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatWorkspaceMessagesWrapperComponent {
	chatsService = inject(ChatsService)
	hostElement = inject(ElementRef)
	r2 = inject(Renderer2)

	@Output() sendMessage = new EventEmitter()
	@Input() messages: Message[] = []
	chat = input.required<Chat>()

	@HostListener('window:resize')
	onWindowResize() {
		this.resizeFeed()
	}

	@ViewChild('messagesWrapper') messagesWrapper!: ElementRef

	scrollToBottom() {
		setTimeout(() => {
			if (this.messagesWrapper) {
				this.messagesWrapper.nativeElement.scrollTo({
					top: this.messagesWrapper.nativeElement.scrollHeight,
					behavior: 'smooth'
				})
			}
		}, 0)
	}

	sourceSub!: Subscription

	ngAfterViewInit() {
		this.sourceSub = timer(0, 10000)
			.pipe(
				switchMap(() => {
					return this.chatsService.getChatById(this.chat().id)
				})
			)
			.subscribe()

		this.resizeFeed()
		fromEvent(window, 'resize')
	}

	ngOnDestroy() {
		this.sourceSub.unsubscribe()
	}

	resizeFeed() {
		const { top } = this.hostElement.nativeElement.getBoundingClientRect()

		const height = window.innerHeight - top - 16 - 16

		this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`)
	}

	async onSendMessage(textMessage: any) {
		this.chatsService.wsAdapter.sendMessage(textMessage, this.chat().id)

		// await firstValueFrom(
		// 	this.chatsService.sendMessage(this.chat().id, messageText)
		// )

		await firstValueFrom(this.chatsService.getChatById(this.chat().id))
		this.scrollToBottom()
	}
}

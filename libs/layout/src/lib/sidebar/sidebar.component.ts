import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	inject
} from '@angular/core'
import { NgForOf, JsonPipe, AsyncPipe } from '@angular/common'
import { RouterLink } from '@angular/router'
import { firstValueFrom, Subscription } from 'rxjs'
import { RouterLinkActive } from '@angular/router'
import { SvgIconComponent } from '../../../../common-ui/src/lib/components/svg-icon/svg-icon.component'
import { SubscriberCardComponent } from '../subscriber-card/subscriber-card.component'
import { ImgUrlPipe } from '../../../../common-ui/src/lib/pipes/img-url.pipe'
import { ChatsService } from '../../../../data-access/src/lib/chats/services/chats.service'
import { Store } from '@ngrx/store'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

import {
	AuthService,
	ProfileService,
	selectedMeProfile,
	selectedSubscribersShortList
} from '@tt/data-access'
import { isErrorMessage } from '../../../../data-access/src/lib/chats/interfaces/type-guards'
import { Profile } from '../../../../data-access/src/lib/profile/interfaces/profile.interface'

@Component({
	selector: 'app-sidebar',
	standalone: true,
	imports: [
		SvgIconComponent,
		NgForOf,
		AsyncPipe,
		RouterLink,
		ImgUrlPipe,
		SubscriberCardComponent,
		JsonPipe,
		RouterLinkActive
	],
	templateUrl: './sidebar.component.html',
	styleUrl: './sidebar.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
	profileService = inject(ProfileService)
	chatService = inject(ChatsService)
	store = inject(Store)
	destroyRef = inject(DestroyRef)
	#authService = inject(AuthService)

	subscribers = this.store.selectSignal(selectedSubscribersShortList)
	// subcribers$ = this.profileService.getSubscribersShortList()
	// me = this.store.selectSignal(selectedMeProfile)
	unreadMessages = this.chatService.unreadMessageCount
	me: Profile | null = null

	wsSubscribe!: Subscription

	menuItems = [
		{
			label: 'Моя страница',
			icon: 'home',
			link: 'profile/me'
		},
		{
			label: 'Чаты',
			icon: 'chats',
			link: 'chats'
		},
		{
			label: 'Поиск',
			icon: 'search',
			link: 'search'
		}
	]

	async reconnect() {
		await firstValueFrom(this.#authService.refreshAuthToken())
		this.connectWS()
	}

	connectWS(): void {
		this.wsSubscribe?.unsubscribe()
		this.wsSubscribe = this.chatService
			.connectWS()
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((message) => {
				if (isErrorMessage(message)) {
					console.log('Неверный токен')
					this.reconnect()
				}
			})
	}

	ngOnInit() {
		firstValueFrom(this.profileService.getMe()).then((profile) => {
			this.me = profile
		})
	}
}

import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { ChatsService } from '../../../../../data-access/src/lib/chats/services/chats.service'
import { AsyncPipe } from '@angular/common'
import { ChatsBtnComponent } from '../chats-btn/chats-btn.component'
import { map, startWith, switchMap } from 'rxjs'
import { RouterLinkActive, RouterLink } from '@angular/router'
import { SvgIconComponent } from '@tt/common-ui'

@Component({
	selector: 'app-chats-list',
	imports: [
		ChatsBtnComponent,
		FormsModule,
		ReactiveFormsModule,
		AsyncPipe,
		RouterLinkActive,
		RouterLink,
		SvgIconComponent
	],
	templateUrl: './chats-list.component.html',
	styleUrl: './chats-list.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatsListComponent {
	chatsService = inject(ChatsService)

	filterChatsControl = new FormControl('')

	chats$ = this.chatsService.getMyChats().pipe(
		switchMap((chats) => {
			return this.filterChatsControl.valueChanges.pipe(
				startWith(''),
				map((inputValue) => {
					return chats.filter((chat) => {
						return `${chat.userFrom.firstName} ${chat.userFrom.lastName}`
							.toLowerCase()
							.includes(inputValue?.toLowerCase() ?? '')
					})
				})
			)
		})
	)
}

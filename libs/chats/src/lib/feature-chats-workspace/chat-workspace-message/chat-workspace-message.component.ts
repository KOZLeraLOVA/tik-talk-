import { DateTime } from 'luxon'
import {
	ChangeDetectionStrategy,
	Component,
	HostBinding,
	input
} from '@angular/core'
import { AvatarCircleComponent } from 'libs/common-ui/src/lib/components/avatar-circle/avatar-circle.component'
import { TimeAgoPipe } from 'libs/common-ui/src/lib/pipes/time-ago.pipe'
import { Message } from '@tt/data-access'

@Component({
	selector: 'app-chat-workspace-message',
	imports: [TimeAgoPipe, AvatarCircleComponent],
	templateUrl: './chat-workspace-message.component.html',
	styleUrl: './chat-workspace-message.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatWorkspaceMessageComponent {
	message = input.required<Message>()

	@HostBinding('class.is-mine')
	get isMine() {
		return this.message().isMine
	}

	formatShortTime(dateString: string, locale: string = 'ru'): string {
		const date = DateTime.fromISO(dateString, { zone: 'utc' }).setZone(
			DateTime.local().zone
		)

		if (!date.isValid) {
			return ''
		}

		return date.setLocale(locale).toFormat('HH:mm')
	}
}

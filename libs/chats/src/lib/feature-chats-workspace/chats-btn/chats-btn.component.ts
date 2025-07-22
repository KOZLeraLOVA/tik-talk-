import { ChangeDetectionStrategy, Component, input } from '@angular/core'

import { LastMessageRes, Message } from '@tt/data-access'
import { AvatarCircleComponent } from '@tt/common-ui'
import { DateTime } from 'luxon'

@Component({
	selector: 'button[chats]',
	imports: [AvatarCircleComponent],
	templateUrl: './chats-btn.component.html',
	styleUrl: './chats-btn.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatsBtnComponent {
	chat = input<LastMessageRes>()
	message = input<Message>()
	someDate = new Date('24.06.2025')

	formatShortTime(dateString: string, locale: string = 'ru'): string {
		const date = DateTime.fromISO(dateString, { zone: 'utc' }).setZone(
			DateTime.local().zone
		)

		if (!date.isValid) {
			return ''
		}

		return date.setLocale(locale).toFormat('HH:mm')
	}

	formatFullDate(dateString: string, locale: string = 'ru'): string {
		const date = DateTime.fromISO(dateString, { zone: 'utc' }).setZone(
			DateTime.local().zone
		)
		if (!date.isValid) {
			return ''
		}

		return date.setLocale(locale).toFormat('dd.MM.yy')
	}

	getFormatDate(dateString: string, locale: string = 'ru'): string {
		const date = DateTime.fromISO(dateString, { zone: 'utc' })
			.setZone(DateTime.local().zone)
			.startOf('day')

		if (!date.isValid) return ''

		const today = DateTime.now().startOf('day')
		const chatDate = date.startOf('day')

		if (!chatDate.equals(today)) {
			return this.formatFullDate(dateString, locale)
		} else {
			return this.formatShortTime(dateString, locale)
		}
	}
}

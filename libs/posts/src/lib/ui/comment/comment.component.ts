import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { AvatarCircleComponent } from '../../../../../common-ui/src/lib/components/avatar-circle/avatar-circle.component'
import { DatePipe } from '@angular/common'
import { PostComment } from '../../../../../data-access/src/lib/posts/interfaces/post.interface'
import { DateTime } from 'luxon'

@Component({
	selector: 'app-comment',
	imports: [AvatarCircleComponent, DatePipe],
	templateUrl: './comment.component.html',
	styleUrl: './comment.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentComponent {
	comment = input<PostComment>()

	formatFullDate(dateString: string, locale: string = 'ru'): string {
		const date = DateTime.fromISO(dateString, { zone: 'utc' }).setZone(
			DateTime.local().zone
		)
		if (!date.isValid) {
			return ''
		}

		return date.setLocale(locale).toFormat('HH:mm dd.MM.yy')
	}
}

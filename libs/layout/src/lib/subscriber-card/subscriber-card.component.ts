import { ChangeDetectionStrategy, Component, Input } from '@angular/core'

import { ImgUrlPipe } from '../../../../common-ui/src/lib/pipes/img-url.pipe'
import { Profile } from '../../../../data-access/src/lib/profile/interfaces/profile.interface'

@Component({
	selector: 'app-subscriber-card',
	imports: [ImgUrlPipe],
	templateUrl: './subscriber-card.component.html',
	styleUrl: './subscriber-card.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubscriberCardComponent {
	@Input() profile!: Profile
}

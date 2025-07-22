import { ChangeDetectionStrategy, Component, input } from '@angular/core'

import { ImgUrlPipe } from '../../../../../common-ui/src/lib/pipes'
import { AvatarCircleComponent } from '../../../../../common-ui/src/lib/components'
import { Profile } from '../../../../../data-access/src/lib/profile/interfaces/profile.interface'

@Component({
	selector: 'app-profile-header',
	standalone: true,
	imports: [ImgUrlPipe, AvatarCircleComponent],
	templateUrl: './profile-header.component.html',
	styleUrl: './profile-header.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileHeaderComponent {
	profile = input<Profile>()
}

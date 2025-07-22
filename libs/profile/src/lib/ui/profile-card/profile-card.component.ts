import {
	ChangeDetectionStrategy,
	Component,
	inject,
	Input
} from '@angular/core'
import { ImgUrlPipe } from '../../../../../common-ui/src/lib/pipes/img-url.pipe'
import { ActivatedRoute, Router } from '@angular/router'
import { toObservable } from '@angular/core/rxjs-interop'
import { ProfileService } from '@tt/data-access'
import { Profile } from '../../../../../data-access/src/lib/profile/interfaces/profile.interface'

@Component({
	selector: 'app-profile-card',
	imports: [ImgUrlPipe],
	templateUrl: './profile-card.component.html',
	styleUrl: './profile-card.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileCardComponent {
	@Input() profile!: Profile
	route = inject(ActivatedRoute)
	router = inject(Router)
	profileService = inject(ProfileService)
	me$ = toObservable(this.profileService.me)

	async sendMessage(userId: number) {
		this.router.navigate(['/chats', 'new'], { queryParams: { userId } })
	}
}

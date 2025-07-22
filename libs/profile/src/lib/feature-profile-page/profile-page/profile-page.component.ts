import {
	ChangeDetectionStrategy,
	Component,
	inject,
	signal
} from '@angular/core'
import { AsyncPipe } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router'
import { switchMap } from 'rxjs'
import { toObservable } from '@angular/core/rxjs-interop'
import { RouterLink } from '@angular/router'
import { ImgUrlPipe } from '../../../../../common-ui/src/lib/pipes/img-url.pipe'
import { PostFeedComponent } from '../../../../../posts/src/lib/feature-posts-wall/post-feed/post-feed.component'
import { ProfileHeaderComponent } from '../../ui/profile-header/profile-header.component'
import { ProfileService } from '@tt/data-access'

@Component({
	selector: 'app-profile-page',
	imports: [
		ProfileHeaderComponent,
		AsyncPipe,
		RouterLink,
		ImgUrlPipe,
		PostFeedComponent
	],
	templateUrl: './profile-page.component.html',
	styleUrl: './profile-page.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfilePageComponent {
	profileService = inject(ProfileService)

	route = inject(ActivatedRoute)
	router = inject(Router)

	me$ = toObservable(this.profileService.me)
	subscribers$ = this.profileService.getSubscribersShortList(5)

	isMyPage = signal(false)

	profile$ = this.route.params.pipe(
		switchMap(({ id }) => {
			this.isMyPage.set(id === 'me' || id === this.profileService.me()?.id)
			if (id === 'me') return this.me$

			return this.profileService.getAccount(id)
		})
	)

	async sendMessage(userId: number) {
		this.router.navigate(['/chats', 'new'], { queryParams: { userId } })
	}
}

import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	HostListener,
	inject,
	Renderer2
} from '@angular/core'
import { fromEvent } from 'rxjs'
import { ProfileCardComponent } from '../../ui/profile-card/profile-card.component'
import { ProfileFiltersComponent } from '../profile-filters/profile-filters.component'
import { Store } from '@ngrx/store'
import { profileActions, selectFilteredProfiles } from '@tt/data-access'
import { InfiniteScrollTriggerComponent } from '../../../../../common-ui/src/lib/components/ infinite-scroll-trigger/infinite-scroll-trigger.component'

@Component({
	selector: 'app-search-page',
	imports: [
		ProfileCardComponent,
		ProfileFiltersComponent,
		InfiniteScrollTriggerComponent
	],
	templateUrl: './search-page.component.html',
	styleUrl: './search-page.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchPageComponent {
	store = inject(Store)

	profiles = this.store.selectSignal(selectFilteredProfiles)
	hostElement = inject(ElementRef)
	r2 = inject(Renderer2)

	timeToFetch() {
		this.store.dispatch(profileActions.setPage({}))
	}

	@HostListener('window:resize')
	onWindowResize() {
		this.resizeFeed()
	}

	ngAfterViewInit() {
		this.resizeFeed()

		fromEvent(window, 'resize').subscribe(() => {
			console.log(12345)
		})
	}

	resizeFeed() {
		const { top } = this.hostElement.nativeElement.getBoundingClientRect()

		const height = window.innerHeight - top - 24 - 24
		this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`)
	}
}

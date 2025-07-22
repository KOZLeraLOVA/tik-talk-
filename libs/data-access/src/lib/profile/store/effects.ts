import { Injectable, inject } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { profileActions } from './actions'
import { map, switchMap, withLatestFrom } from 'rxjs'
import {
	ProfileService,
	selectProfileFilters,
	selectProfilePageble
} from '@tt/data-access'
import { Store } from '@ngrx/store'

@Injectable({
	providedIn: 'root'
})
export class ProfileEffects {
	profileService = inject(ProfileService)
	actions$ = inject(Actions)
	store = inject(Store)

	filterProfiles = createEffect(() => {
		return this.actions$.pipe(
			ofType(profileActions.filterEvents, profileActions.setPage),
			withLatestFrom(
				this.store.select(selectProfileFilters),
				this.store.select(selectProfilePageble)
			),
			switchMap(([_, filters, pageable]) => {
				return this.profileService.filterProfiles({
					...pageable,
					...filters
				})
			}),
			map((res) => profileActions.profilesLoaded({ profiles: res.items }))
		)
	})
}

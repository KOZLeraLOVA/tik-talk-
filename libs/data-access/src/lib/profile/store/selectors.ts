import { createSelector } from '@ngrx/store'
import { profileFeature } from './reducer'
import { Profile } from '../interfaces/profile.interface'

export const selectFilteredProfiles = createSelector(
	profileFeature.selectProfiles,
	(profiles) => profiles
)

export const filtersSelector = createSelector(
	profileFeature.selectProfileFeatureState,
	(profileFilters) => profileFilters
)

export const selectedMeProfile = createSelector(
	profileFeature.selectMe,
	(me: Profile | null) => me
)

// export const selectedProfileId = createSelector(
// 	profileFeature.selectProfileId,
// 	(profileId: Profile | null) => profileId
// )

export const selectProfilePageble = createSelector(
	profileFeature.selectProfileFeatureState,
	(state) => {
		return {
			page: state.page,
			size: state.size
		}
	}
)

export const selectProfileFilters = createSelector(
	profileFeature.selectProfileFilters,
	(filters) => filters
)

export const selectedSubscribersShortList = createSelector(
	profileFeature.selectSubscribersShortList,
	(subscribers) => {
		return subscribers
	}
)

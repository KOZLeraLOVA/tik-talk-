import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { DadataSuggestion } from '../interfaces/dadata.interface'
import { map } from 'rxjs'

@Injectable({
	providedIn: 'root'
})
export class DadataService {
	#apiUrl =
		'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address'
	#http = inject(HttpClient)
	#DADATA_TOKEN = '239a9918edd67a682956cc61ebe267b530a59c4e'

	getSuggestion(query: string) {
		console.log('Token: ', this.#DADATA_TOKEN)

		return this.#http
			.post<{ suggestions: DadataSuggestion[] }>(
				this.#apiUrl,
				{ query },
				{
					headers: {
						Authorization: `Token ${this.#DADATA_TOKEN}`
					}
				}
			)
			.pipe(
				map((res) => {
					return res.suggestions
					// return Array.from(
					// 	new Set(
					// 		res.suggestions.map((suggestion: DadataSuggestion) => {
					// 			return suggestion.data.city
					// 		})
					// 	)
					// )
				})
			)
	}
}

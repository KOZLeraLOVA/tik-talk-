import {
	ChangeDetectionStrategy,
	Component,
	forwardRef,
	inject,
	signal
} from '@angular/core'
import { CommonModule } from '@angular/common'
import {
	ControlValueAccessor,
	FormControl,
	NG_VALUE_ACCESSOR,
	ReactiveFormsModule
} from '@angular/forms'
import { TtInputComponent } from '../tt-input/tt-input.component'
import { DadataService } from '../../data/services/dadata.service'
import { debounceTime, switchMap, tap } from 'rxjs'

@Component({
	selector: 'tt-address-input',
	standalone: true,
	imports: [CommonModule, TtInputComponent, ReactiveFormsModule],
	templateUrl: './address-input.component.html',
	styleUrl: './address-input.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			multi: true,
			useExisting: forwardRef(() => AddressInputComponent)
		}
	]
})
export class AddressInputComponent implements ControlValueAccessor {
	innerSearchControl = new FormControl()
	#dadataService = inject(DadataService)

	isDropdownOpened = signal<boolean>(true)

	suggestions$ = this.innerSearchControl.valueChanges.pipe(
		debounceTime(500),
		switchMap((val) => {
			return this.#dadataService.getSuggestion(val).pipe(
				tap((res) => {
					this.isDropdownOpened.set(!!res.length)
				})
			)
		})
	)

	writeValue(city: string | null): void {
		this.innerSearchControl.patchValue(city, {
			emitEvent: false
		})
	}

	setDisabledState?(isDisabled: boolean): void {}

	registerOnChange(fn: any): void {
		this.onChange = fn
	}
	registerOnTouched(fn: any): void {
		this.onTouched = fn
	}

	onChange(value: any): void {}
	onTouched() {}

	onSuggestionPick(city: string) {
		this.isDropdownOpened.set(false)
		this.innerSearchControl.patchValue(city, {
			emitEvent: false
		})
		this.onChange(city)
	}
}

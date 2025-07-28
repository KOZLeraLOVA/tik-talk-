import {
	ChangeDetectionStrategy,
	Component,
	forwardRef,
	inject,
	signal,
	Input
} from '@angular/core'
import { CommonModule } from '@angular/common'
import {
	ControlValueAccessor,
	FormControl,
	FormGroup,
	NG_VALUE_ACCESSOR,
	ReactiveFormsModule
} from '@angular/forms'
import { TtInputComponent } from '../tt-input/tt-input.component'
import { DadataService } from '../../data/services/dadata.service'
import { debounceTime, switchMap, tap } from 'rxjs'
import { DadataSuggestion } from '../../data/interfaces/dadata.interface'

@Component({
	selector: 'tt-address-experiment',
	standalone: true,
	imports: [CommonModule, TtInputComponent, ReactiveFormsModule],
	templateUrl: './address-experiment.component.html',
	styleUrl: './address-experiment.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			multi: true,
			useExisting: forwardRef(() => AddressExperimentComponent)
		}
	]
})
export class AddressExperimentComponent implements ControlValueAccessor {
	@Input() formGroup!: FormGroup
	innerSearchControl = new FormControl()
	#dadataService = inject(DadataService)

	isDropdownOpened = signal<boolean>(true)

	// addressForm = new FormGroup({
	// 	city: new FormControl(''),
	// 	street: new FormControl(''),
	// 	building: new FormControl(''),
	// 	apartment: new FormControl('')
	// })

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

	onSuggestionPick(suggest: DadataSuggestion) {
		this.isDropdownOpened.set(false)
		// this.innerSearchControl.patchValue(city, {
		// 	emitEvent: false
		// })
		// this.onChange(city)

		this.formGroup.patchValue({
			city: suggest.data.city,
			street: suggest.data.street,
			building: suggest.data.house
		})
	}
}

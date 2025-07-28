import {
	ChangeDetectionStrategy,
	Component,
	inject,
	ViewEncapsulation
} from '@angular/core'
import {
	ReactiveFormsModule,
	FormGroup,
	FormControl,
	Validators,
	FormArray,
	FormRecord,
	ValidatorFn,
	AbstractControl
} from '@angular/forms'
import { CommonModule } from '@angular/common'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { Feature, MockService } from '../mock.service'
import { NameValidator } from './name.validator'
import {
	AddressExperimentComponent,
	StackExperimentComponent
} from '../../../../../../../libs/common-ui/src'

enum ReceiverType {
	PERSON = 'PERSON',
	LEGAL = 'LEGAL'
}

enum ModelBag {
	Big = 'Big',
	Standart = 'Standart',
	Mini = 'Mini',
	Small = 'Small'
}

enum MaterialBag {
	Jeans = 'Jeans',
	EcoSuede = 'EcoSuede'
}

enum ColorBag {
	Yellow = 'Yellow',
	Pink = 'Pink',
	Blue = 'Blue',
	Orange = 'Orange',
	White = 'White',
	Black = 'Black',
	Green = 'Green'
}

interface Address {
	city?: string
	street?: string
	building?: number
	apartment?: number
}

function getAddressForm(initialValue: Address = {}) {
	return new FormGroup({
		city: new FormControl<string>(initialValue.city ?? ''),
		street: new FormControl<string>(initialValue.street ?? ''),
		building: new FormControl<number | null>(initialValue.building ?? null),
		apartment: new FormControl<number | null>(null)
	})
}

function validateStartWith(forbiddenLetter: string): ValidatorFn {
	return (control: AbstractControl) => {
		return control.value.startsWith(forbiddenLetter)
			? {
					startsWith: {
						message: `${forbiddenLetter} - последняя буква алфавита!`
					}
				}
			: null
	}
}

function validateDateRange({
	fromControlName,
	toControlName
}: {
	fromControlName: string
	toControlName: string
}) {
	return (control: AbstractControl) => {
		const fromControl = control.get(fromControlName)
		const toControl = control.get(toControlName)

		if (!fromControl || !toControl) return null

		const fromDate = new Date(fromControl.value)
		const toDate = new Date(toControl.value)

		return fromDate && toDate && fromDate > toDate
			? {
					dateRange: { message: 'Дата начала не может быть позднее даты конца' }
				}
			: null
	}
}

@Component({
	selector: 'app-forms-experiment',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		AddressExperimentComponent,
		StackExperimentComponent
	],
	templateUrl: './forms-experiment.component.html',
	styleUrl: './forms-experiment.component.scss',
	encapsulation: ViewEncapsulation.None
})
export class FormsExperimentComponent {
	ReceiverType = ReceiverType
	ModelBag = ModelBag
	MaterialBag = MaterialBag
	ColorBag = ColorBag

	mockService = inject(MockService)
	nameValidator = inject(NameValidator)
	features: Feature[] = []

	form = new FormGroup({
		type: new FormControl<ReceiverType>(ReceiverType.PERSON),
		name: new FormControl<string>('', {
			validators: [Validators.required],
			asyncValidators: [this.nameValidator.validate.bind(this.nameValidator)],
			updateOn: 'blur'
		}),
		inn: new FormControl<string>(''),
		lastName: new FormControl<string>(''),
		addresses: new FormArray([getAddressForm()]),
		feature: new FormRecord({}),
		stack: new FormControl<string>(''),
		model: new FormControl<ModelBag>(ModelBag.Big),
		material: new FormControl<MaterialBag>(MaterialBag.Jeans),
		color: new FormControl<ColorBag>(ColorBag.Yellow),
		dateRange: new FormGroup(
			{
				from: new FormControl<string>(''),
				to: new FormControl<string>('')
			},
			validateDateRange({ fromControlName: 'from', toControlName: 'to' })
		)
	})

	constructor() {
		this.mockService
			.getAddresses()
			.pipe(takeUntilDestroyed())
			.subscribe((addrs) => {
				//while (this.form.controls.addresses.controls.length > 0) {
				//this.form.controls.addresses.removeAt(0)
				//}

				this.form.controls.addresses.clear()

				for (const addr of addrs) {
					this.form.controls.addresses.push(getAddressForm(addr))
				}

				//this.form.controls.addresses.setControl(1, getAddressForm(addrs[0]))
				//console.log(this.form.controls.addresses.at(0))
			})

		this.mockService
			.getFeatures()
			.pipe(takeUntilDestroyed())
			.subscribe((features) => {
				this.features = features

				for (const feature of features) {
					this.form.controls.feature.addControl(
						feature.code,
						new FormControl(feature.value)
					)
				}
			})

		this.form.controls.type.valueChanges
			.pipe(takeUntilDestroyed())
			.subscribe((val) => {
				this.form.controls.inn.clearValidators()

				if (val === ReceiverType.LEGAL) {
					this.form.controls.inn.setValidators([
						Validators.required,
						Validators.minLength(10),
						Validators.maxLength(10)
					])
				}
			})
	}

	onSubmit(event: SubmitEvent) {
		this.form.markAllAsTouched()
		this.form.updateValueAndValidity()

		if (this.form.invalid) return

		console.log(this.form.valid)
		console.log(this.form.value)
	}

	addAddress() {
		this.form.controls.addresses.insert(0, getAddressForm())
	}

	deleteAddress(index: number) {
		this.form.controls.addresses.removeAt(index, { emitEvent: false })
	}

	sort = () => 0
}

import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	forwardRef,
	inject,
	Input,
	input
} from '@angular/core'
import { CommonModule } from '@angular/common'
import {
	ControlValueAccessor,
	FormsModule,
	NG_VALUE_ACCESSOR,
	ReactiveFormsModule
} from '@angular/forms'

@Component({
	selector: 'app-tt-input',
	imports: [CommonModule, ReactiveFormsModule, FormsModule],
	standalone: true,
	templateUrl: './tt-input.component.html',
	styleUrl: './tt-input.component.scss',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => TtInputComponent),
			multi: true
		}
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TtInputComponent implements ControlValueAccessor {
	type = input<'text' | 'password'>('text')
	placeholder = input<string>()

	cdr = inject(ChangeDetectorRef)

	innerInput = ''

	@Input() isButton = true

	onChange(value: any): void {}
	onTouched(): void {}

	value: string | null = null

	writeValue(obj: any): void {
		this.value = obj
		this.cdr.markForCheck()
	}

	registerOnChange(fn: any): void {
		this.onChange = fn
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn
	}

	onModelChange(event: Event): void {
		const value = (event.target as HTMLInputElement).value
		this.value = value
		this.onChange(value)
	}
}

import { ChangeDetectionStrategy, Component, Input } from '@angular/core'

@Component({
	selector: 'svg[icon]',
	imports: [],
	template: '<svg:use [attr.href]="href"></svg:use>',
	styles: [''],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SvgIconComponent {
	@Input() icon = ''

	get href() {
		return `/assets/svg/${this.icon}.svg#${this.icon}`
	}
}

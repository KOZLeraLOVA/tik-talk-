import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	inject,
	Output,
	Renderer2
} from '@angular/core'
import { NgIf } from '@angular/common'
import { SvgIconComponent } from '../../../../../common-ui/src/lib/components'
import { AvatarCircleComponent } from '../../../../../common-ui/src/lib/components'
import { FormsModule } from '@angular/forms'
import { Store } from '@ngrx/store'
import { ProfileService } from '@tt/data-access'

@Component({
	selector: 'app-message-input',
	imports: [NgIf, SvgIconComponent, FormsModule, AvatarCircleComponent],
	standalone: true,
	templateUrl: './message-input.component.html',
	styleUrl: './message-input.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageInputComponent {
	r2 = inject(Renderer2)
	me = inject(ProfileService).me
	store = inject(Store)

	@Output() createdMess = new EventEmitter<string>()

	textMessage = ''

	onTextAreaInput(event: Event) {
		const textarea = event.target as HTMLTextAreaElement

		this.r2.setStyle(textarea, 'height', 'auto')
		this.r2.setStyle(textarea, 'height', textarea.scrollHeight + 'px')
	}

	onClick() {
		if (!this.textMessage) return

		this.createdMess.emit(this.textMessage)
		this.textMessage = ''
		return
	}
}

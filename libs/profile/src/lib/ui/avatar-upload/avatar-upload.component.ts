import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { SvgIconComponent } from '../../../../../common-ui/src/lib/components'

import { FormsModule } from '@angular/forms'
import { DndDirective } from '../../../../../common-ui/src/lib/directives/dnd.directive'

@Component({
	selector: 'app-avatar-upload',
	imports: [SvgIconComponent, DndDirective, FormsModule],
	templateUrl: './avatar-upload.component.html',
	styleUrl: './avatar-upload.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvatarUploadComponent {
	preview = signal<string>('/assets/imgs/avatar-placeholder.png')

	avatar: File | null = null

	fileBrowserHandler(event: Event) {
		const file = (event.target as HTMLInputElement)?.files?.[0]
		this.processFile(file)
	}
	onFileDroped(file: File) {
		this.processFile(file)
	}

	processFile(file: File | null | undefined) {
		if (!file || !file.type.match('image')) return

		const reader = new FileReader()

		reader.onload = (event) => {
			this.preview.set(event.target?.result?.toString() ?? '')
		}
		reader.readAsDataURL(file)
		this.avatar = file
	}
}

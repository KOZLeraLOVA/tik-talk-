import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { AvatarCircleComponent } from '../../../../../common-ui/src/lib/components/avatar-circle/avatar-circle.component'
import { Profile } from '../../../../../data-access/src/lib/profile/interfaces/profile.interface'

@Component({
	selector: 'app-chat-workspace-header',
	imports: [AvatarCircleComponent],
	templateUrl: './chat-workspace-header.component.html',
	styleUrl: './chat-workspace-header.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatWorkspaceHeaderComponent {
	profile = input.required<Profile>()
}

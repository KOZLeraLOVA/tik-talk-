import {
	ChangeDetectionStrategy,
	Component,
	inject,
	OnInit
} from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { ChatsListComponent } from '../chats-list/chats-list.component'
import { ChatsService } from '../../../../../data-access/src/lib/chats/services/chats.service'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
@Component({
	selector: 'app-chats',
	imports: [RouterOutlet, ChatsListComponent],
	templateUrl: './chats.component.html',
	styleUrl: './chats.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatsPageComponent {
	#chatService = inject(ChatsService)

	constructor() {
		this.#chatService.connectWS().pipe(takeUntilDestroyed()).subscribe()
	}

	// ngOnInit() {
	// 	this.#chatService.connectWS()
	// }
}

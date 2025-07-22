import { CommonModule } from '@angular/common'
import {
	ChangeDetectionStrategy,
	Component,
	OnInit,
	output
} from '@angular/core'


@Component({
	selector: 'tt-infinite-scroll-trigger',
	imports: [CommonModule],
	templateUrl: './infinite-scroll-trigger.component.html',
	styleUrl: './infinite-scroll-trigger.component.scss'
})
export class InfiniteScrollTriggerComponent implements OnInit {
	loaded = output<void>()
	ngOnInit() {
		this.loaded.emit()
	}
}

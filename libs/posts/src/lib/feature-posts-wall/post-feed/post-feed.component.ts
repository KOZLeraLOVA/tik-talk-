import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	HostListener,
	inject,
	Input,
	OnInit,
	Renderer2
} from '@angular/core'
import { PostInputComponent } from '../../ui/post-input/post-input.component'
import { PostComponent } from '../post/post.component'
import { firstValueFrom, fromEvent } from 'rxjs'
import { Store } from '@ngrx/store'
import { selectAllPosts } from '../../data/store/posts.selectors'
import { postActions } from '../../data/store/posts.actions'
import { PostService } from 'libs/data-access/src/lib/posts/services/post.service'
import { GlobalStoreService, selectedMeProfile } from '@tt/data-access'

@Component({
	selector: 'app-post-feed',
	standalone: true,
	imports: [PostInputComponent, PostComponent],
	templateUrl: './post-feed.component.html',
	styleUrl: './post-feed.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostFeedComponent {
	//profile!: Profile
	hostElement = inject(ElementRef)
	r2 = inject(Renderer2)
	postService = inject(PostService)

	store = inject(Store)
	profile = inject(GlobalStoreService).me
	feed = this.store.selectSignal(selectAllPosts)
	me = this.store.selectSignal(selectedMeProfile)

	@Input() isCommentInput = false
	@Input() postId: number = 0

	@HostListener('window:resize')
	onWindowResize() {
		this.resizeFeed()
	}

	ngOnInit() {
		this.store.dispatch(postActions.fetchPosts({}))
	}

	// constructor() {
	// 	this.loadPosts()
	// }

	onCreatePost(postText: any) {
		this.store.dispatch(
			postActions.createPost({
				payload: {
					title: 'Клевый пост',
					content: postText.content,
					authorId: this.profile()!.id
				}
			})
		)
	}

	// 	if (!postText) return
	//
	// 	this.store.dispatch(
	// 		postActions.createPost({
	// 			payload: {
	// 				title: 'Клевый пост',
	// 				content: postText,
	// 				authorId: this.profile()!.id
	// 			}
	// 		})
	// 	)
	// }

	ngAfterViewInit() {
		this.resizeFeed()

		fromEvent(window, 'resize').subscribe(() => {
			console.log(12345)
		})
	}

	resizeFeed() {
		const { top } = this.hostElement.nativeElement.getBoundingClientRect()

		const height = window.innerHeight - top - 24 - 24
		this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`)
	}
}

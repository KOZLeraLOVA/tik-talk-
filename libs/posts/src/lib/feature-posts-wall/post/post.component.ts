import {
	ChangeDetectionStrategy,
	Component,
	computed,
	inject,
	input,
	OnInit,
	Signal
} from '@angular/core'
import {
	CommentCreateDto,
	Post,
	PostComment
} from '../../../../../data-access/src/lib/posts/interfaces/post.interface'
import { TimeAgoPipe } from '../../../../../common-ui/src/lib/pipes/time-ago.pipe'
import { SvgIconComponent } from '../../../../../common-ui/src/lib/components/svg-icon/svg-icon.component'
import { AvatarCircleComponent } from '../../../../../common-ui/src/lib/components/avatar-circle/avatar-circle.component'
import { DatePipe } from '@angular/common'
import { CommentComponent, PostInputComponent } from '../../ui'
import { Store } from '@ngrx/store'
import {
	selectAllPosts,
	selectCommentsByPostId
} from '../../data/store/posts.selectors'
import { postActions } from '../../data/store/posts.actions'

import { GlobalStoreService } from '@tt/data-access'
import { Profile } from '../../../../../data-access/src/lib/profile/interfaces/profile.interface'

@Component({
	selector: 'app-post',
	imports: [
		AvatarCircleComponent,
		DatePipe,
		SvgIconComponent,
		PostInputComponent,
		CommentComponent,
		TimeAgoPipe
	],
	templateUrl: './post.component.html',
	styleUrl: './post.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostComponent implements OnInit {
	post = input<Post>()
	//comments = input<PostComment[]>()
	me = input<Profile>()
	profile = inject(GlobalStoreService).me

	comments!: Signal<PostComment[]>

	store = inject(Store)

	//feed: Signal<Post[]> = this.store.selectSignal(selectAllPosts)

	// 	onCreated(comment: CommentCreateDto) {
	// 		this.store.dispatch(postActions.createComment({ comment: comment }))
	// 	}
	// }

	comments2 = computed(() => {
		if (this.comments()?.length > 0) {
			return this.comments()
		}
		return this.post()?.comments
	})

	async ngOnInit() {
		// 	//подписываемся на посты и коментарии из стора
		this.store.dispatch(postActions.fetchPosts({}))

		this.comments = this.store.selectSignal(
			selectCommentsByPostId(this.post()!.id)
		)

		this.store.dispatch(postActions.fetchComments({ postId: this.post()!.id }))
		//this.comments.set(this.post()!.comments)
	}

	onCreated(commentText: any) {
		console.log(commentText)
		if (!commentText) return

		this.store.dispatch(
			postActions.createComment({
				payload: {
					text: commentText.text,
					authorId: this.profile()!.id,
					postId: this.post()!.id
				}
			})
		)
	}
}

const now = new Date()
const formattedDate = now.toLocaleString('en-US', { dateStyle: 'short' })

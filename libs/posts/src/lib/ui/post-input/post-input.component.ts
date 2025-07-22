import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	HostBinding,
	inject,
	input,
	Output,
	Renderer2
} from '@angular/core'
import {
	AvatarCircleComponent,
	SvgIconComponent
} from '../../../../../common-ui/src/lib/components'
import { NgIf } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { Store } from '@ngrx/store'
import {
	CommentCreateDto,
	PostCreateDto
} from '../../../../../data-access/src/lib/posts/interfaces/post.interface'

import { GlobalStoreService } from '../../../../../data-access/src/lib/shared/service/global-store.service'

@Component({
	selector: 'app-post-input',
	standalone: true,
	imports: [AvatarCircleComponent, NgIf, SvgIconComponent, FormsModule],
	templateUrl: './post-input.component.html',
	styleUrl: './post-input.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostInputComponent {
	r2 = inject(Renderer2)

	store = inject(Store)

	isCommentInput = input(false)
	postId = input<number>(0)
	profile = inject(GlobalStoreService).me
	//profile = input<Profile>()

	@Output() createPost = new EventEmitter<PostCreateDto>()
	@Output() createComment = new EventEmitter<CommentCreateDto>()

	@HostBinding('class.comment')
	get isComment() {
		return {
			comment: this.isCommentInput()
		}
	}

	postText = ''

	onTextAreaInput(event: Event) {
		const textarea = event.target as HTMLTextAreaElement

		this.r2.setStyle(textarea, 'height', 'auto')
		this.r2.setStyle(textarea, 'height', textarea.scrollHeight + 'px')
	}

	onCreatePost() {
		if (!this.postText) return
		console.log(this.postText)
		if (this.isCommentInput()) {
			this.createComment.emit({
				text: this.postText,
				authorId: this.profile()!.id,
				postId: this.postId()
			})
			this.postText = ''
			return
		}

		this.createPost.emit({
			title: 'Клевый пост',
			content: this.postText,
			authorId: this.profile()!.id
		})
		this.postText = ''
		return
	}
}

// 	onClick(postText: string) {
// 		if (!postText) return
//
// 		this.store.dispatch(
// 			postActions.createPost({
// 				payload: {
// 					title: 'Клевый пост',
// 					content: postText,
// 					authorId: this.profile()!.id
// 				}
// 			})
// 		)
// 	}
// }

// onClick() {
// 	if (!this.postText) return
//
// 	if (this.isCommentInput()) {
// 		this.createComment.emit({
// 			text: this.postText,
// 			authorId: this.profile()!.id,
// 			postId: this.postId()
// 		})
// 		this.postText = ''
// 		return
// 	}

// 		this.createPost.emit({
// 			title: 'Lalala',
// 			content: this.postText,
// 			authorId: this.profile()!.id
// 		})
// 		this.postText = ''
// 		return
// 	}
// }

//onCreatePost() {
//if (!this.postText) return

//if (this.isCommentInput()) {
//firstValueFrom(
//	this.postService.createComment({
//	text: this.postText,
//	authorId: this.profile()!.id,
//postId: this.postId()
//	})
//	).then(() => {
//	this.postText = ''
//	this.created.emit()
//	})
//	return
//}

//firstValueFrom(
//	this.postService.createPost({
//		title: 'Клевый пост',
//		content: this.postText,
//		authorId: this.profile()!.id
//	})
//	).then(() => {
//	this.postText = ''
//})
//}
//}

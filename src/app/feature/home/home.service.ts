import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { EMPTY, catchError, takeUntil } from 'rxjs';
import { ApiStatus } from 'src/app/shared/data-access-models/api-status';
import { Article } from '../../models/model';
import { destroyNotifier } from '../../shared/destroy/destroyNotifier';
import { FeedType } from './feed-toggle/feed-toggle.component';
@Injectable()
export class HomeService {
    #articles = signal<Article[]>([]);
    #status = signal<ApiStatus>('loading');
    #feedType = signal<FeedType>('GLOBAL');
    #selectTag = signal<string>('');
    #http = inject(HttpClient);
    destroyRef = destroyNotifier();

    articles = this.#articles.asReadonly();
    feedType = this.#feedType.asReadonly();
    status = this.#status.asReadonly();
    tag = this.#selectTag.asReadonly();

    getArticle(articleType: FeedType, tag?: string) {
        this.destroyRef.next();
        this.#status.set('loading');
        this.#feedType.set(articleType);
        this.#selectTag.set(tag || '');
        articleType !== 'FEED' ? this.globalArticles(tag) : this.favouriteFeed();
    }

    globalArticles(selecteTag?: string) {
        const params = (selecteTag && { params: { tag: selecteTag || '' } }) || undefined;
        this.#http
            .get<{ articles: Article[] }>('/articles', params)
            .pipe(
                takeUntil(this.destroyRef),
                catchError((error) => EMPTY)
            )
            .subscribe({
                next: ({ articles }: { articles: Article[] }) => {
                    this.#articles.set(articles);
                    this.#status.set('success');
                },
                error: () => {
                    this.#status.set('error');
                    this.#articles.set([]);
                }
            });
    }

    favouriteFeed() {
        this.#http
            .get<{ articles: Article[] }>('/articles/feed')
            .pipe(
                takeUntil(this.destroyRef),
                catchError((error) => EMPTY)
            )
            .subscribe({
                next: ({ articles }: { articles: Article[] }) => {
                    this.#articles.set(articles);
                    this.#status.set('success');
                },
                error: () => {
                    this.#status.set('error');
                    this.#articles.set([]);
                }
            });
    }
}

import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { takeUntil } from 'rxjs';
import { destroyNotifier } from 'src/app/shared/destroy/destroyNotifier';

@Injectable()
export class TagsServcie {
    #tags = signal<string[]>([]);
    tags = this.#tags.asReadonly();

    #http = inject(HttpClient);
    destory = destroyNotifier();
    getTags() {
        this.#http
            .get('/tags')
            .pipe(takeUntil(this.destory))
            .subscribe((response: any) => {
                console.log('tags -->', response);
                this.#tags.set(response.tags);
            });
    }
}
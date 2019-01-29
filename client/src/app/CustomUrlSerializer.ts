import { DefaultUrlSerializer, UrlSerializer, UrlTree } from '@angular/router';

export default class CustomUrlSerializer implements UrlSerializer {
    private _defaultUrlSerializer: DefaultUrlSerializer = new DefaultUrlSerializer();

    parse(url: string): UrlTree {
        // Encode parentheses
        // @see https://github.com/angular/angular/issues/4895
        // @see https://github.com/angular/angular/issues/10280
        url = url.replace(/\(/g, '%28').replace(/\)/g, '%29');
        // Use the default serializer.
        return this._defaultUrlSerializer.parse(url)
    }

    serialize(tree: UrlTree): string {
        return this._defaultUrlSerializer.serialize(tree).replace(/%28/g, '(').replace(/%29/g, ')');
    }
}

import _ from 'lodash';

class Search {
    constructor(items, indexFields) {
        this.items = items || [];
        this.indexFields = indexFields || [];

        this.haystack = this.items.map(
            (item, index) => {
                const indexed = {
                    ...item,
                    __search_data_index__: index
                };
                for (const field of this.indexFields) {
                    if (item.hasOwnProperty(field)) {
                        indexed[field] = _.deburr(item[field]);
                    } else {
                        indexed[field] = '';
                    }
                }
                return indexed;
            }
        );
    }

    tokenize = (query) => query
        .split(/\s+/)
        .map(
            (rawToken) => rawToken && rawToken.length && {
                regex: new RegExp(_.escapeRegExp(rawToken), 'i'),
                string: rawToken
            }
        ).filter((token) => !!token);

    /**
     * Searches the items for a given query/needle
     * @param needle Query string for search
     * @param options Options for search. e.g., {
     *     fields: ['title'],
     *     sort: [{
     *         field: 'title',
     *         weight: 0 - 100,
     *         direction: 'asc' | 'desc'
     *     }],
     *     cutoff: 0.25
     * }
     */
    search = (needle = '', options = {
        fields: [],
        sort: [],
        cutoff: 0.25,
    }) => {
        const weights = Array(this.haystack.length).fill(0);
        const safeSort = [...options.sort].filter((opt) => opt.field && opt.direction && opt.weight);
        safeSort.forEach((sort) => {
            if (sort.weight !== 0) {
                const sorted = [...this.haystack];
                sorted.sort((a, b) => {
                    const x = '' + (a[sort.field] || '');
                    const y = '' + (b[sort.field] || '');

                    return x.localeCompare(y, 'en', {
                        sensitivity: 'base',
                        ignorePunctuation: 'true',
                        numeric: false
                    }) * (sort.direction === 'asc' ? 1 : -1);
                });

                sorted.forEach((item, sortIndex) => {
                    weights[item.__search_data_index__] += ((this.haystack.length - sortIndex) / this.haystack.length) * sort.weight;
                });
            }
        });

        const tokens = this.tokenize(needle);
        this.haystack.forEach((item) => {
            let weight = 0;
            for (const field of options.fields) {
                for (const token of tokens) {
                    const value = '' + (item[field] || '');
                    const pos = value.search(token.regex);
                    let moreWeight = 0;
                    if (pos !== -1) {
                        moreWeight += (token.string.length * 2) / value.length;
                        if (pos === 0) moreWeight += 0.5;
                    }
                    weight += moreWeight;
                }
            }
            weights[item.__search_data_index__] += weight / options.fields.length;
        });

        let results = this.haystack.map(({ __search_data_index__ }) => ({
            id: __search_data_index__,
            weight: weights[__search_data_index__]
        })).sort((a, b) => b.weight - a.weight);

        if (needle.length) {
            results = results.filter((result) => result.weight > options.cutoff);
        }

        return {
            needle,
            options,
            tokens,
            items: results
        };
    };
}

export default Search;

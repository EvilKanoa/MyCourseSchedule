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
            (rawToken) => rawToken && rawToken.length && new RegExp(_.escapeRegExp(rawToken), 'ig')
        ).filter((token) => !!token);

    /**
     * Searches the items for a given query/needle
     * @param needle Query string for search
     * @param options Options for search. e.g., {
     *     fields: ['title', 'label'],
     *     weight: 0 - 100,
     *     sort: [{
     *         field: 'title',
     *         weight: 0 - 100,
     *         direction: 'asc' | 'desc'
     *     }]
     * }
     */
    search = (needle = '', options = {
        fields: ['label'],
        weight: 1,
        sort: [],
    }) => {
        const weights = Array(this.haystack.length).fill(0);
        const safeSort = [...options.sort].filter((opt) => opt.field && opt.direction && opt.weight);
        safeSort.forEach((sort) => {
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
        });

        const tokens = this.tokenize(needle);
        const maxMatches = options.fields.length * tokens.length;
        this.haystack.forEach((item) => {
            let matches = 0;
            for (const field of options.fields) {
                for (const token of tokens) {
                    matches += _.get((('' + item[field]) || '').match(token), 'length', 0);
                }
            }
            weights[item.__search_data_index__] += (matches / maxMatches) * options.weight;
        });

        const totalWeight = options.weight + safeSort.reduce((sum, { weight }) => sum + weight, 0);
        const results = this.haystack.map(({ __search_data_index__ }) => ({
            id: __search_data_index__,
            weight: weights[__search_data_index__] / totalWeight
        })).sort((a, b) => b.weight - a.weight);

        return {
            needle,
            options,
            tokens,
            items: results
        };
    };
}

export default Search;

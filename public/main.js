var app = new Vue({
    el: '#app',
    data: {
        quotes: [],
        newQuote: {
            name: '',
            quote: ''
        }
    },

    mounted: function () {
        this.getQuotes();
    },

    methods: {
        getQuotes: function () {
            axios('/quotes')
                .then(result => {
                    this.quotes = result.data;
                })
        },
        addQuote: function () {
            this.newQuote.name = this.newQuote.name.trim();
            this.newQuote.quote = this.newQuote.quote.trim();
            if (this.newQuote.name && this.newQuote.quote) {
                const data = this.newQuote;
                axios.post('/quotes', { data })
                    .then(result => {
                        this.getQuotes();
                    });
            }
        },
        updateQuote: function (quote) {
            quote.quote = quote.quote.trim();
            if (quote.quote) {
                const data = {
                    _id: quote['_id'],
                    quote: quote.quote
                };
                axios.put('/quotes', { data })
                    .then(result => {
                        this.getQuotes();
                    });
            }
        },
        deleteQuote: function (quote) {
            const data = { _id: quote['_id'] };
            axios.delete('/quotes', { data })
                .then(result => {
                    this.getQuotes();
                });
        }
    }
});
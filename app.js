new Vue({
    el: '#app',
    data: {
        currencies: {},
        amount: 0,
        from:'USD',
        to: 'AUD',
        result: 0,
        loading: false
    },
    mounted() {

        this.getCurrencies() 
    },

    computed: {
        formattedCurrencies() {
            //convert currencies from object to array
            return Object.values(this.currencies);

        },
        calculateResult() {
            return (Number(this.amount)* this.result).toFixed(3);
        },
        disabled() {
            return this.amount === 0 || !this.amount || this.loading;
        }
    },
    methods: {
        getCurrencies() {
            const currencies = localStorage.getItem('currencies')
            if(currencies) {
                this.currencies = JSON.parse(currencies);
                return;
            }
            axios.get('https://free.currencyconverterapi.com/api/v6/currencies')
                .then(response => {
                this.currencies = response.data.results;
                //As soon as we get the result from the api we save it in this currencies localStorage
                localStorage.setItem('currencies', JSON.stringify(response.data.results))
            });
        },
        convertCurrency() {
            const key = `${this.from}_${this.to}`;
            this.loading = true;
            axios.get(`https://free.currencyconverterapi.com/api/v6/convert?q=${key}`)
                .then(response => {
                console.log(response)
                this.loading = false;
                this.result = response.data.results[key].val

                //// this.currencies = response.data.results;
                // //As soon as we get the result from the api we save it in this currencies localStorage
                //// localStorage.setItem('currencies', JSON.stringify(response.data.results))
            })
        }
    },
    watch: {
        from() {
            this.result = 0;
        },
        to() {
            this.result = 0;
        }
    }
})





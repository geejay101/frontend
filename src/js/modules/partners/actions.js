module.exports = function(app, _module) {
    /**
    * @memberof module:partners
    * @namespace
    */
    let actions = {}

    let $t = Vue.i18n.translate


    /**
    * Delete a partner to the API, update the store and add a notification.
    * Route to the last route afterwards.
    * @param {Observable} partner - The partner store object.
    */
    actions.deletePartner = function(partner) {
        app.api.client.delete(`partners/${partner.id}/`).then((res) => {
            let partners = this.$store.partners.partners.results
            this.$store.partners.partners.results = partners.filter((i) => i.id !== partner.id)
            app.vm.$shout({message: $t('Partner {name} succesfully deleted', {name: partner.name})})
            app.router.push({name: 'list_partners'})
        })
    }


    /**
    * Read partner from the API and update the partner store object.
    * @param {String} partnerId - ID of the partner to read from the API.
    * @param {Boolean} formEndpoints - Include form data for selects.
    * @returns {Object} - All data related to the partner form.
    */
    actions.readPartner = async function(partnerId, formEndpoints = true) {
        let context = {}
        if (partnerId) {
            const res = await app.api.client.get(`partners/${partnerId}/`)
            context.partner = res.data
        } else {
            context.partner = _module.getObservables().partner
        }

        if (!formEndpoints) return context

        let [audio, countries, currencies, owners,
            priceplanDiscounts, system, timezones,
        ] = await Promise.all([
            app.api.client.get('partners/audio_languages/', {adapter: app.api.cachingAdapter}),
            app.api.client.get('partners/countries/', {adapter: app.api.cachingAdapter}),
            app.api.client.get('partners/currencies/', {adapter: app.api.cachingAdapter}),
            app.api.client.get('partners/owners/', {adapter: app.api.cachingAdapter}),
            app.api.client.get('partners/priceplan_discounts/', {adapter: app.api.cachingAdapter}),
            app.api.client.get('partners/system_languages/', {adapter: app.api.cachingAdapter}),
            app.api.client.get('partners/timezones/', {adapter: app.api.cachingAdapter}),
        ])

        Object.assign(context, {
            audioLanguages: audio.data,
            countries: countries.data,
            currencies: currencies.data,
            owners: owners.data.results,
            priceplanDiscounts: priceplanDiscounts.data,
            systemLanguages: system.data,
            timezones: timezones.data,
        })

        return context
    }


    /**
    * Read partners from the API. Used by the paginator component.
    * @param {Object} data - Context passed from the Paginator component.
    * @returns {Object} - Returns the partner object from the API endpoint.
    */
    actions.readPartners = async function({page}) {
        var partners = await app.api.client.get(`/partners/?page=${page}`)
        this.partners = partners.data
        return partners.data
    }


    /**
    * Delete a partner to the API, update the store and add a notification.
    * Route to the last route afterwards.
    * @param {Observable} partner - The partner object.
    */
    actions.upsertPartner = function(partner) {
        // Format the data that we are about to send to the API first.
        let payload = JSON.parse(JSON.stringify(partner))
        payload.owner = parseInt(partner.owner)
        if (partner.id) {
            app.api.client.put(`partners/${partner.id}/`, payload).then((res) => {
                app.vm.$shout({message: $t('Partner {name} succesfully updated', {name: partner.name})})
                app.router.push(app.utils.lastRoute('list_partners'))
            })
        } else {
            app.api.client.post('partners/', payload).then((res) => {
                app.vm.$shout({message: $t('Partner {name} succesfully created', {name: partner.name})})
                app.router.push(app.utils.lastRoute('list_partners'))
            })
        }
    }

    return actions
}

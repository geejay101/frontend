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
        let promises = []

        if (formEndpoints) {
            promises = [
                app.api.client.get('partners/audio_languages/', {adapter: app.api.cachingAdapter}),
                app.api.client.get('partners/countries/', {adapter: app.api.cachingAdapter}),
                app.api.client.get('partners/currencies/', {adapter: app.api.cachingAdapter}),
                app.api.client.get('partners/owners/', {adapter: app.api.cachingAdapter}),
                app.api.client.get('partners/priceplan_discounts/', {adapter: app.api.cachingAdapter}),
                app.api.client.get('partners/system_languages/', {adapter: app.api.cachingAdapter}),
                app.api.client.get('partners/timezones/', {adapter: app.api.cachingAdapter}),
            ]
        }

        if (partnerId) promises.push(app.api.client.get(`partners/${partnerId}/`))
        // Load all results in parallel.
        const res = await Promise.all(promises)

        Object.assign(context, {
            audioLanguages: res[0].data,
            countries: res[1].data,
            currencies: res[2].data,
            owners: res[3].data.results,
            priceplanDiscounts: res[4].data,
            systemLanguages: res[5].data,
            timezones: res[6].data,
        })

        if (partnerId) context.partner = res[7].data
        else context.partner = _module.getObservables().partner

        return context
    }


    /**
    * Read partners from the API. Used by the paginator component.
    * @param {Object} data - Context passed from the Paginator component.
    * @returns {Object} - Returns the partner object from the API endpoint.
    */
    actions.readPartners = async function({page}) {
        let {data: partners} = await app.api.client.get(`/partners/?page=${page}`)
        return partners
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

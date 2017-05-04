'use strict'

const Component = require('../../../lib/component')


class EditClientComponent extends Component {

    constructor(app) {
        super(app)
        this.template = app.templates.clients_edit_client

        // Mount state from the store to the component.
        this.computed = Vuex.mapState({
            client: state => state.clients.client,
        })
    }


    // Mount actions from the store to the component.
    mounted() {
        this.app.vuex.dispatch('clients/readClient', this.app.router.currentRoute.params.client_id)
    }
}


module.exports = EditClientComponent
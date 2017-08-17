module.exports = (app, actions) => {
    const template = app.templates.main_content_header

    return {
        methods: {
            logout: app.modules.users.actions.logout,
        },
        render: template.r,
        staticRenderFns: template.s,
        store: {
            user: 'user',
        },
    }
}

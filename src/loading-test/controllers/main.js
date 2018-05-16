$.get("main-page.html", function (_template) {
    vm = new Vue({
        el: '#app',
        template: _template,
        data: vue_data,
        created: vue_create
    });
});
    
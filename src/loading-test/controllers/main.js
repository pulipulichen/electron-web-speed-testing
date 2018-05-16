var vm = new Vue({
    el: '#app',
    template: require('./main-page.html'),
    data: {
        click_me: "Click me!",
        click_me_method: function () {
            ons.notification.alert('Hello World!');
            alert("a");
        }
    },
    methods: {
        click_me_method: function () {
            $ons.notification.alert('Hello World!');
            alert("b");
        }
    }
});
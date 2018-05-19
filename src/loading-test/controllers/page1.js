page1_data = {
    result: {
        a: 10
    }
};

page1_methods = {
    push() {
        console.log("push");
        page2_vm.data.result = page1_vm.data.result;
        this.$emit('push-page', page2_vm);
    }
};
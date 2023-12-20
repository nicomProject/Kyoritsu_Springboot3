$(function(){
    const Content = {
        params: {},
        load: function(params){
            this.params = params;
            this.event();
        },
        event: function(){
            $('.form-control').on({
                'focus': function(e){
                    $(this).parent().addClass('active');
                },
                'focusout': function(e){
                    $(this).parent().removeClass('active');
                }
            });

            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
            const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl)
            })
        }
    }

    Content.load();
})
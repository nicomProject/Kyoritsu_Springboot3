$(function () {
    const Content = {
        params: {},
        load: function (params) {
            var that = this;
            AjaxUtil.requestBody({
                url: '/api/job/findSelf',
                data: {
                    key: params.key
                },
                success: function (data) {
                    const jobObject = data.result.items[0];
                    that.setDetail(jobObject);
                },


            });
            this.event();
        },
        setDetail: function(items) {
            if (items.experience === "newcomer") {
                $('.title-container .apply-career').text("신입")
            }else if(items.experience === "career"){
                $('.title-container .apply-career').text("경력")
            }else{
                $('.title-container .apply-career').text("신입/경력")
            }

            if (items.category === "dormyinn") {
                $('.title-container .apply-title').text("[" + "도미인" + "]" + " " + items.title)
            }

            $('.content-default.content-all').html(items.content)
        },
        event: function () {

        $('.btn-notice').on('click', function (){
            window.location.href = '/recruit/apply'
        })

        }
    }

    Content.load({
        key: $('.param[name="key"]').val() || ''
    });
});
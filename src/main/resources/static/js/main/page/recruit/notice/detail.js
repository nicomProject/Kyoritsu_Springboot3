$(function () {
    var top = this;
    var jobObject = {};

    const Content = {
        params: {},
        supportHash: {},
        load: function (params) {
            const that = this;
            AjaxUtil.requestBody({
                url: '/api/job/findSelf',
                data: {
                    key: params.key
                },
                success: function (data) {
                    top.jobObject = data.result.items[0];
                    that.setDetail(top.jobObject);
                },
            });
            AjaxUtil.request({
                url: '/api/category/find',
                async: false,
                success: function (data) {
                    items = data.result.items;
                    console.log(items);
                    items.forEach(menu => {
                        that.supportHash[menu.recKey] = menu.categoryName;
                    });
                    console.log(that.supportHash);
                }
            });
            this.event();
        },
        setDetail: function(items) {
            const that = this;
            console.log(top.jobObject)
            if (items.experience === "newcomer") {
                $('.title-container .apply-career').text("신입")
            }else if(items.experience === "career"){
                $('.title-container .apply-career').text("경력")
            }

            if (items.fullTime === "fulltime") {
                $('.title-container .apply-fulltime').text("정규직")
            }else if(items.fullTime === "contract"){
                $('.title-container .apply-fulltime').text("계약직")
            }

            // 카테고리 & 지원분야 표시
            if (items.category == "dormyinn") {
                $('.title-container .apply-title').text("[" + "도미인 호텔" + "]" + " [" + that.supportHash[items.support] + "] " + items.title)
            }

            // 본문 표시
            $('.content-default.content-all').html(items.content)
        },
        event: function () {

        $('.btn-notice').on('click', function (){
            window.location.href = '/recruit/apply/' + (top.jobObject.recKey).toString()
        })

        }
    }

    Content.load({
        key: $('.param[name="key"]').val() || ''
    });
});
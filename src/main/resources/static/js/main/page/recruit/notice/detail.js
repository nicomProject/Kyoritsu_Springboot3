$(function () {
    var top = this;

    const Content = {
        supportHash: {}, // 현재 지원분야로 설정된 값들을 저장
        load: function (params) {
            const that = this;

            // 현재 공고에 대한 정보 요청
            AjaxUtil.requestBody({
                url: '/api/job/findSelf',
                data: {
                    key: params.key
                },
                success: function (data) {
                    top.jobObject = data.result.items[0];
                    // 공고 상세 내용 제작
                    that.setDetail(top.jobObject);
                },
            });

            // 현재 지원분야에 대한 정보 요청
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

            // event 등록
            this.event();
        },

        // 공고 상세 내용 제작
        setDetail: function(items) {
            const that = this;

            // 신입/경력 정보
            if (items.experience === "newcomer") {
                $('.title-container .apply-career').text("신입")
            }else if(items.experience === "career"){
                $('.title-container .apply-career').text("경력")
            }

            // 정규직/계약직 정보
            if (items.fullTime === "fulltime") {
                $('.title-container .apply-fulltime').text("정규직")
            }else if(items.fullTime === "contract"){
                $('.title-container .apply-fulltime').text("계약직")
            }

            // 카테고리 & 지원분야 정보
            if (items.category == "dormyinn") {
                $('.title-container .apply-title').text("[" + "도미인 호텔" + "]" + " [" + that.supportHash[items.support] + "] " + items.title)
            }

            // 본문 정보
            $('.content-default.content-all').html(items.content)
        },

        // 이벤트 등록
        event: function () {
            // 메뉴 버튼 이벤트 등록
            document.getElementById("btnEmployeeInfo").addEventListener("click", function() { window.location.href = '/recruit/employee_info'; });
            document.getElementById("btnInfo").addEventListener("click", function() { window.location.href = '/recruit/info'; });
            document.getElementById("btnNotice").addEventListener("click", function() { window.location.href = '/recruit/notice'; });
            document.getElementById("btnApply").addEventListener("click", function() { window.location.href = '/recruit/apply'; });
            document.getElementById("btnInquire").addEventListener("click", function() { window.location.href = '/recruit/inquire'; });

            // 지원하기 버튼 이벤트 등록
            $('.btn-notice').on('click', function (){
                // 지원서 페이지로 이동
                window.location.href = '/recruit/apply/' + (top.jobObject.recKey).toString()
            })
        }
    }

    Content.load({
        key: $('.param[name="key"]').val() || ''
    });
});
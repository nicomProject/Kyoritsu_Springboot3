$(function () {
    const Content = {
        params: {},
        load: function (params) {
            this.params = params;
            this.event();
        },
        event: function () {
            formData = {'contents' : '답변'};
            function validateField(formData) {
                for (const field in formData) {
                    console.log(field)
                    const value = document.getElementById(field).value;
                    if(!value || value === '<p>&nbsp;</p>'){ // 입력값 없음 || 기본 입력
                        Alert.warning({text: `${formData[field]}을 입력해 주세요.`})
                        return false
                    }
                }
                return true;
            }

            const paramValue = this.params.key

            var oEditors = [];
            nhn.husky.EZCreator.createInIFrame({
                oAppRef: oEditors,
                elPlaceHolder: "contents",
                sSkinURI: "/static/js/smartEditor/SmartEditor2Skin.html",
                fCreator: "createSEditor2"
            })

            if(paramValue !== ""){
                AjaxUtil.requestBody({
                    url: '/api/inquiry/findSelf',
                    data: {
                        key: paramValue,
                    },
                    success: function (data) {
                        console.log(data)
                        $(".pageSub #title").val(data.result.items[0].inquiryTitle);
                        $(".pageSub #inquiry_id").val(data.result.items[0].inquiryName);
                        $(".pageSub #create_data").val(data.result.items[0].createDate);
                        $(".pageSub #contents_question").val(data.result.items[0].inquiryContent);
                        $(".pageSub #contents").val(data.result.items[0].answer);

                        if (data.code == 200) {
                        } else {
                            Swal.fire({
                                icon: 'error',
                                html: "채용문의 조회가 실패하였습니다.",
                            })
                        }
                    }
                })
            }

            const card = $('.card-body');
            card.find('*[role="action"]').click(function(e){
                const action = this.dataset.action;

                oEditors.getById["contents"].exec("UPDATE_CONTENTS_FIELD", []);
                var answer = $("#contents").val();

                if(action === 'add' && validateField(formData)){
                    AjaxUtil.requestBody({
                        url: '/api/inquiry/addAnswer',
                        data: {
                            answer: answer,
                            key: paramValue
                        },
                        success: function (data) {
                            console.log(data)
                            if (data.code == 200) {
                                Alert.success({text: '채용문의 답변 등록이 완료되었습니다.'}, function(){
                                    location.href = '/admin/inquires'
                                })
                            } else {
                                Swal.fire({
                                    icon: 'error',
                                    html: "채용문의 답변 등록이 실패하였습니다.",
                                })
                            }
                        }
                    })
                }
                else if(action === "list"){
                    location.href = '/admin/inquires'
                }
                else if(action === "delete"){
                    AjaxUtil.requestBody({
                        url: '/api/inquiry/delete',
                        data: {
                            type: 'one',
                            id: paramValue
                        },
                        success: function (data) {
                            if(data.code === 200){
                                Alert.success({text: data.desc}, function (){
                                    location.href = '/admin/inquires'
                                })
                            }
                            else{
                                Alert.error({text: data.desc});
                            }
                        }
                    })
                }
            })
        }
    };
    Content.load({
        key: $('.param[name="key"]').val() || ''
    });
})
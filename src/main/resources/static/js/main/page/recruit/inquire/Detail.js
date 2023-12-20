$(function () {
    const Content = {
        params: {},

        load: function (params) {
            this.params = params;
            const paramValue = this.params.key
            AjaxUtil.requestBody({
                url: '/api/inquiry/findSelf/' + paramValue,
                success: function (data) {
                    console.log(data)
                    console.log(data.result.items[0])
                    console.log(data.result.items[0].inquiryName)
                    $("input[name='name']").val(data.result.items[0].inquiryName);
                    $("input[name='phone']").val(data.result.items[0].inquiryPhone);
                    $("input[name='password']").val(data.result.items[0].inquiryPwd);
                    $("input[name='secret']").prop("checked", data.result.items[0].inquirySecret);
                    $("input[name='title']").val(data.result.items[0].inquiryTitle);
                    $(".inquire-input").val((data.result.items[0].inquiryContent));

                    if (data.code == 200) {
                    } else {
                        Swal.fire({
                            icon: 'error',
                            html: "채용문의 조회가 실패하였습니다.",
                        })
                    }
                }
            })
            this.event();
        },
        event: function () {
            const paramValue = this.params.key
            const card = $('.container');
            card.find('*[role="action"]').click(function(e){
                const action = this.dataset.action;

                var nameValue = $("input[name='name']").val();
                var phoneValue = $("input[name='phone']").val();
                var passwordValue = $("input[name='password']").val();
                var textareaValue = $(".inquire-input").val();
                var titleValue = $("input[name='title']").val();
                var secretValue = $("input[name='secret']").prop("checked");

                if(action === 'update'){
                    AjaxUtil.requestBody({
                        url: '/api/inquiry/update',
                        data: {
                            inquiryName: nameValue,
                            inquiryPhone: phoneValue,
                            inquiryPwd: passwordValue,
                            inquiryContent: textareaValue,
                            inquiryTitle: titleValue,
                            inquirySecret: secretValue,
                            key: paramValue
                        },
                        success: function (data) {
                            if(data.code === 200){
                                Alert.success({text: data.desc}, function (){
                                    location.href = '/recruit/inquire'
                                })
                            }
                            else{
                                Alert.error({text: data.desc});
                            }
                        }
                    })
                }

                if(action === 'delete'){
                    AjaxUtil.requestBody({
                        url: '/api/inquiry/delete',
                        data: {
                            key: paramValue
                        },
                        success: function (data) {
                            if(data.code === 200){
                                Alert.success({text: data.desc}, function (){
                                    location.href = '/recruit/inquire'
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
    }

    Content.load({
        key: $('.param[name="key"]').val() || ''
    });
});
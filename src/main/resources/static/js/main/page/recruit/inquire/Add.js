$(function () {
    const Content = {
        load: function () {
            this.event();
        },
        event: function () {

            const card = $('.submit-btn');
            card.find('*[role="action"]').click(function(e){
                const action = this.dataset.action;

                var nameValue = $("input[name='name']").val();
                var phoneValue = $("input[name='phone']").val();
                var passwordValue = $("input[name='password']").val();
                var textareaValue = $(".inquire-input").val();
                var titleValue = $("input[name='title']").val();
                var secretValue = $("input[name='secret']").prop("checked");

                if(action === 'add'){
                    AjaxUtil.requestBody({
                        url: '/api/inquiry/add',
                        data: {
                            inquiryName: nameValue,
                            inquiryPhone: phoneValue,
                            inquiryPwd: passwordValue,
                            inquiryContent: textareaValue,
                            inquiryTitle: titleValue,
                            inquirySecret: secretValue
                        },
                        success: function (data) {
                            if (data.code == 200) {
                                Alert.success({text: '채용문의 등록이 완료되었습니다.'}, function(){
                                    location.href = '/recruit/inquire'
                                })
                            } else if(data.code === 210){
                                Alert.warning({text: data.desc})
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

    Content.load();
});
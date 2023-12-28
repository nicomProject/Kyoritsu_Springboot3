$(function () {
    const Content = {
        load: function () {
            this.event();
        },
        event: function () {
            formData = {'name' : '이름', 'phone' : '연락처', 'title' : '제목', 'textarea' : '문의내용', 'password' : '비밀번호'};

            function validateField(formData) {
                console.log(formData);
                for (const field in formData) {
                    const value = document.getElementById(field).value;
                    console.log(value);
                    if(!value) {
                        Alert.warning({text: `${formData[field]}은(는) 필수 입력 항목입니다.`});
                        return false;
                    }
                }
                return true;
            }

            const card = $('.submit-btn');
            card.find('*[role="action"]').click(function(e){
                const action = this.dataset.action;

                var nameValue = $("input[name='name']").val();
                var phoneValue = $("input[name='phone']").val();
                var passwordValue = $("input[name='password']").val();
                var titleValue = $("input[name='title']").val();
                var textareaValue = $("textarea[name='textarea']").val();
                console.log(textareaValue);
                // var secretValue = $("input[name='secret']").prop("checked");

                if(action === 'add' && validateField(formData)){
                    AjaxUtil.requestBody({
                        url: '/api/inquiry/add',
                        data: {
                            inquiryName: nameValue,
                            inquiryPhone: phoneValue,
                            inquiryPwd: passwordValue,
                            inquiryContent: textareaValue,
                            inquiryTitle: titleValue,
                            // inquirySecret: secretValue
                            inquirySecret: false, // 비활성화 고정
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
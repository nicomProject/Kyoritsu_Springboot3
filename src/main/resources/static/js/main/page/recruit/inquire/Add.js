$(function () {
    const Content = {
        load: function () {
            this.event();
        },
        event: function () {
            // 메뉴 버튼 이벤트 등록
            document.getElementById("btnEmployeeInfo").addEventListener("click", function() { window.location.href = '/recruit/employee_info'; });
            document.getElementById("btnInfo").addEventListener("click", function() { window.location.href = '/recruit/info'; });
            document.getElementById("btnNotice").addEventListener("click", function() { window.location.href = '/recruit/notice'; });
            document.getElementById("btnApply").addEventListener("click", function() { window.location.href = '/recruit/apply'; });
            document.getElementById("btnInquire").addEventListener("click", function() { window.location.href = '/recruit/inquire'; });

            // formData = {'name' : '이름', 'phone' : '연락처', 'title' : '제목', 'textarea' : '문의내용', 'password' : '비밀번호'};
            formData = {'name' : '이름', 'email' : '이메일', 'title' : '제목', 'textarea' : '문의내용', 'password' : '비밀번호'};
            const card = $('.submit-btn');
            card.find('*[role="action"]').click(function(e){
                const action = this.dataset.action;

                var nameValue = $("input[name='name']").val();
                // var phoneValue = $("input[name='phone']").val();
                var emailValue = $("input[name='email']").val();
                var passwordValue = $("input[name='password']").val();
                var titleValue = $("input[name='title']").val();
                var textareaValue = $("textarea[name='textarea']").val();
                console.log(textareaValue);
                // var secretValue = $("input[name='secret']").prop("checked");

                if(action === 'add' && ValidateField.valid(formData)){
                    AjaxUtil.requestBody({
                        url: '/api/inquiry/add',
                        data: {
                            inquiryName: nameValue,
                            // inquiryPhone: phoneValue,
                            inquiryEmail: emailValue,
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
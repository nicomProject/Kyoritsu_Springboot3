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
                    // $("input[name='phone']").val(data.result.items[0].inquiryPhone);
                    $("input[name='email']").val(data.result.items[0].inquiryEmail);
                    $("input[name='password']").val(data.result.items[0].inquiryPwd);
                    $("input[name='secret']").prop("checked", data.result.items[0].inquirySecret);
                    $("input[name='title']").val(data.result.items[0].inquiryTitle);
                    $(".inquire-input").val(data.result.items[0].inquiryContent);
                    $(".inquire-answer").html(data.result.items[0].answer);

                    // div 표시 설정
                    if(data.result.items[0].answerYn == '답변대기') {
                        document.getElementById('answerPending').style.display = 'block';
                        document.getElementById('answerComplete').style.display = 'none';
                    } else {
                        document.getElementById('answerPending').style.display = 'none';
                        document.getElementById('answerComplete').style.display = 'block';
                    }

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
            // 메뉴 버튼 이벤트 등록
            document.getElementById("btnEmployeeInfo").addEventListener("click", function() { window.location.href = '/recruit/employee_info'; });
            document.getElementById("btnInfo").addEventListener("click", function() { window.location.href = '/recruit/info'; });
            document.getElementById("btnNotice").addEventListener("click", function() { window.location.href = '/recruit/notice'; });
            document.getElementById("btnInquire").addEventListener("click", function() { window.location.href = '/recruit/inquire'; });

            // formData = {'name' : '이름', 'phone' : '연락처', 'title' : '제목', 'textarea' : '문의내용', 'password' : '비밀번호'};
            formData = {'name' : '이름', 'email' : '이메일', 'title' : '제목', 'textarea' : '문의내용', 'password' : '비밀번호'};
            const paramValue = this.params.key
            const card = $('.container');
            card.find('*[role="action"]').click(function(e){
                const action = this.dataset.action;

                var nameValue = $("input[name='name']").val();
                // var phoneValue = $("input[name='phone']").val();
                var emailValue = $("input[name='email']").val();
                var passwordValue = $("input[name='password']").val();
                var textareaValue = $(".inquire-input").val();
                var titleValue = $("input[name='title']").val();
                // var secretValue = $("input[name='secret']").prop("checked");

                if(action === 'update' && ValidateField.valid(formData)){
                    AjaxUtil.requestBody({
                        url: '/api/inquiry/update',
                        data: {
                            inquiryName: nameValue,
                            // inquiryPhone: phoneValue,
                            inquiryEmail: emailValue,
                            inquiryPwd: passwordValue,
                            inquiryContent: textareaValue,
                            inquiryTitle: titleValue,
                            // inquirySecret: secretValue,
                            inquirySecret: false, // 비활성화 고정
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
                            key: paramValue,
                            type: 'one'
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
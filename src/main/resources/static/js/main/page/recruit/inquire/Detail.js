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
                    $(".inquire-input").val(data.result.items[0].inquiryContent);

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

            const paramValue = this.params.key
            const card = $('.container');
            card.find('*[role="action"]').click(function(e){
                const action = this.dataset.action;

                var nameValue = $("input[name='name']").val();
                var phoneValue = $("input[name='phone']").val();
                var passwordValue = $("input[name='password']").val();
                var textareaValue = $(".inquire-input").val();
                var titleValue = $("input[name='title']").val();
                // var secretValue = $("input[name='secret']").prop("checked");

                if(action === 'update' && validateField(formData)){
                    AjaxUtil.requestBody({
                        url: '/api/inquiry/update',
                        data: {
                            inquiryName: nameValue,
                            inquiryPhone: phoneValue,
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
    
    // '답변완료'의 경우, 수정하지 못하도록 변경하고 답변이 보이도록 함
    var answerYnValue = data.result.items[0].answerYn;
    if(answerYnValue === '답변완료') {
        $('.buttons').hide();
    }
    
});
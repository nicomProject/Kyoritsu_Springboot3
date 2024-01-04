$(function () {
    const Content = {
        load: function () {
            this.event();
        },
        event: function () {
            const card = $('.submit-btn');
            card.find('*[role="action"]').click(function(e){
                const action = this.dataset.action;
                if(action === 'submit'){
                    var birthDate = $("#birth").val();
                    // var birthDate = "2023-12-12";

                    var jobId = $("#job").val();
                    // var jobId = 3;

                    var category = $("#category").val();
                    // var category = "category";

                    var email = $("#email").val();
                    // var email = "email";

                    var gender = $("#man")[0].checked == true ? "male" : "female";
                    // var gender = "male"

                    var name = $("#name").val();
                    // var name = "name";
                    
                    var nationality = $("#nation").val()
                    // var nationality = "nation"

                    var mobile = $("#mobile").val();
                    // var mobile = "mobile";

                    var career = $("#career").val();
                    // var career = "newcomer"

                    var address = $("#address").val();
                    var addressDetail = $("#addressDetail").val();

                    var contents = $("#contents").val();
                    // var contents = "contents";

                    AjaxUtil.requestBody({
                        url: '/api/applicant/apply',
                        data: {
                            birthDate : birthDate,
                            jobId : jobId,
                            category : category,
                            email : email,
                            gender : gender,
                            name : name,
                            nationality : nationality,
                            phone : mobile,
                            career : career,
                            contents : contents
                        },
                        success: function (data) {
                            console.log(data)
                            alert(data.desc)
                            if(data.code === 200) {
                                location.href = '/recruit/notice'
                            }
                        }
                    })
                }
                else if(action === 'preview'){
                    var name = document.getElementById('name').value;
                    var mobile = document.getElementById('mobile').value;
                    // 새 창을 열어서 apply_form.html 페이지를 불러온다.
                    var newWindow = window.open('notice/apply_popup.html', 'Application Form', 'width=1200,height=900');
                    newWindow.opener.document.getElementById('name').value = "gd";

                    newWindow.onload = function () {
                        newWindow.document.getElementById('name').value = name;
                        newWindow.document.getElementById('mobile').value = mobile;
                        // 추가로 필요한 초기화 또는 스크립트 적용
                    };
                }
            })
        }
    }

    Content.load();
});
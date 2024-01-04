$(function () {
    const Content = {
        load: function () {
            this.event();
        },
        event: function () {
            const card = $('.submit-btn');
            card.find('*[role="action"]').click(function(e){
                const action = this.dataset.action;
                const answer = $("#answer")

                if (!answer[0].checked) {
                    alert("지원 유의 사항을 확인 해 주세요.")
                    answer.focus()
                    return
                }
                if(action === 'submit' && answer){
                    var birth = $("#birth")
                    var birthDate = birth.val();

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
            });

            const contentsField = $("#contents");
            const contentsCount = $("#contentsCount");
            const contentsMaxCount = $("#contentsMaxCount");
            const countsMaxCountValue = contentsMaxCount[0].innerText;

            contentsField.on('input propertychange', function() {
                var cnt = (this.value.length);
                contentsCount[0].innerText = cnt;

                if (countsMaxCountValue < cnt) {
                    alert("최대 입력 글자수를 초과하였습니다.\n글자수 제한: "+countsMaxCountValue)
                    contentsField.val(contentsField.val().slice(0, countsMaxCountValue))
                }
            });

        }
    }

    Content.load();
});
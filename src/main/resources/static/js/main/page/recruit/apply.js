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

                    var job = $("#job");
                    var jobId = job.val();

                    var category = $("#category");
                    var categoryData = category.val();

                    var email = $("#email");
                    var emailData = email.val();

                    var gender = $("#man")[0].checked == true ? "male" : "female";

                    var name = $("#name");
                    var nameData = name.val();
                    
                    var nation = $("#nation")
                    var nationality = nation.val()

                    var mobile = $("#mobile");
                    var mobileData = mobile.val();

                    var career = $("#career");
                    var careerData = career.val();

                    var address = $("#address").val();
                    var addressDetail = $("#addressDetail").val();

                    var contents = $("#contents");
                    var contentsData = contents.val();

                    if (birthDate.length == 0) {
                        alert("생년월일은 필수 데이터입니다.")
                        birth.focus()
                        return
                    }
                    else if (jobId.length == 0) {
                        alert("채용공고 선택은 필수 데이터입니다.")
                        job.focus()
                        return
                    }
                    else if (categoryData.length == 0) {
                        alert("카테고리 선택은 필수 데이터입니다.")
                        category.focus()
                        return
                    }
                    else if (emailData.length == 0) {
                        alert("이메일은 필수 데이터입니다.")
                        email.focus()
                        return
                    }
                    else if (gender.length == 0) {
                        alert("성별은 필수 데이터입니다.")
                        gender.focus()
                        return
                    }
                    else if (nameData.length == 0) {
                        alert("성함은 필수 데이터입니다.")
                        name.focus()
                        return
                    }
                    else if (mobileData.length == 0) {
                        alert("휴대폰 번호는 필수 데이터입니다.")
                        mobile.focus()
                        return
                    }
                    else if (contentsData.length == 0) {
                        alert("자기소개서는 필수 데이터입니다.")
                        contents.focus()
                        return
                    }

                    AjaxUtil.requestBody({
                        url: '/api/applicant/apply',
                        data: {
                            birthDate : birthDate,
                            jobId : jobId,
                            category : categoryData,
                            email : emailData,
                            gender : gender,
                            name : nameData,
                            nationality : nationality,
                            phone : mobileData,
                            career : careerData,
                            contents : contentsData
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
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
                else if(action === 'preview'){
                    var formData = new FormData();
                    var fields = ['name', 'gender', 'birth', 'mobile', 'options', 'email', 'em_mobile'];

                    fields.forEach(function (field) {
                        var input = document.getElementById(field);
                        formData.append(field, input ? input.value : "");
                    });

                    // 파일 업로드 필드 추가
                    var fileInput = document.querySelector('input[type="file"]');
                    for (var i = 0; i < fileInput.files.length; i++) {
                        formData.append('files', fileInput.files[i]);
                    }

                    fields.forEach(function (field) {
                        $('#' + field + "_modal").text(formData.get(field));
                    });

                    // 라디오 버튼 값 추가
                    formData.append('answer', document.querySelector('input[name="answer"]:checked').value);

                    $('#previewContent').text(JSON.stringify(Object.fromEntries(formData.entries())));

                    $('#previewModal').modal('show');

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
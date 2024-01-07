$(function () {
    var top = this
    var jobObject = {}

    const Content = {
        supportHash: {},
        load: function (params) {
            if (params.key == 0 || params.key == undefined) {
                alert("채용 공고를 선택 해 주세요.")
                window.location.href = '/recruit/notice'
                return
            }

            const that = this;
            AjaxUtil.requestBody({
                url: '/api/job/findSelf',
                data: {
                    key: params.key
                },
                success: function (data) {
                    top.jobObject = data.result.items[0];
                    that.setJob(top.jobObject);
                },
            });
            AjaxUtil.request({
                url: '/api/category/find',
                async: false,
                success: function (data) {
                    items = data.result.items;
                    console.log(items);
                    items.forEach(menu => {
                        that.supportHash[menu.recKey] = menu.categoryName;
                    });
                    console.log(that.supportHash);
                }
            });
            this.event();
        },
        setJob: function(items) {
            const that = this;
            console.log(items)

            if (items.experience === "newcomer") {
                $('.apply-career').text("신입")
            }else if(items.experience === "career"){
                $('.apply-career').text("경력")
            }else{
                $('.apply-career').text("신입/경력")
            }

            if (items.category === "dormyinn") {
                $('.apply-title').text("[" + "도미인 호텔" + "]" + " [" + that.supportHash[items.support] + "] " + items.title)
            }

            if (items.fullTime === "contract") {
                $('.apply-fulltime').text("계약직")
            } else if (items.fullTime === "fulltime") {
                $('.apply-fulltime').text("정규직")
            }

            $('.apply-date').text(items.fromDate.slice(0, 10) + "~" + items.toDate.slice(0, 10))
        },
        event: function () {
            document.getElementById("btnEmployeeInfo").addEventListener("click", function() {
                window.location.href = '/recruit/employee_info';
            });
            document.getElementById("btnInfo").addEventListener("click", function() {
                window.location.href = '/recruit/info';
            });
            document.getElementById("btnNotice").addEventListener("click", function() {
                window.location.href = '/recruit/notice';
            });
            document.getElementById("btnApply").addEventListener("click", function() {
                window.location.href = '/recruit/apply';
            });
            document.getElementById("btnInquire").addEventListener("click", function() {
                window.location.href = '/recruit/inquire';
            });

            const profile = new FormData();
            var rawProfile;

            const card = $('.submit-btn');
            card.find('*[role="action"]').click(function(e){
                var formData = {'name' : '성함', 'birth' : '생년월일', 'email' : '이메일 주소', 'mobile' : '휴대폰 번호', 'address' : '주소'};
                const action = this.dataset.action;
                const answer = $("#answer")

                if (!answer[0].checked) {
                    alert("지원 유의 사항을 확인 해 주세요.")
                    answer.focus()
                    return
                }
                if(action === 'submit' && answer && ValidateField.valid(formData)){
                    var birthDate = $("#birth").val();
                    birthDate = birthDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
                    console.log("birthDate: "+birthDate);

                    var jobId = $("#jobId").val();
                    console.log("jobId: "+jobId);
                    // var jobId = 3;

                    var category = top.jobObject.category;
                    console.log("category: "+category);
                    // var category = "category";

                    var email = $("#email").val();
                    console.log("email: "+email);
                    // var email = "email";

                    var gender = $("#man")[0].checked == true ? "male" : "female";
                    console.log("gender: "+gender);
                    // var gender = "male"

                    var name = $("#name").val();
                    console.log("name: "+name);
                    // var name = "name";
                    
                    var nationality = $("#korean")[0].checked == true ? "korean" : "foreign";
                    console.log("nationality: "+nationality);
                    // var nationality = "nation"

                    var mobile = $("#mobile").val();
                    console.log("mobile: "+mobile);
                    // var mobile = "mobile";

                    var career = top.jobObject.experience;
                    console.log("career: "+career);
                    // var career = "newcomer"

                    var fullAddress = $("#address").val() + " " + $("#addressDetail").val();
                    console.log("fullAddress: "+fullAddress);

                    var contents = $("#contents").val();
                    console.log("contents: "+contents);
                    // var contents = "contents";

                    if(profile.get('profile') == null) {
                        Alert.warning({text: `프로필 사진을 선택해 주세요.`});
                        return false;
                    }
                    console.log("profile: "+profile.get('profile').name);

                    var files = new FormData();
                    var rawFiles = window.getFiles() || [];
                    rawFiles.forEach(rawFile => {
                        files.append('files', rawFile);
                    });
                    console.log("files: "+files);

                    AjaxUtil.requestBody({
                        url: '/api/applicant/apply',
                        data: {
                            name : name,                // 이름
                            gender : gender,            // 성별
                            nationality : nationality,  // 내국인/외국인
                            birthDate : birthDate,      // 생년월일
                            phone : mobile,             // 휴대폰 번호
                            email : email,              // 이메일 주소
                            address : fullAddress,      // 주소+상세주소
                            contents : contents,        // 자기소개서

                            category : top.jobObject.category,        // 채용공고 카테고리
                            career : top.jobObject.experience,        // 신입/경력
                            jobId : jobId,                            // 지원하는 공고 번호
                        },
                        success: function () {
                            console.log("JSON 데이터 저장 성공");
                            uploadFiles();
                        }
                    })

                    function uploadFiles() {
                        // 파일 데이터들 추가
                        var formData = new FormData();
                        formData.append('profile', rawProfile);
                        var rawFiles = window.getFiles() || [];
                        rawFiles.forEach(rawFile => {
                            formData.append('files', rawFile);
                        });
                        // 요청 보내기
                        $.ajax({
                            url:"/api/applicant/apply_files",
                            type:"post",
                            data:formData, // 프로필 & 첨부파일
                            contentType:false,
                            processData:false,
                            success:(data)=>{
                                console.log(data);
                                alert(data.desc)
                                if(data.code === 200) {
                                    location.href = '/recruit/notice'
                                }
                            },
                            error:(err)=>{
                                console.log(err);
                            }
                        })
                    }
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


            // 프로필 첨부
            $('.filebox .upload-hidden').on('change', function(){  			
                if(window.FileReader){
                    var filename = $(this)[0].files[0].name;
                    if(!validFileType(filename)){
                        alert("허용하지 않는 확장자 파일입니다.");
                        return false;
                    }else{
                        if(!validFileSize($(this)[0].files[0])){
                            alert("파일 사이즈가 10MB를 초과합니다.");
                            return false;
                        }else{
                            if(!validFileNameSize(filename)){
                                alert("파일명이 30자를 초과합니다.");
                                return false;
                            }
                        }
                    }
                    profile.append('profile', $(this)[0].files[0]);
                    rawProfile = $(this)[0].files[0];
                    if($(this)[0].files[0] == null) return false;
                    console.log(filename);
                } else {
                    var filename = $(this).val().split('/').pop().split('\\').pop();
                    console.log(filename);
                }
                $(this).prev().val(filename); //input upload-name 에 파일명 설정해주기

                readImage($(this)[0]); //미리보기
            });
            function validFileType(filename) {
                const fileTypes = ["png", "jpg", "jpeg"];
                return fileTypes.indexOf(filename.substring(filename.lastIndexOf(".")+1, filename.length).toLowerCase()) >= 0;
            }

            function validFileSize(file){
                if(file.size > 10000000){ //10MB
                    return false;
                }else{
                    return true;
                }
            }

            function validFileNameSize(filename){
                if(filename.length > 30){ //30자
                    return false;
                }else{
                    return true;
                }
            }

            //이미지 띄우기
            function readImage(input) {
                if(input.files && input.files[0]) {
                    const reader = new FileReader();
                    reader.onload = function(e){
                        const previewImage = document.getElementById("previewImg");
                        previewImage.src = e.target.result;
                    }
                    // reader가 이미지 읽도록 하기
                    reader.readAsDataURL(input.files[0]);
                }
            }
        }
    }

    Content.load({
        key: $('.param[name="key"]').val() || ''
    });
});
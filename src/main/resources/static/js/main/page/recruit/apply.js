$(function () {
    var top = this

    const Content = {
        supportHash: {}, // 현재 지원분야로 설정된 값들을 저장
        load: function (params) {
            const that = this;

            // 채용 공고를 통해 접근하도록 함
            if (params.key == 0 || params.key == undefined) {
                alert("채용 공고를 선택 해 주세요.")
                window.location.href = '/recruit/notice'
                return
            }

            // 현재 공고에 대한 정보 요청
            AjaxUtil.requestBody({
                url: '/api/job/findSelf',
                data: {
                    key : params.key
                },
                success: function (data) {
                    top.jobObject = data.result.items[0];
                    // 공고 제목 제작
                    that.setJob(top.jobObject);
                },
            });

            // 현재 지원분야에 대한 정보 요청
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

            // event 등록
            this.event();
        },

        // 공고 제목 제작
        setJob: function(items) {
            const that = this;

            // 신입/경력 정보
            if (items.experience === "newcomer") {
                $('.apply-career').text("신입")
            }else if(items.experience === "career"){
                $('.apply-career').text("경력")
            }else{
                $('.apply-career').text("신입/경력")
            }

            // 카테고리 정보
            if (items.category === "dormyinn") {
                $('.apply-title').text("[" + "도미인 호텔" + "]" + " [" + that.supportHash[items.support] + "] " + items.title)
            }

            // 정규직/계약직 정보
            if (items.fullTime === "contract") {
                $('.apply-fulltime').text("계약직")
            } else if (items.fullTime === "fulltime") {
                $('.apply-fulltime').text("정규직")
            }

            // 지원기간 정보
            $('.apply-date').text(items.fromDate.slice(0, 10) + "~" + items.toDate.slice(0, 10))
        },

        // 이벤트 등록
        event: function () {
            // field 정의
            var profile = new FormData();
            var rawProfile;

            // 메뉴 버튼 이벤트 등록
            document.getElementById("btnEmployeeInfo").addEventListener("click", function() { window.location.href = '/recruit/employee_info'; });
            document.getElementById("btnInfo").addEventListener("click", function() { window.location.href = '/recruit/info'; });
            document.getElementById("btnNotice").addEventListener("click", function() { window.location.href = '/recruit/notice'; });
            document.getElementById("btnApply").addEventListener("click", function() { window.location.href = '/recruit/apply'; });
            document.getElementById("btnInquire").addEventListener("click", function() { window.location.href = '/recruit/inquire'; });

            // 지원하기 버튼 클릭 이벤트 등록
            const card = $('.submit-btn');
            card.find('*[role="action"]').click(function(e){
                var formData = {'name' : '성함', 'birth' : '생년월일', 'email' : '이메일 주소', 'mobile' : '휴대폰 번호', 'address' : '주소'};
                const action = this.dataset.action;
                const answer = $("#answer")

                // 유의 사항 확인 여부
                if (!answer[0].checked) {
                    alert("지원 유의 사항을 확인 해 주세요.")
                    answer.focus()
                    return
                }

                // 제출하기 버튼 클릭
                if(action === 'submit' && answer && ValidateField.valid(formData)){
                    // 유효성 검사 후, 값 할당
                    var birthDate   = $("#birth").val().replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
                    var email       = $("#email").val();
                    var gender      = $("#man")[0].checked == true ? "male" : "female";
                    var name        = $("#name").val();
                    var nationality = $("#korean")[0].checked == true ? "korean" : "foreign";
                    var mobile      = $("#mobile").val();
                    var fullAddress = $("#address").val() + " " + $("#addressDetail").val();
                    var contents    = $("#contents").val();
                    var jobId       = $("#jobId").val();
                    var category    = top.jobObject.category;
                    var career      = top.jobObject.experience;

                    // 프로필 사진 유효성 검사
                    if(profile.get('profile') == null) {
                        Alert.warning({text: `프로필 사진을 선택해 주세요.`});
                        return false;
                    }

                    // 지원서 제출 요청
                    AjaxUtil.requestBody({
                        url: '/api/applicant/apply',
                        data: {
                            name        : name,         // 이름
                            gender      : gender,       // 성별
                            nationality : nationality,  // 내국인/외국인
                            birthDate   : birthDate,    // 생년월일
                            phone       : mobile,       // 휴대폰 번호
                            email       : email,        // 이메일 주소
                            address     : fullAddress,  // 주소+상세주소
                            contents    : contents,     // 자기소개서
                            category    : category,     // 채용공고 카테고리
                            career      : career,       // 신입/경력
                            jobId       : jobId,        // 지원하는 공고 번호
                        },
                        success: function (data) {
                            // DB 저장 성공 확인
                            console.log("JSON 데이터 저장 성공");
                            const recKey = data.result;
                            console.log("applicant recKey: "+recKey);
                            // 파일 업로드 진행
                            uploadFiles(recKey);
                        }
                    });

                    // 파일 업로드 함수
                    function uploadFiles(recKey) {
                        // 파일 데이터들 추가
                        var formData = new FormData();
                        formData.append('profile', rawProfile);
                        var rawFiles = window.getFiles() || [];
                        rawFiles.forEach(rawFile => {
                            formData.append('files', rawFile);
                        });

                        // DB 저장을 위한 key,name 추가
                        formData.append('recKey', recKey);
                        formData.append('name', $("#name").val());

                        // 파일 저장 요청
                        $.ajax({
                            url         :   "/api/applicant/apply_files",
                            type        :   "post",
                            data        :   formData, // 프로필 & 첨부파일
                            contentType :   false,    // formData 전송 시 설정
                            processData :   false,    // formData 전송 시 설정

                            success:(data)=>{
                                // 파일 저장 성공 확인
                                alert(data.desc)
                                // 채용 공고로 이동
                                if(data.code === 200) {
                                    location.href = '/recruit/notice'
                                }
                            },
                            error:(err)=>{
                                // err 출력
                                console.log(err);
                            }
                        })
                    }
                }

                // 미리보기 버튼 클릭
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

            // 자기소개서 입력 제한 설정 (최대 10000자)
            const contentsField         =   $("#contents");
            const contentsCount         =   $("#contentsCount");
            const contentsMaxCount      =   $("#contentsMaxCount");
            const countsMaxCountValue   =   contentsMaxCount[0].innerText;
            // 자기소개서 글자 개수 업데이트
            contentsField.on('input propertychange', function() {
                var cnt = (this.value.length);
                contentsCount[0].innerText = cnt;
                // 자기소개서 입력 제한
                if (countsMaxCountValue < cnt) {
                    alert("최대 입력 글자수를 초과하였습니다.\n글자수 제한: "+countsMaxCountValue)
                    contentsField.val(contentsField.val().slice(0, countsMaxCountValue))
                }
            });

            // 프로필 첨부 버튼 클릭
            $('.fileboxProfile .upload-hidden').on('change', function(){  			
                // 윈도우 fileReader일 경우
                if(window.FileReader){
                    // 파일 미선택 시 종료
                    if($(this)[0].files[0] == null) return false;

                    // 파일 로드 
                    var filename = $(this)[0].files[0].name;
                    console.log(filename);

                    // 검증 (확장자, 파일크기, 파일명)
                    if(!validFileType(filename)){
                        alert("허용하지 않는 확장자 파일입니다. (지원하는 확장자: png, jpg, jpeg)");
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

                    // formData에 프로필 저장
                    profile.append('profile', $(this)[0].files[0]);
                    rawProfile = $(this)[0].files[0];
                } 
                // 이외 파일 업로드의 경우
                else {
                    var filename = $(this).val().split('/').pop().split('\\').pop();
                    console.log(filename);
                }

                // upload-name에 파일명 설정
                $(this).prev().val(filename);

                // 프로필 미리보기 설정
                readImage($(this)[0]);
            });

            // 프로필 확장자 확인 (png, jpg, jpeg만 가능)
            function validFileType(filename) {
                const fileTypes = ["png", "jpg", "jpeg"];
                return fileTypes.indexOf(filename.substring(filename.lastIndexOf(".")+1, filename.length).toLowerCase()) >= 0;
            }

            // 프로필 사진 크기 제한
            function validFileSize(file){
                if(file.size > 10000000){ //10MB
                    return false;
                }else{
                    return true;
                }
            }

            // 프로필 사진 파일명 길이 제한
            function validFileNameSize(filename){
                if(filename.length > 30){ //30자
                    return false;
                }else{
                    return true;
                }
            }

            // 프로필 미리보기
            function readImage(input) {
                if(input.files && input.files[0]) {
                    const reader = new FileReader();
                    reader.onload = function(e){
                        const previewImage = document.getElementById("previewImg");
                        previewImage.src = e.target.result;
                    }
                    // reader가 이미지 읽도록 설정
                    reader.readAsDataURL(input.files[0]);
                }
            }
        }
    }

    Content.load({
        key: $('.param[name="key"]').val() || ''
    });
});
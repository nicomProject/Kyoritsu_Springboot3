$(function () {
    const Content = {
        params: {},
        formData: {},

        load: function (params) {
            this.params = params;

            // event 등록
            this.event();
        },

        // 이벤트 등록
        event: function () {
            const paramValue = this.params.key
            formData = {'title' : '제목', 'Datefrom' : '시작일', 'Dateto' : '종료일', 'contents' : '본문'};

            // smart editor 필수 코드
            var oEditors = [];
            nhn.husky.EZCreator.createInIFrame({
                oAppRef: oEditors,
                elPlaceHolder: "contents",
                sSkinURI: "/static/js/smartEditor/SmartEditor2Skin.html",
                fCreator: "createSEditor2"
            })

            // dataURL을 Blob으로 변환하는 함수
            function dataURLtoBlob(dataURL) {
                // Base64 데이터를 디코딩
                var byteString = atob(dataURL.split(',')[1]);

                // 문자열을 ArrayBuffer로 변환
                var ab = new ArrayBuffer(byteString.length);
                var ia = new Uint8Array(ab);
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }

                // ArrayBuffer를 Blob 객체로 변환
                var blob = new Blob([ab], { type: 'image/png' }); // 이미지 유형을 필요에 따라 변경 가능

                return blob;
            }

            // imageURL을 Blob으로 변환하는 함수
            async function imageURLtoBlob(imageURL) {
                return new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    xhr.onload = function () {
                    const reader = new FileReader();
                    reader.onloadend = function () {
                        resolve(new Blob([reader.result], { type: 'image/jpeg' }));
                    };
                    reader.onerror = reject;
                    reader.readAsArrayBuffer(xhr.response);
                    };
                    xhr.onerror = reject;
                    xhr.open('GET', imageURL);
                    xhr.responseType = 'blob';
                    xhr.send();
                });
            }

            // 동기처리 이미지 업로드 함수
            async function uploadImages(contentsValue) {
                // field 정의
                var promises = []
                var parser = new DOMParser()
                var contentHTML = parser.parseFromString(contentsValue, "text/html")
                var imgTag = contentHTML.querySelectorAll("img")

                // 모든 이미지 태그에 대해 src 변환 진행
                for(var i = 0; i<imgTag.length; i++) {
                    // promise 변수에 저장
                    var promise = new Promise(async function (resolve, reject) {
                        var img = imgTag[i]
                        var imgSrc = img.getAttribute("src");

                        // 기존 imgSrc 확인
                        console.log(imgSrc);

                        var blob;
                        var isNewFile = false;
                        // 해당 이미지 src가 외부 URL 파일일 경우 (http ~)
                        if(imgSrc.includes("http")) {
                            blob = await imageURLtoBlob(imgSrc);
                            isNewFile = true;
                        }
                        // 해당 이미지 src가 데이터 URL 파일일 경우 (data ~)
                        else if(imgSrc.includes("data")) {
                            blob = dataURLtoBlob(imgSrc);
                            isNewFile = true;
                        }
                        // **로컬 파일의 경우는 smart editor에서 자체적으로 막혀 있음**

                        // 변경된 blob 확인
                        console.log(blob);

                        // 새로 추가된 이미지만 formData에 저장
                        var formData = new FormData();
                        if(isNewFile == true) formData.append('images', blob, 'image' + i + '.png');

                        // 이미지 업로드 요청
                        $.ajax({
                            url: '/api/uploadImages',
                            type: 'POST',
                            data: formData,
                            async: true,
                            cache: false,
                            contentType: false,
                            processData: false,
                            success: function (data) {
                                console.log('서버 응답:', data);
                                // 이미 존재하는 이미지의 경우 src 수정하지 않음
                                if(!data.includes("This image already exists")) {
                                    var imageUrl = data;
                                    var imageSrc = "/storage/images/" + imageUrl;
                                    contentsValue = contentsValue.replace(imgSrc, imageSrc);
                                }
                                resolve()
                            },
                            error: function(data){
                                console.log(data)
                                reject()
                            }
                        });
                    })

                    // promises에 저장
                    promises.push(promise);
                }
                // promise 실행
                await Promise.all(promises);

                // 결과 반환
                return contentsValue
            }

            function dateValidate(dateTo, dateFrom) {
                var vaild = (dateTo >= dateFrom)
                if (!vaild) {
                    Alert.warning({text: "시작일이 종료일보다 클 수 없습니다."})
                }
                return vaild
            }

            // key값이 있을 때 -> 공지사항 요청
            if(paramValue !== ""){
                // 공지사항 상세내용 요청
                AjaxUtil.requestBody({
                    url: '/api/notice/findSelf',
                    data: {
                        key: paramValue,
                    },
                    success: function (data) {
                        // 결과 데이터 매핑
                        $(".pageSub #category").val(data.result.items[0].category);
                        $(".pageSub #title").val(data.result.items[0].title);
                        $(".pageSub #contents").val(data.result.items[0].content);
                        $(".pageSub #create_user").val(data.result.items[0].createUser);
                        $(".pageSub #create_data").val(data.result.items[0].createDate);
                        $(".pageSub #hit").val(data.result.items[0].hit)
                        $(".pageSub #Datefrom").val(data.result.items[0].fromDate.substring(0, 10));
                        $(".pageSub #Dateto").val(data.result.items[0].toDate.substring(0, 10));

                        if (data.code == 200) {
                        } else {
                            Swal.fire({
                                icon: 'error',
                                html: "공지사항 조회가 실패하였습니다.",
                            })
                        }
                    }
                })
            }

            // 버튼 이벤트 추가
            const card = $('.card-body');
            card.find('*[role="action"]').click(async function(e){
                const action = this.dataset.action;

                // smart editor 필수 코드 추가
                oEditors.getById["contents"].exec("UPDATE_CONTENTS_FIELD", []);

                // 값 받아오기
                var categoryValue = $("#category").val();
                var titleValue    = $("#title").val();
                var contentsValue = $("#contents").val();
                var Dateto        = $("#Dateto").val();
                var Datefrom      = $("#Datefrom").val();

                // 공지사항 등록 버튼 이벤트 등록
                if(action === 'add' && ValidateField.valid(formData) && dateValidate(Dateto, Datefrom)){
                    // 이미지 업로드
                    contentsValue = await uploadImages(contentsValue)

                    // 공지사항 등록 요청
                    AjaxUtil.requestBody({
                        url: '/api/notice/add',
                        data: {
                            category    : categoryValue,
                            title       : titleValue,
                            contents    : contentsValue,
                            date_from   : Datefrom,
                            date_to     : Dateto
                        },
                        success: function (data) {
                            if (data.code == 200) {
                                Alert.success({text: '공지사항 등록이 완료되었습니다.'}, function(){
                                    location.href = '/admin/notices'
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

                // 공지사항 업데이트 버튼 이벤트 등록
                else if(action === "update" && ValidateField.valid(formData) && dateValidate(Dateto, Datefrom)){
                    // 이미지 업로드
                    contentsValue = await uploadImages(contentsValue)

                    // 공지사항 업데이트 요청
                    AjaxUtil.requestBody({
                        url: '/api/notice/update',
                        data: {
                            category    : categoryValue,
                            title       : titleValue,
                            contents    : contentsValue,
                            date_from   : Datefrom,
                            date_to     : Dateto,
                            key         : paramValue
                        },
                        success: function (data) {
                            if (data.code == 200) {
                                Alert.success({text: '공지사항이 수정되었습니다.'}, function(){
                                    location.href = '/admin/notices'
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

                // 목록 버튼 이벤트 등록
                else if(action === "list"){
                    // 공지사항 리스트로 이동
                    location.href = '/admin/notices'
                }

                // 공지사항 삭제 이벤트 등록
                else if(action === "delete"){
                    // 채용문의 삭제 요청
                    AjaxUtil.requestBody({
                        url: '/api/notice/delete',
                        data: {
                            type: 'one',
                            id: paramValue
                        },
                        success: function (data) {
                            console.log(data)
                            if(data.code === 200){
                                Alert.success({text: data.desc}, function (){
                                    location.href = '/admin/notices'
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
    };

    Content.load({
        key: $('.param[name="key"]').val() || ''
    });
})
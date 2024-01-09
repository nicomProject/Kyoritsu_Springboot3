$(function () {
    const Content = {
        categorys: [],
        subCategorys: [],
        params: {},
        formData: {},

        load: function (params) {
            const that = this;

            const category = $("#category");
            const sub_category = $("#sub_category");
            let items = [];
            let paramValue = params.key

            // 사용자 메뉴 리스트 요청
            AjaxUtil.request({
                url: '/api/main/setting/category',
                async: false,
                success: function (data) {
                    items = data.result.items;
                }
            });

            // 사용자 메뉴 리스트 저장
            const categoryHash = {};
            items.map(e => e.menu).forEach(group => {
                categoryHash[group.recKey] = group;
            });
            Object.keys(categoryHash).forEach(key => {
                category.append($('<option>', {
                        value: key,
                        text: categoryHash[key].name,
                    }
                ));
            });
            const changeFunc = function(){
                sub_category.empty();
                items.forEach(item => {
                    if(Number(category.val()) === item.menu.recKey){
                        sub_category.append($('<option>', {
                            value: item.recKey,
                            text: item.name
                        }));
                    }
                });
            }
            changeFunc();

            category.on('change', function() {
                changeFunc();
            });

            // key값이 있을 때 -> 문의사항 요청
            if(paramValue !== ""){
                // 소개글 상세내용 요청
                AjaxUtil.requestBody({
                    url: '/api/introductions/findSelf',
                    data: {
                        key: paramValue,
                    },
                    success: function (data) {
                        // 결과 데이터 매핑
                        $(".pageSub #category").val(data.result.items[0].category);
                        $(".pageSub #sub_category").val(data.result.items[0].subcategory);
                        $(".pageSub #title").val(data.result.items[0].title);
                        $(".pageSub #sub_title").val(data.result.items[0].subtitle);
                        $(".pageSub #contents").val(data.result.items[0].content);

                        changeFunc();

                        if (data.code == 200) {
                        } else {
                            Swal.fire({
                                icon: 'error',
                                html: "소개글 조회가 실패하였습니다.",
                            })
                        }
                    }
                })
            }
            this.params = params;
            console.log(this.params)

            // event 추가
            this.event();
        },

        // 이벤트 추가
        event: function () {
            formData = {'title' : '제목', 'sub_title' : '소제목', 'contents' : '본문'};

            // smarteidtor 필수 코드
            var oEditors = [];
            nhn.husky.EZCreator.createInIFrame({
                oAppRef: oEditors,
                elPlaceHolder: "contents",
                sSkinURI: "/static/js/smartEditor/SmartEditor2Skin.html",
                fCreator: "createSEditor2"
            });

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

            // 버튼 이벤트 추가
            const buttons = document.querySelectorAll("button");
            const paramKey = this.params.key
            buttons.forEach(function (button) {
                button.addEventListener("click", async function () {
                    const action = button.getAttribute("data-action");

                    // smart editor 필수 코드 추가
                    oEditors.getById["contents"].exec("UPDATE_CONTENTS_FIELD", []);

                    // 소개글 등록 / 업데이트 버튼 이벤트 등록
                    if (action === "add") {
                        var titleValue = $("#title").val();
                        var sub_titleValue = $("#sub_title").val();
                        var contentsValue = $("#contents").val();
                        var categoryValue = $("#category").val();
                        var sub_categoryValue = $("#sub_category").val();

                        // 소개글 등록 버튼 이벤트 등록
                        if(paramKey === "" && ValidateField.valid(formData)){
                            // 이미지 업로드
                            contentsValue = await uploadImages(contentsValue)

                            // 소개글 등록 요청
                            AjaxUtil.requestBody({
                                url: '/api/introductions/add',
                                data: {
                                    title           : titleValue,
                                    sub_title       : sub_titleValue,
                                    contents        : contentsValue,
                                    category        : categoryValue,
                                    sub_category    : sub_categoryValue
                                },
                                success: function (data) {
                                    if(data.code === 200){
                                        Alert.success({text: data.desc}, function (){
                                            location.href = '/admin/introductions'
                                        })
                                    }else if(data.code === 210){
                                        Alert.warning({text: data.desc})
                                    }
                                    else{
                                        Alert.error({text: data.desc});
                                    }
                                }
                            })
                        }
                        
                        // 소개글 업데이트 버튼 이벤트 등록
                        else if(paramKey !== "" && ValidateField.valid(formData)){
                            // 이미지 업로드
                            contentsValue = await uploadImages(contentsValue)

                            // 소개글 등록 요청
                            AjaxUtil.requestBody({
                                url: '/api/introductions/update',
                                data: {
                                    title           : titleValue,
                                    sub_title       : sub_titleValue,
                                    contents        : contentsValue,
                                    category        : categoryValue,
                                    sub_category    : sub_categoryValue,
                                    key: paramKey
                                },
                                success: function (data) {
                                    console.log(data)
                                    if(data.code === 200){
                                        Alert.success({text: data.desc}, function (){
                                            location.href = '/admin/introductions'
                                        })
                                    }else if(data.code === 210){
                                        Alert.warning({text: data.desc})
                                    }
                                    else{
                                        Alert.error({text: data.desc});
                                    }
                                }
                            })
                        }
                    }

                    // 목록 버튼 이벤트 등록
                    else if(action === "list"){
                        // 소개글 리스트로 이동
                        location.href = '/admin/introductions'
                    }

                    // 소개글 삭제 이벤트 등록
                    else if(action === "delete"){
                        // 소개글 삭제 요청
                        AjaxUtil.requestBody({
                            url: '/api/introductions/delete',
                            data: {
                                type: 'one',
                                id: paramKey
                            },
                            success: function (data) {
                                if(data.code === 200){
                                    Alert.success({text: data.desc}, function (){
                                        location.href = '/admin/introductions'
                                    })
                                }
                                else{
                                    Alert.error({text: data.desc});
                                }
                            }
                        })
                    }
                });
            });

        }
    };
    Content.load({
        key: $('.param[name="key"]').val() || '',
    });
})
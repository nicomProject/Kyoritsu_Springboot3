$(function () {
    const Content = {
        params: {},
        formData: {},
        load: function (params) {
            this.params = params;
            console.log(this.params)
            this.event();
        },
        event: function () {
            const paramValue = this.params.key
            formData = {'title' : '제목', 'contents' : '본문'};

            var oEditors = [];
            nhn.husky.EZCreator.createInIFrame({
                oAppRef: oEditors,
                elPlaceHolder: "contents",
                sSkinURI: "/static/js/smartEditor/SmartEditor2Skin.html",
                fOnAppLoad : function(){
                    fn_checkClipboard();//추가한 함수
                },
                fCreator: "createSEditor2"
            })

            function dataURLtoBlob(dataURL) {
                // Base64 데이터를 디코딩합니다.
                var byteString = atob(dataURL.split(',')[1]);

                // 문자열을 ArrayBuffer로 변환합니다.
                var ab = new ArrayBuffer(byteString.length);
                var ia = new Uint8Array(ab);
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }

                // ArrayBuffer를 Blob 객체로 변환합니다.
                var blob = new Blob([ab], { type: 'image/png' }); // 이미지 유형을 필요에 따라 변경할 수 있습니다.

                return blob;
            }

            function fn_checkClipboard() {
                var target_se2 = document.querySelector("iframe").contentWindow.document.querySelector("iframe").contentWindow.document.querySelector(".se2_inputarea");

                var observer = new MutationObserver(function (mutationsList) {
                    mutationsList.forEach(function (mutation) {
                        if (mutation.type === "childList" || mutation.type === "characterData") {
                            // 변경된 노드를 모두 가져오기
                            var changedNodes = Array.from(target_se2.querySelectorAll("p"));

                            checkForImg(changedNodes);
                        }
                    });
                });


                observer.observe(target_se2, { subtree: true, characterData: true, childList: true });

                function checkForImg(changedNodes) {
                    changedNodes.forEach(function (pElement, index) {
                        var imgElement = pElement.querySelector("img");
                        if (imgElement) {
                            var imgSrc = imgElement.getAttribute("src");

                            // imgSrc가 데이터 URL이라면
                            if (imgSrc.startsWith('data:')) {
                                var blob = dataURLtoBlob(imgSrc);
                                var formData = new FormData();
                                formData.append('images', blob, 'image' + index + '.png');

                                var xhr = new XMLHttpRequest();
                                xhr.open('POST', '/api/uploadImages', true);

                                xhr.onload = function () {
                                    if (xhr.status === 200) {
                                        console.log('서버 응답:', xhr.responseText);
                                        var imageUrl = xhr.responseText;

                                        var imageSrc = "/static/images/" + imageUrl;
                                        imgElement.setAttribute("src", imageSrc);
                                    } else {
                                        console.error('서버 응답 에러:', xhr.status);
                                    }
                                };

                                xhr.send(formData);
                            } else {
                                console.log("외부 URL 이미지는 업로드하지 않습니다.");
                            }
                        }
                    });
                }
            }


            if(paramValue !== ""){
                AjaxUtil.requestBody({
                    url: '/api/notice/findSelf',
                    data: {
                        key: paramValue,
                    },
                    success: function (data) {
                        console.log(data)
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

            const card = $('.card-body');
            card.find('*[role="action"]').click(function(e){
                oEditors.getById["contents"].exec("UPDATE_CONTENTS_FIELD", []);

                const action = this.dataset.action;
                var categoryValue = $("#category").val();
                var titleValue = $("#title").val();
                var contentsValue = $("#contents").val();
                var Dateto = $("#Dateto").val();
                var Datefrom = $("#Datefrom").val();

                if(action === 'add' && ValidateField.valid(formData)){
                    AjaxUtil.requestBody({
                        url: '/api/notice/add',
                        data: {
                            category: categoryValue,
                            title: titleValue,
                            contents: contentsValue,
                            date_from: Datefrom,
                            date_to: Dateto
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
                else if(action === "update" && ValidateField.valid(formData)){

                    AjaxUtil.requestBody({
                        url: '/api/notice/update',
                        data: {
                            category: categoryValue,
                            title: titleValue,
                            contents: contentsValue,
                            key: paramValue
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
                else if(action === "list"){
                    location.href = '/admin/notices'
                }
                else if(action === "delete"){
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
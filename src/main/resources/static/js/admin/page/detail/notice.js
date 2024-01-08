$(function () {
    const Content = {
        params: {},
        formData: {},
        load: function (params) {
            this.params = params;
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

            async function uploadImages(contentsValue) {
                var promises = []
                var parser = new DOMParser()
                var contentHTML = parser.parseFromString(contentsValue, "text/html")
                var imgTag = contentHTML.querySelectorAll("img")

                for(var i = 0; i<imgTag.length; i++) {
                    var promise = new Promise(function (resolve, reject) {
                        var img = imgTag[i]
                        var imgSrc = img.getAttribute("src");
                        if(imgSrc.includes("http")) {
                            alert("외부 URL 이미지 파일은 첨부할 수 없습니다.")
                            return
                        }

                        var blob = dataURLtoBlob(imgSrc);
                        var formData = new FormData();
                        formData.append('images', blob, 'image' + i + '.png');

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
                                var imageUrl = data;
                                var imageSrc = "/storage/images/" + imageUrl;
                                contentsValue = contentsValue.replace(imgSrc, imageSrc);
                                resolve()
                            },
                            error: function(data){
                                console.log(data)
                                reject()
                            }
                        });
                    })
                    promises.push(promise);
                }
                await Promise.all(promises);

                return contentsValue
            }

            if(paramValue !== ""){
                AjaxUtil.requestBody({
                    url: '/api/notice/findSelf',
                    data: {
                        key: paramValue,
                    },
                    success: function (data) {
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
            card.find('*[role="action"]').click(async function(e){
                oEditors.getById["contents"].exec("UPDATE_CONTENTS_FIELD", []);

                const action = this.dataset.action;
                var categoryValue = $("#category").val();
                var titleValue = $("#title").val();
                var contentsValue = $("#contents").val();
                var Dateto = $("#Dateto").val();
                var Datefrom = $("#Datefrom").val();

                if(action === 'add' && ValidateField.valid(formData)){
                    contentsValue = await uploadImages(contentsValue)
                    // console.log(contentsValue)
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
                    contentsValue = await uploadImages(contentsValue)
                    // console.log(contentsValue)
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
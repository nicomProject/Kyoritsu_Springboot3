$(function(){
    const Content = {
        load: function(){

            // new daum.Postcode({
            //     oncomplete: function(data) {
            //         // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분입니다.
            //         // 예제를 참고하여 다양한 활용법을 확인해 보세요.
            //     }
            // }).open();
            this.event();
        },
        event: function () {

            $('#btnNotice2').on('click', function (){
                // 카테고리
                var selectedCategory = $('.question-box.question-1 input[type=radio]:checked').val();
                var selectedFacility = $('.question-box.question-2 input[type=radio]:checked').val();
                var textFacility = $('.question-box.question-2 input[type=text]').val();
                var textQuestion = $('.question-box.question-3 textarea').val();
                var textEmail = $('.question-box.question-4 input[type=text]').val();
                var textEmailCheck = $('.question-box.question-5 input[type=text]').val();


                if (!selectedCategory) {
                    document.querySelector('.question-box.question-1 .error').style.display = 'block';
                } else {
                    document.querySelector('.question-box.question-1 .error').style.display = 'none';
                }
                if (!selectedFacility && !textFacility) {
                    document.querySelector('.question-box.question-2 .error').style.display = 'block';
                } else {
                    document.querySelector('.question-box.question-2 .error').style.display = 'none';
                }
                if (!textQuestion) {
                    document.querySelector('.question-box.question-3 .error').style.display = 'block';
                } else {
                    document.querySelector('.question-box.question-3 .error').style.display = 'none';
                }
                if (!textEmail) {
                    document.querySelector('.question-box.question-4 .error').style.display = 'block';
                } else {
                    document.querySelector('.question-box.question-4 .error').style.display = 'none';
                }
                if (!textEmailCheck) {
                    document.querySelector('.question-box.question-5 .error').style.display = 'block';
                } else {
                    document.querySelector('.question-box.question-5 .error').style.display = 'none';
                }

                if (!selectedCategory || (!selectedFacility && !textFacility) || !textQuestion || !textEmail || !textEmailCheck) {
                    Alert.warning({text: "필수값을 전부 입력해주세요"})
                } else {

                    AjaxUtil.requestBody({
                        url: '/api/contact/add',
                        data: {
                            selectedCategory: selectedCategory,
                            selectedFacility: selectedFacility,
                            textFacility: textFacility,
                            textQuestion: textQuestion,
                            textEmail: textEmail,
                            textEmailCheck: textEmailCheck,
                        },

                        success: function (data) {
                            console.log(data)
                            if (data.code == 200)
                            {
                                Alert.success({text: '문의사항이 등록되었습니다.'}, function(){
                                    window.location.reload();
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
            })
        }
    };

    Content.load();
})
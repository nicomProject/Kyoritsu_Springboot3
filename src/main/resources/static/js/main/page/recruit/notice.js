$(function () {

    const Content = {
        supportHash: {}, // 현재 지원분야로 설정된 값들을 저장
        load: function () {
            const that = this;

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

            // 현재 채용 공고에 대한 요청
            AjaxUtil.request({
                method: 'GET',
                url: '/api/job/find',
                async: false,
                success: function (data) {
                    // 채용 공고 리스트 제작
                    that.setJobObject(data.result.items)
                }
            });

            // event 등록
            this.event();
        },

        // 이벤트 등록
        event: function () {
            const that = this

            // 메뉴 버튼 이벤트 등록
            document.getElementById("btnEmployeeInfo").addEventListener("click", function() { window.location.href = '/recruit/employee_info'; });
            document.getElementById("btnInfo").addEventListener("click", function() { window.location.href = '/recruit/info'; });
            document.getElementById("btnNotice").addEventListener("click", function() { window.location.href = '/recruit/notice'; });
            document.getElementById("btnApply").addEventListener("click", function() { window.location.href = '/recruit/apply'; });
            document.getElementById("btnInquire").addEventListener("click", function() { window.location.href = '/recruit/inquire'; });
            // 현재 메뉴 버튼 활성화
            document.querySelectorAll('button').forEach(function(button) {
                button.classList.remove('activation');
                if(button.id == "btnNotice") button.classList.add('activation');
            });

            // 카테고리 검색 이벤트 등록
            $('.btn[role="action"][data-action="search"]').on('click', function() {
                that.performSearch();
            });

            // 텍스트 검색 이벤트 등록
            $('#searchText').on('keydown', function(event) {
                if (event.key === 'Enter') {
                    that.performSearch();
                }
            });

            // '전체' 키워드 클릭 이벤트 등록
            $('#category-total').on('click', function() {
                that.categorySearch("total");
            });
            // '도미인 호텔' 키워드 클릭 이벤트 등록
            $('#category-dormyinn').on('click', function() {
                that.categorySearch("dormyinn");
            });

        },

        // 카테고리 버튼 검색 함수
        categorySearch: function(search) {
            var that = this

            // 아무 값도 없을 때는 '전체' 검색으로 간주
            if (search == "" || search == undefined) {
                search = "total"
            }

            // 검색 키워드에 따른 채용 공고 요청
            AjaxUtil.requestBody({
                url: '/api/job/findCategorySelf',
                data: {
                    category: search
                },
                success: function (data) {
                    console.log(data);
                    // 채용 공고 리스트 제작
                    that.setJobObject(data.result.items);
                }
            });
        },

        // 텍스트 검색 함수
        performSearch: function(search) {
            var that = this;

            // 아무 값도 없을 때는 '전체' 검색으로 간주
            if (search == "" || search == undefined) {
                search = $('#searchText').val();
            }

            // 검색 키워드에 따른 채용 공고 요청
            AjaxUtil.requestBody({
                url: '/api/job/search',
                data: {
                    title: search
                },
                success: function (data) {
                    console.log(data);
                    // 채용 공고 리스트 제작
                    that.setJobObject(data.result.items);
                }
            });
        },

        // 채용 공고 리스트 제작 함수
        setJobObject: function(jobs) {
            const that = this;
            const language = document.getElementById('language').value;
            const content = { kr: "현재 채용공고가 없습니다.", eng: "There are currently no job openings.", jp: "現在、求人募集はありません。" };

            // container 로드
            var newNoticeContainer = document.querySelector(".new-graduates.card-box");
            var careerNoticeContainer = document.querySelector(".mid-career.card-box");

            // 신입 채용 공고 리스트
            var newFirstChild = newNoticeContainer.firstElementChild
            newNoticeContainer.innerHTML = ''
            newNoticeContainer.appendChild(newFirstChild)

            // 경력 채용 공고 리스트
            var careerFirstChild = careerNoticeContainer.firstElementChild
            careerNoticeContainer.innerHTML = ''
            careerNoticeContainer.appendChild(careerFirstChild)

            // 공고 제작
            jobs.forEach(item => {
                var jobObject = {}

                // 채용 공고 기간 내 항목만 추가
                var nowTime = Date.now()
                if (!(nowTime >= Date.parse(item.fromDate) && nowTime <= Date.parse(item.toDate))) return;

                // 신입/경력 정보
                if (item.experience == "newcomer") {
                    jobObject.parentClass = ".new-graduates.card-box"
                    jobObject.experience = "신입"
                } else if (item.experience == "career") {
                    jobObject.parentClass = ".mid-career.card-box"
                    jobObject.experience = "경력"
                } 

                // 정규직/계약직 정보
                if (item.fullTime == "fulltime") {
                    jobObject.fulltime = "정규직"
                } else if (item.fullTime == "contract") {
                    jobObject.fulltime = "계약직"
                }

                // 카테고리 정보
                if (item.category == "dormyinn") {
                    jobObject.title = "[" + "도미인 호텔" + "]" + " [" + that.supportHash[item.support] + "]"
                }

                // 채용 공고 id 정보
                if(item.recKey != null){
                    jobObject.recKey = item.recKey
                }

                // 채용 공고명 및 채용기간 설정
                jobObject.title += " " + item.title
                jobObject.date = item.fromDate.slice(0, 10) + "~" + item.toDate.slice(0, 10)

                // 공고 제작
                this.createJob(jobObject)
            })

            if ((newNoticeContainer.childElementCount) == 1) { // 등록된 신입 지원 공고가 없는 경우
                var nonNotice = document.createElement('div');
                nonNotice.className = "notice-list";
                nonNotice.style.backgroundColor = "lightgray"
                nonNotice.innerText = content[language];
                newNoticeContainer.appendChild(nonNotice);
            }
            if ((careerNoticeContainer.childElementCount) == 1) { // 등록된 경력 지원 공고가 없는 경우
                var nonNotice = document.createElement('div');
                nonNotice.className = "notice-list";
                nonNotice.style.backgroundColor = "lightgray"
                nonNotice.innerText = content[language];
                careerNoticeContainer.appendChild(nonNotice);
            }
        },

        // 공고 제작 함수
        createJob: function(jobObject) {
            // 부모 요소 가져오기
            var noticeListContainer = document.querySelector(jobObject.parentClass);

            // 새로운 li 엘리먼트 생성
            var noticeItem = document.createElement('li');
            noticeItem.className = 'notice-item'; // 클래스 추가

            // 하위 레벨의 a 태그 생성
            var noticeLink = document.createElement('a');
            noticeLink.href = '/recruit/notice/detail/' + jobObject.recKey;

            // 상위 레벨의 div 생성
            var topLineDiv = document.createElement('div');
            topLineDiv.className = 'top-line';

            // Career Category 생성
            var careerCategoryDiv = document.createElement('div');
            careerCategoryDiv.className = 'career-category';
            var careerCategorySpan = document.createElement('span');
            careerCategorySpan.textContent = jobObject.experience;
            careerCategoryDiv.appendChild(careerCategorySpan);

            // 정규직/계약직 생성
            var fulltimeDiv = document.createElement('div');
            fulltimeDiv.className = 'fulltime';
            var fulltimeSpan = document.createElement('span');
            fulltimeSpan.textContent = jobObject.fulltime;
            console.log(jobObject.fulltime);
            fulltimeDiv.appendChild(fulltimeSpan);

            // Career Title 생성
            var careerTitleDiv = document.createElement('div');
            careerTitleDiv.className = 'career-title';
            careerTitleDiv.textContent = jobObject.title;

            // Top Line에 추가
            topLineDiv.appendChild(careerCategoryDiv);
            topLineDiv.appendChild(fulltimeDiv);
            topLineDiv.appendChild(careerTitleDiv);

            // Bottom Line 생성
            var bottomLineDiv = document.createElement('div');
            bottomLineDiv.className = 'bottom-line';

            // 지원기간 추가
            var regularDiv = document.createElement('div');
            regularDiv.textContent = '지원기간';
            var recruitmentDiv = document.createElement('div');
            recruitmentDiv.textContent = jobObject.date;

            // Bottom Line에 추가
            bottomLineDiv.appendChild(regularDiv);
            bottomLineDiv.appendChild(recruitmentDiv);

            // 공유 아이콘 추가
            // var shareIconDiv = document.createElement('div');
            // shareIconDiv.className = 'share-icon';
            // var shareIcon = document.createElement('i');
            // shareIcon.className = 'fas fa-solid fa-share';
            // shareIconDiv.appendChild(shareIcon);

            // 최종적으로 생성된 엘리먼트들을 조립
            noticeLink.appendChild(topLineDiv);
            noticeLink.appendChild(bottomLineDiv);
            // noticeLink.appendChild(shareIconDiv);

            // 새로운 li 엘리먼트 생성
            var dep1Div = document.createElement('li');
            dep1Div.appendChild(noticeLink);

            // 새로운 ul 엘리먼트 생성
            var noticeList = document.createElement('ul');
            noticeList.className = "notice-list";
            noticeList.appendChild(dep1Div);

            // 부모 요소에 추가
            noticeListContainer.appendChild(noticeList);
        }
    }

    Content.load();
});
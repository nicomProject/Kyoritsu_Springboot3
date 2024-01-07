$(function () {
    const Content = {
        supportHash: {},
        load: function () {
            const that = this;
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

            const that = this
            const $body = $('body');
            const navbar = $('.navbar');

            navbar.find('.navbar-close').on({
                click: function (e) {
                    $body.removeClass('g-sidenav-pinned');
                }
            });
            navbar.find('.navbar-open').on({
                click: function (e) {
                    $body.addClass('g-sidenav-pinned');
                }
            });

            navbar.find('.sidenav-button').on({
                click: function (e) {
                    const icon = $(this).find('i');
                    icon.toggleClass('fa-compress');
                    icon.toggleClass('fa-thumbtack');
                    $body.toggleClass('g-sidenav-hidden');
                }
            })

            $('.btn[role="action"][data-action="search"]').on('click', function() {
                that.performSearch();
            });
            $('#searchText').on('keydown', function(event) {
                if (event.key === 'Enter') {
                    that.performSearch();
                }
            });

            // 이거는 카테고리로 검색하는 API 만들어서 처리해야할듯.
            $('#category-total').on('click', function() {
                that.categorySearch("total");
            });
            $('#category-dormyinn').on('click', function() {
                that.categorySearch("dormyinn");
            });
            // $('#category-resort').on('click', function() {
            //     that.categorySearch("resort");
            // });

            AjaxUtil.request({
                method: 'GET',
                url: '/api/job/find',
                async: false,
                success: function (data) {
                    that.setJobObject(data.result.items)
                }
            });
        },
        categorySearch: function(search) {
            var that = this
            if (search == "" || search == undefined) {
                search = "total"
            }

            AjaxUtil.requestBody({
                url: '/api/job/findCategorySelf',
                data: {
                    category: search
                },
                success: function (data) {
                    console.log(data);
                    that.setJobObject(data.result.items);
                }
            });
        },
        performSearch: function(search) {
            var that = this;
            if (search == "" || search == undefined) {
                search = $('#searchText').val();
            }

            AjaxUtil.requestBody({
                url: '/api/job/search',
                data: {
                    title: search
                },
                success: function (data) {
                    console.log(data);
                    that.setJobObject(data.result.items);
                }
            });
        },
        setJobObject: function(jobs) {
            const that = this;
            var newNoticeContainer = document.querySelector(".new-graduates.card-box");
            var careerNoticeContainer = document.querySelector(".mid-career.card-box");

            var newFirstChild = newNoticeContainer.firstElementChild
            newNoticeContainer.innerHTML = ''
            newNoticeContainer.appendChild(newFirstChild)

            var careerFirstChild = careerNoticeContainer.firstElementChild
            careerNoticeContainer.innerHTML = ''
            careerNoticeContainer.appendChild(careerFirstChild)
            
            jobs.forEach(item => {
                // 채용 공고 기간에 따라 항목 추가
                var nowTime = Date.now()
                if (!(nowTime >= Date.parse(item.fromDate) && nowTime <= Date.parse(item.toDate))) {
                    return
                }

                var jobObject = {}

                console.log(item)

                if (item.experience == "newcomer") {
                    jobObject.parentClass = ".new-graduates.card-box"
                    jobObject.experience = "신입"
                } else if (item.experience == "career") {
                    jobObject.parentClass = ".mid-career.card-box"
                    jobObject.experience = "경력"
                } 
                // else if (item.experience == "Synthesis") {
                //     jobObject.parentClass = ".both.card-box"
                //     jobObject.experience = "신입/경력"
                // }

                if (item.fullTime == "fulltime") {
                    jobObject.fulltime = "정규직"
                } else if (item.fullTime == "contract") {
                    jobObject.fulltime = "계약직"
                }

                if (item.category == "dormyinn") {
                    jobObject.title = "[" + "도미인 호텔" + "]" + " [" + that.supportHash[item.support] + "]"
                }

                if(item.recKey != null){
                    jobObject.recKey = item.recKey
                }

                jobObject.title += " " + item.title
                jobObject.date = item.fromDate.slice(0, 10) + "~" + item.toDate.slice(0, 10)

                this.createJob(jobObject)
            })
        },
        createJob: function(jobObject) {
            // 부모 요소 가져오기
            var noticeListContainer = document.querySelector(jobObject.parentClass);

            // 새로운 li 엘리먼트 생성
            var noticeItem = document.createElement('li');
            noticeItem.className = 'notice-item'; // 클래스 추가

            // 하위 레벨의 a 태그 생성
            var noticeLink = document.createElement('a');
            noticeLink.href = '/recruit/notice/detail/' + jobObject.recKey; // 원하는 href 값으로 변경

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

            // 정규직, 상시모집 추가
            var regularDiv = document.createElement('div');
            regularDiv.textContent = jobObject.fulltime;
            var recruitmentDiv = document.createElement('div');
            recruitmentDiv.textContent = jobObject.date;

            // Bottom Line에 추가
            bottomLineDiv.appendChild(regularDiv);
            bottomLineDiv.appendChild(recruitmentDiv);

            // 공유 아이콘 추가
            var shareIconDiv = document.createElement('div');
            shareIconDiv.className = 'share-icon';
            var shareIcon = document.createElement('i');
            shareIcon.className = 'fas fa-solid fa-share';
            shareIconDiv.appendChild(shareIcon);

            // 최종적으로 생성된 엘리먼트들을 조립
            noticeLink.appendChild(topLineDiv);
            noticeLink.appendChild(bottomLineDiv);
            noticeLink.appendChild(shareIconDiv);

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